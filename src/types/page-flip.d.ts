// Minimal typings for StPageFlip 2.0.7 (the package ships none).
declare module 'page-flip/dist/js/page-flip.module.js' {
  export interface FlipSettings {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startPage?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEvent<T = unknown> {
    data: T;
  }

  export class PageFlip {
    constructor(el: HTMLElement, settings: FlipSettings);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on(event: 'flip', cb: (e: FlipEvent<number>) => void): this;
    on(event: 'changeOrientation', cb: (e: FlipEvent<'portrait' | 'landscape'>) => void): this;
    on(event: 'changeState', cb: (e: FlipEvent<string>) => void): this;
    on(event: 'init' | 'update', cb: (e: FlipEvent<{ page: number; mode: 'portrait' | 'landscape' }>) => void): this;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(page: number, corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    destroy(): void;
  }
}
