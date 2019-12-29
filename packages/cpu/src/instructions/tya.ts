import { State } from "../w65c02s";
import { ProcessorStatuses } from "../processor-statuses";

export const tya = {
  implied: (state: State): void => {
    state.aRegister = state.xRegister;
    state.processorStatuses |= state.aRegister === 0 ? ProcessorStatuses.ZERO : 0;
  }
};
