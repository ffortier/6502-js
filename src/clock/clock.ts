import { EventEmitter } from 'events';

export class Clock extends EventEmitter {
  private _intervalId?: number;

  constructor(
    private time: number,
    private _setInterval = setInterval as (handler: () => void, time?: number) => number,
    private _clearInterval = clearInterval as (intervalId: number | undefined) => void,
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
