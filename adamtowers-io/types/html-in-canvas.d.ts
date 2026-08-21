// Ambient types for the experimental HTML-in-canvas API (WICG explainer:
// https://github.com/WICG/html-in-canvas). Not yet in TypeScript's DOM lib or
// @webgpu/types — shipped behind chrome://flags/#canvas-place-element.

interface ElementImageSource {
  source: Element;
  sx?: number;
  sy?: number;
  swidth?: number;
  sheight?: number;
}

interface ElementImageDestination {
  destination: {texture: GPUTexture};
  width: number;
  height: number;
}

declare global {
  interface HTMLCanvasElement {
    /** True when this canvas's children participate in layout/hit-testing instead of being inert fallback content. */
    layoutSubtree?: boolean;
    onpaint: ((this: HTMLCanvasElement, ev: Event) => void) | null;
    requestPaint?(): void;
    captureElementImage?(element: Element): unknown;
  }

  interface GPUQueue {
    copyElementImageToTexture?(
      source: ElementImageSource,
      destination: ElementImageDestination,
    ): void;
  }
}

declare module 'react' {
  interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    /**
     * Opts canvas descendants into layout and hit-testing (HTML-in-canvas API).
     * React doesn't know this is a boolean HTML attribute, so a bare `true` is
     * silently dropped instead of being written to the DOM — pass a string.
     */
    layoutsubtree?: string;
  }
}

export {};
