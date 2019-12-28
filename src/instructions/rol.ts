import { ProcessorStatuses } from "../processor-statuses";
import { State } from "../w65c02s";

export const rol = {
  accumulatorA: (state: State): void => {
    state.aRegister = (state.aRegister << 1) | (state.processorStatuses & ProcessorStatuses.CARRY ? 0b0000001 : 0);
  }
};
