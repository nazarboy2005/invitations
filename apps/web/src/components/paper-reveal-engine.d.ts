export interface PaperRenderer {
  canvas: HTMLCanvasElement;
  lost: boolean;
  listeners: Set<() => void>;
  scene: {
    render(
      options: Record<string, unknown>,
      sheets: Record<string, unknown>[],
    ): { pw: number; ph: number };
    setImage(key: string, image: CanvasImageSource, fade: boolean): void;
    removeItem(key: string): void;
    creaseReady(
      width: number,
      height: number,
      dpr: number,
      seed: number,
    ): boolean;
    pumpCrease(milliseconds: number, now: number): void;
    fading(key: string): boolean;
  };
}
export function acquireRenderer(): Promise<PaperRenderer>;
export function releaseRenderer(renderer: PaperRenderer): void;
