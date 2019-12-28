import { ProcessorStatuses } from "../processor-statuses";
import { State } from "../w65c02s";

export const ror = {
  accumulatorA: (state: State): void => {
    state.aRegister = (state.aRegister >> 1) | (state.processorStatuses & ProcessorStatuses.CARRY ? 0b1000000 : 0);
  }
};
