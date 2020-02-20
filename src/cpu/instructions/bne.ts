import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";
import { ProcessorStatuses } from "../cpu65c02";

export const bne = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.BNE, (cpu, address) => {
    if ((cpu.p & ProcessorStatuses.ZERO) === 0) {
      cpu.pc = address;
    }
  });
};
