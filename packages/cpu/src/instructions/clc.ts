import { ProcessorStatuses } from "../processor-statuses";
import { State } from "../w65c02s";

export const clc = {
  implied: (state: State): void => {
    state.processorStatuses &= ~ProcessorStatuses.CARRY;
  }
};
