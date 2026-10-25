// React & JSX ambient shims for Originkit components in standalone/browser environment

declare module 'react' {
  export type CSSProperties = Record<string, string | number | undefined>;
  export interface MutableRefObject<T> {
    current: T;
  }
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T = unknown>(): MutableRefObject<T | null>;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface Element extends Record<string, any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
