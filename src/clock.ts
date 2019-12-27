export class Clock extends EventTarget {
  private _intervalId?: number;

  constructor(
    private time: number,
  ) {
    super();
  }

  start(): void {
    this._intervalId = window.setInterval(() => {
      this.dispatchEvent(new CustomEvent('tick'));
    }, this.time);
  }

  stop(): void {
    clearInterval(this._intervalId);
  }
}
