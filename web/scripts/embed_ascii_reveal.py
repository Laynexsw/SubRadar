"""
SubRadar — Embed Ascii Reveal (Dither + Decode Engine) & Originkit Tiles Loader into code.html
"""
import os
import re

WEB_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CORE_JS = os.path.join(WEB_DIR, 'js', 'ascii-reveal-core.js')
TILES_JS = os.path.join(WEB_DIR, 'js', 'tiles-loader.js')
CODE_HTML = os.path.join(WEB_DIR, 'code.html')

def embed():
    # Read Ascii Reveal Core
    with open(CORE_JS, 'r', encoding='utf-8') as f:
        core_code = f.read()

    if 'export{' in core_code:
        core_code = core_code.split('export{')[0].strip()
    elif 'export {' in core_code:
        core_code = core_code.split('export {')[0].strip()

    # Read Tiles Loader Core
    with open(TILES_JS, 'r', encoding='utf-8') as f:
        tiles_code = f.read()

    # Strip ES module exports for inline browser bundle
    tiles_code = tiles_code.replace('export function initTilesLoader', 'function initTilesLoader')
    tiles_code = tiles_code.replace('export function playTilesLoader', 'function playTilesLoader')
    tiles_code = tiles_code.replace('export ', '')

    tiles_bundle = f"""<script id="sr-bundle-tiles-loader-js">
/* =========================================================================
   SubRadar — Originkit "Tiles Loader" Component
   Direct Vanilla JS Port of Originkit Tiles Loader (@originkit/tiles-loader)
   ========================================================================= */
(function () {{
{tiles_code}

  // Auto-start loader immediately upon encounter
  initTilesLoader({{
    minTime: 2.0,
    revealS: 1.4
  }});
}})();
</script>"""

    reveal_bundle = f"""<script id="sr-bundle-ascii-reveal-js">
/* =========================================================================
   SubRadar — Ascii Reveal Dither + Decode Engine
   Direct Port of quanhoangindex/ascii-reveal
   ========================================================================= */
(function () {{
{core_code}

  var ditherDecodePreset = {{
    ramp: " ░▒▓█.:-=+*#%@",
    scramble: "░▒▓█0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=?/",
    mode: "ramp",
    color: "mono",
    cells: [20, 14, 10, 7, 5],
    tick: 55
  }};

  window.srDitherDecodePreset = ditherDecodePreset;

  function initPageAsciiReveal() {{
    var revealFn = window.createAsciiReveal;
    if (typeof revealFn !== 'function') return;

    var targets = [
      {{ sel: '#site-header .header-island-inner', origin: 'center', delay: 0, speed: 1.3 }},
      {{ sel: '[data-od-id="hero"] > div:not(.relative)', origin: 'top-left', delay: 0, speed: 1.2 }},
      {{ sel: '#hero-mock-window', origin: 'top-left', delay: 70, speed: 1.15 }},
      {{ sel: '[data-od-id="sorun"]', origin: 'center', delay: 130, speed: 1.15 }},
      {{ sel: '#ekstre-laboratuvari', origin: 'center', delay: 180, speed: 1.15 }},
      {{ sel: '#hesaplayici', origin: 'center', delay: 240, speed: 1.15 }},
      {{ sel: '#karsilastirma', origin: 'center', delay: 300, speed: 1.15 }},
      {{ sel: '#ozellikler', origin: 'center', delay: 360, speed: 1.15 }},
      {{ sel: '#isletim-sistemleri', origin: 'center', delay: 420, speed: 1.15 }},
      {{ sel: '#fiyatlandirma', origin: 'center', delay: 480, speed: 1.15 }},
      {{ sel: '#faq', origin: 'center', delay: 540, speed: 1.15 }}
    ];

    targets.forEach(function (item) {{
      var els = document.querySelectorAll(item.sel);
      els.forEach(function (el) {{
        if (!el || el.closest('.hidden')) return;
        setTimeout(function () {{
          try {{
            var ctrl = revealFn(el, {{
              preset: ditherDecodePreset,
              duration: 'fast',
              speed: item.speed || 1.15,
              origin: item.origin || 'center'
            }});
            ctrl.reveal().catch(function () {{}});
          }} catch (err) {{
            console.warn('[Ascii Reveal on load]', item.sel, err);
          }}
        }}, item.delay);
      }});
    }});
  }}

  window.srInitAsciiRevealLoader = initPageAsciiReveal;

  function launchSiteEntrance() {{
    if (window.srTilesLoaderDone) {{
      initPageAsciiReveal();
    }} else {{
      window.addEventListener('subradar:tiles-loader-complete', function () {{
        initPageAsciiReveal();
      }}, {{ once: true }});
    }}
  }}

  if (document.readyState === 'loading') {{
    document.addEventListener('DOMContentLoaded', launchSiteEntrance);
  }} else {{
    launchSiteEntrance();
  }}
}})();
</script>"""

    with open(CODE_HTML, 'r', encoding='utf-8') as f:
        code_html = f.read()

    # 1. Ensure Google Fonts Instrument Serif is present
    font_snippet = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>'
    if 'Instrument+Serif' not in code_html:
        marker = '<!-- Tailwind CSS -->'
        if marker in code_html:
            code_html = code_html.replace(marker, font_snippet + '\n' + marker)

    # 2. Ensure body.sr-loading-lock CSS rule is in <style>
    lock_css = 'body.sr-loading-lock { overflow: hidden !important; }'
    if 'body.sr-loading-lock' not in code_html:
        code_html = code_html.replace('</style>', f'\n  /* Scroll lock while Originkit Tiles Loader is active */\n  {lock_css}\n</style>')

    # 3. Clean up any existing #sr-tiles-loader or sr-bundle-tiles-loader-js
    if '<script id="sr-bundle-tiles-loader-js">' in code_html:
        start_idx = code_html.find('<script id="sr-bundle-tiles-loader-js">')
        end_idx = code_html.find('</script>', start_idx) + len('</script>')
        code_html = code_html[:start_idx] + code_html[end_idx:]

    # Remove existing #sr-tiles-loader if present
    code_html = re.sub(r'<!-- ===+ -->\s*<!-- ORIGINKIT TILES LOADER.*?-->\s*<div id="sr-tiles-loader".*?</div>\s*</div>\s*', '', code_html, flags=re.DOTALL)
    code_html = re.sub(r'<div id="sr-tiles-loader".*?</div>\s*</div>\s*', '', code_html, flags=re.DOTALL)

    tiles_html = """<!-- ========================================================================= -->
<!-- ORIGINKIT TILES LOADER (https://originkit.dev/components/tiles-loader)    -->
<!-- ========================================================================= -->
<div id="sr-tiles-loader" aria-label="Yükleniyor" role="status" style="position: fixed; inset: 0; z-index: 999999; width: 100vw; height: 100vh; overflow: hidden; isolation: isolate; background: #EEEAE3;">
  <div id="sr-tiles-grid" style="position: absolute; inset: 0; overflow: hidden;"></div>
  <div id="sr-tiles-counter" aria-hidden="true" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; mix-blend-mode: difference; color: #ffffff; pointer-events: none; white-space: nowrap; font-family: 'Instrument Serif', 'Times New Roman', Times, serif; font-size: min(28vh, 36vw); font-variant-numeric: tabular-nums; opacity: 0; user-select: none; z-index: 10;">
    <span style="display: inline-flex; align-items: flex-start;">
      <span id="sr-tiles-num">0</span>
      <span style="font-size: 0.3em; font-style: italic; margin-top: 0.9em; margin-left: 0.08em;">%</span>
    </span>
  </div>
</div>"""

    loader_top_block = tiles_html + '\n' + tiles_bundle

    # Insert loader container AND loader script right at the top of <body>
    body_marker = '<body class="bg-black text-white selection:bg-white selection:text-black antialiased overflow-x-hidden min-h-screen">'
    if body_marker in code_html:
        code_html = code_html.replace(body_marker, body_marker + '\n' + loader_top_block)
    else:
        # Fallback to <body
        body_idx = code_html.find('<body')
        if body_idx != -1:
            end_body_tag = code_html.find('>', body_idx) + 1
            code_html = code_html[:end_body_tag] + '\n' + loader_top_block + code_html[end_body_tag:]

    # 4. Insert or update Ascii Reveal bundle near bottom
    if '<script id="sr-bundle-ascii-reveal-js">' in code_html:
        start_tag = '<script id="sr-bundle-ascii-reveal-js">'
        end_tag = '</script>'
        start_idx = code_html.find(start_tag)
        end_idx = code_html.find(end_tag, start_idx) + len(end_tag)
        code_html = code_html[:start_idx] + reveal_bundle + code_html[end_idx:]
        print("Updated existing reveal bundle in code.html")
    else:
        marker = '<script id="sr-pwa-sw">'
        if marker in code_html:
            code_html = code_html.replace(marker, reveal_bundle + '\n\n' + marker)
            print("Inserted reveal bundle before sr-pwa-sw")
        else:
            code_html = code_html.replace('</body>', reveal_bundle + '\n</body>')
            print("Inserted reveal bundle before </body>")

    with open(CODE_HTML, 'w', encoding='utf-8') as f:
        f.write(code_html)

    print("Successfully embedded Originkit Tiles Loader & Ascii Reveal into code.html")

if __name__ == '__main__':
    embed()
