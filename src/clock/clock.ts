import { EventEmitter } from 'events';

export class Clock extends EventEmitter {
  private _intervalId?: number;

  constructor(
    private time: number,
    private _setInterval = setInterval as typeof window.setInterval,
    private _clearInterval = clearInterval as typeof window.clearInterval,
  ) {
    super();
  }

  start(): void {
    this._intervalId = this._setInterval(() => {
      this.emit('tick');
    }, this.time);
  }

  stop(): void {
    this._clearInterval(this._intervalId);
  }
}
