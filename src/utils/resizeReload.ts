export class ResizeReloader {
  private initialWidth: number;
  private resizeTimeout: number | null = null;
  private readonly threshold: number;
  private readonly debounceTime: number;

  constructor(threshold: number = 300, debounceTime: number = 1000) {
    this.initialWidth = window.innerWidth;
    this.threshold = threshold;
    this.debounceTime = debounceTime;
    this.init();
  }

  private init(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      const currentWidth = window.innerWidth;
      const widthDifference = Math.abs(currentWidth - this.initialWidth);

      if (widthDifference >= this.threshold) {
        window.location.reload();
      }

      this.initialWidth = currentWidth;
    }, this.debounceTime);
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}
