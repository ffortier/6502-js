import { Instruction } from "./instruction";
import { ProcessorStatuses } from "../processor-statuses";

export const bne = {
  relative: (): Instruction[] => {
    return [
      (state, memory) => {
        const offset = memory.readByte(state.programCounter++);

        if (!(state.processorStatuses & ProcessorStatuses.ZERO)) {
          state.programCounter += offset;
        }
      },
    ];
  }
};
