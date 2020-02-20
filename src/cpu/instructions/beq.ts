import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";
import { ProcessorStatuses } from "../cpu65c02";

export const beq = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.BEQ, (cpu, address) => {
    if (cpu.p & ProcessorStatuses.ZERO) {
      cpu.pc = address;
    }
  });
};
