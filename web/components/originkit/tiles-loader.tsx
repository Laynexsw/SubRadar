// @ts-nocheck
/// <reference path="./react-shim.d.ts" />
// Tiles Loader — Originkit

"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react"

const RenderTarget = {
    current: () => "preview",
    hasRestrictions: () => false,
    canvas: "canvas",
    export: "export",
    preview: "preview",
    thumbnail: "thumbnail",
}

type EdPhase = "loading" | "reveal" | "page"
interface EdFrame {
    t: number
    dt: number

    progress: number

    reveal: number
    phase: EdPhase

    w: number
    h: number
}
interface EdScene {
    revealS: number
    reset?(): void
    frame(f: EdFrame): void
}
interface EdOptions {
    minTime: number
    onComplete?: () => void
}
interface FramerFont {
    fontFamily?: string
    fontWeight?: number | string
    fontStyle?: string
    fontSize?: number | string
    lineHeight?: number | string
    letterSpacing?: number | string
}

const ED_HOLD_S = 1.8
const ED_FADE_S = 0.35
const ED_SERIF = '"Instrument Serif", "Times New Roman", Times, serif'
const ED_SANS = '"Inter", "Helvetica Neue", Arial, sans-serif'

function edRand(seed: number): () => number {
    let a = seed >>> 0
    return function () {
        a = (a + 0x6d2b79f5) >>> 0
        let t = a
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function edLoadCurve(seed: number, loadS: number): (t: number) => number {
    const r = edRand(seed)
    const k = Math.min(1, loadS / 4.4)
    const chunks: { size: number; start: number; len: number }[] = []
    let total = 0
    for (let i = 0; i < 7; i++) {
        const size = 0.4 + r() * 1.2
        chunks.push({ size, start: r() * 0.78 * loadS, len: (0.25 + r() * 0.9) * k })
        total += size
    }
    chunks.push({ size: total * 0.12, start: loadS - 0.45 * k, len: 0.45 * k })
    total *= 1.12
    return (t) => {
        if (t >= loadS) return 1
        let p = 0
        for (const c of chunks) {
            const x = Math.min(1, Math.max(0, (t - c.start) / Math.max(1e-3, c.len)))
            p += c.size * x * x * (3 - 2 * x)
        }
        return Math.min(0.999, p / total)
    }
}

function edRealLoad(): number {
    if (typeof document === "undefined") return 1
    if (document.readyState === "complete") return 1
    const imgs = document.images
    let done = 0
    for (let i = 0; i < imgs.length; i++) if (imgs[i].complete) done++
    const frac = imgs.length ? done / imgs.length : 1
    const fonts = document.fonts && document.fonts.status === "loaded" ? 1 : 0
    return Math.min(0.95, 0.15 + 0.6 * frac + 0.2 * fonts)
}

const edClamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x)

const edSeg = (x: number, a: number, b: number): number => edClamp((x - a) / Math.max(1e-6, b - a))
const edLerp = (a: number, b: number, t: number): number => a + (b - a) * t
const edOutExpo = (x: number): number => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x))
const edOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3)
const edInCubic = (x: number): number => x * x * x
const edInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const edInOutQuart = (x: number): number => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)
const edPad = (n: number, digits: number): string => String(Math.round(n)).padStart(digits, "0")

function edFont(font: FramerFont | undefined, fallbackFamily: string): CSSProperties {
    const f = font || {}
    return {
        fontFamily: f.fontFamily || fallbackFamily,
        fontWeight: f.fontWeight ?? 400,
        fontStyle: f.fontStyle || "normal",
        letterSpacing: f.letterSpacing ?? "-0.02em",
        lineHeight: f.lineHeight ?? 1,
    }
}

function edRootStyle(style: CSSProperties | undefined): CSSProperties {
    return {
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 1200,
        minHeight: 800,
        overflow: "hidden",

        containerType: "size",
        isolation: "isolate",
        ...style,
    }
}

const useEdLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function useEditorialLoader(
    rootRef: MutableRefObject<HTMLDivElement | null>,
    sceneRef: MutableRefObject<EdScene>,
    optsRef: MutableRefObject<EdOptions>
) {
    useEdLayoutEffect(() => {
        const root = rootRef.current
        if (!root) return
        const onCanvas = RenderTarget.current() === RenderTarget.canvas
        const reduced =
            typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

        let w = root.offsetWidth
        let h = root.offsetHeight
        let t = 0
        let progress = 0
        let revealAt = -1
        let finished = false
        let loadS = 1
        let curve = edLoadCurve(7, 1)

        const draw = (dt: number) => {
            const revealS = reduced ? 0.4 : sceneRef.current.revealS
            const reveal = revealAt < 0 ? 0 : edClamp((t - revealAt) / revealS)
            const phase: EdPhase = revealAt < 0 ? "loading" : reveal < 1 ? "reveal" : "page"
            try {
                sceneRef.current.frame({ t, dt, progress, reveal, phase, w, h })
            } catch (e) {
                console.error(e)
            }
        }
        const restart = () => {
            loadS = reduced ? 0.6 : Math.max(0.5, optsRef.current.minTime)
            curve = edLoadCurve(7, loadS)
            t = 0
            progress = 0
            revealAt = -1
            const s = sceneRef.current
            s.reset && s.reset()
        }
        restart()
        draw(0)

        const ro = new ResizeObserver(() => {
            w = root.offsetWidth
            h = root.offsetHeight
            if (!finished) draw(0)
        })
        ro.observe(root)

        let raf = 0
        let last = -1
        const tick = (now: number) => {
            const dt = last < 0 ? 0 : Math.min(0.05, (now - last) / 1000)
            last = now
            t += dt
            const revealS = reduced ? 0.4 : sceneRef.current.revealS
            if (revealAt < 0) {
                const target = onCanvas ? curve(t) : Math.min(curve(t), edRealLoad())
                progress = target >= 1 ? 1 : Math.min(target, progress + dt * 1.5)
                if (progress >= 1 && t >= loadS) revealAt = t
            }
            draw(dt)
            if (revealAt >= 0 && t - revealAt >= revealS) {
                if (onCanvas) {
                    if (t - revealAt >= revealS + ED_HOLD_S) {
                        restart()
                        draw(0)
                    }
                } else {
                    finished = true
                    root.style.transition = `opacity ${ED_FADE_S}s ease`
                    root.style.opacity = "0"
                    root.style.pointerEvents = "none"
                    window.setTimeout(() => {
                        root.style.visibility = "hidden"
                    }, ED_FADE_S * 1000)
                    optsRef.current.onComplete && optsRef.current.onComplete()
                    return
                }
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
        }
    }, [])
}

const REVEAL_S = 1.6
const PAPER = "#EEEAE3"
const INK = "#151412"

const SHORT_SIDE = 7

const INK_WINDOW = 0.04

interface Props {
    minTime?: number
    font?: FramerFont
    background?: string
    accent?: string
    onComplete?: () => void
    style?: CSSProperties
}

function __OriginkitBase_Tiles(props: Props) {
    const { minTime = 14, font, background = "#EEEAE3", accent = "#151412", style } = props
    const [grid, setGrid] = useState({ cols: 11, rows: 7 })
    const { cols, rows } = grid
    const count = cols * rows

    const rootRef = useRef<HTMLDivElement>(null)
    const tileRefs = useRef<(HTMLDivElement | null)[]>([])
    const paperRefs = useRef<(HTMLDivElement | null)[]>([])
    const countRef = useRef<HTMLDivElement>(null)
    const numRef = useRef<HTMLSpanElement>(null)
    tileRefs.current.length = paperRefs.current.length = count

    const order = useRef<number[]>([])
    if (order.current.length !== count) {
        const r = edRand(count * 7919 + 13)
        order.current = Array.from({ length: count }, () => r() * (1 - INK_WINDOW))
    }

    useEffect(() => {
        const root = rootRef.current
        if (!root) return
        const fit = () => {
            const w = root.offsetWidth, h = root.offsetHeight
            if (!w || !h) return
            const cell = Math.min(w, h) / SHORT_SIDE
            const next = { cols: Math.max(1, Math.round(w / cell)), rows: Math.max(1, Math.round(h / cell)) }
            setGrid((g: { cols: number; rows: number }) => (g.cols === next.cols && g.rows === next.rows ? g : next))
        }
        fit()
        const ro = new ResizeObserver(fit)
        ro.observe(root)
        return () => ro.disconnect()
    }, [])

    const optsRef = useRef<EdOptions>({ minTime })
    optsRef.current = { minTime, onComplete: props.onComplete }
    const sceneRef = useRef<EdScene>({ revealS: REVEAL_S, frame() {} })
    sceneRef.current = {
        revealS: REVEAL_S,
        frame({ t, progress, reveal }: EdFrame) {
            const u = order.current
            for (let i = 0; i < count; i++) {
                const paper = paperRefs.current[i]
                if (paper) paper.style.opacity = String(1 - edSeg(progress, u[i], u[i] + INK_WINDOW))
                const tile = tileRefs.current[i]
                if (!tile) continue
                const c = i % cols, r = Math.floor(i / cols)
                const d = 0.5 * (cols > 1 ? c / (cols - 1) : 0) + 0.5 * (rows > 1 ? (rows - 1 - r) / (rows - 1) : 0)
                const e = edInOutCubic(edSeg(reveal, d * 0.55, d * 0.55 + 0.45))
                tile.style.transform = `scale(${1 - e})`
            }
            const num = numRef.current
            const digits = String(Math.round(progress * 100))
            if (num && num.textContent !== digits) num.textContent = digits
            const label = countRef.current
            if (label) label.style.opacity = String(edOutCubic(edSeg(t, 0.1, 0.8)) * (1 - edSeg(reveal, 0, 0.15)))
        },
    }
    useEditorialLoader(rootRef, sceneRef, optsRef)

    return (
        <div ref={rootRef} style={edRootStyle(style)}>
            {Array.from({ length: count }, (_, i) => {
                const c = i % cols, r = Math.floor(i / cols)
                return (
                    <div
                        key={`${cols}x${rows}-${i}`}
                        ref={(el) => {
                            tileRefs.current[i] = el
                        }}
                        style={{
                            position: "absolute",
                            left: `${(c * 100) / cols}%`,
                            top: `${(r * 100) / rows}%`,

                            width: `calc(${100 / cols}% + 1px)`,
                            height: `calc(${100 / rows}% + 1px)`,
                            background: accent,
                        }}
                    >
                        <div
                            ref={(el) => {
                                paperRefs.current[i] = el
                            }}
                            style={{ position: "absolute", inset: 0, background }}
                        />
                    </div>
                )
            })}
            {}
            <div
                ref={countRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mixBlendMode: "difference",
                    color: "#fff",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    ...edFont(font, ED_SERIF),
                    fontSize: "min(30cqh, 40cqw)",
                    fontVariantNumeric: "tabular-nums",
                    opacity: 0,
                }}
            >
                <span style={{ display: "inline-flex", alignItems: "flex-start" }}>
                    <span ref={numRef} />
                    <span style={{ fontSize: "0.3em", fontStyle: "italic", marginTop: "0.9em", marginLeft: "0.08em" }}>%</span>
                </span>
            </div>
        </div>
    )
}

const __originkitPresetProps = {
  "font": {
    "fontFamily": "Inter",
    "variant": "Regular",
    "fontWeight": 400,
    "fontSize": "16px",
    "lineHeight": "1em",
    "letterSpacing": "-0.04em",
    "textAlign": "left"
  }
};

export default function Tiles(props: Record<string, unknown>) {
  return <__OriginkitBase_Tiles {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
