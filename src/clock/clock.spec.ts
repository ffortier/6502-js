import { Clock } from "./clock";

describe('clock', () => {
  const time = 1337;
  const intervalId = 42;

  let clock: Clock;
  let setInterval: jasmine.Spy<(handler: () => void, time?: number) => number>;
  let clearInterval: jasmine.Spy<(intervalId: number | undefined) => void>;
  let tickListener: jasmine.Spy;

  beforeEach(() => {
    tickListener = jasmine.createSpy('tickListener');
    setInterval = jasmine.createSpy('setInterval').and.returnValue(intervalId);
    clearInterval = jasmine.createSpy('clearInterval');

    clock = new Clock(time, setInterval, clearInterval);

    clock.on('tick', tickListener);
  });

  it('should not start any intervals yet', () => {
    expect(setInterval).not.toHaveBeenCalled();
  });

  it('should not emit any events yet', () => {
    expect(tickListener).not.toHaveBeenCalled();
  });

  describe('when the clock starts', () => {
    beforeEach(() => {
      clock.start();
    });

    it('should set an interval', () => {
      expect(setInterval).toHaveBeenCalledWith(jasmine.any(Function), time);
    });

    describe('calling the interval handler', () => {
      beforeEach(() => {
        const [handler] = setInterval.calls.mostRecent().args;

        handler();
      });

      it('should emit an event', () => {
        expect(tickListener).toHaveBeenCalledWith();
      });
    });

    describe('when the clock stops', () => {
      beforeEach(() => {
        clock.stop();
      });

      it('should clear the interval', () => {
        expect(clearInterval).toHaveBeenCalledWith(intervalId);
      });
    });
  });
});
