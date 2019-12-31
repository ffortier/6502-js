import { Value, AbsoluteValue } from "../parser";

export function assertAbsoluteValue(value: Value | undefined): asserts value is AbsoluteValue {
  if (value?.type !== 'absolute') {
    throw new Error('expected absolute value');
  }
}

export function assertDefined<T>(value: T | undefined): asserts value is T {
  if (typeof value === 'undefined') {
    throw new Error('expected value to be defined');
  }
}
