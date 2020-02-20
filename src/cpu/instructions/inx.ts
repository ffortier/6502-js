import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";
import { ProcessorStatuses } from "../cpu65c02";

export const inx = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.INX, (cpu) => {
    cpu.x = (cpu.x + 1) & 0xff;
    cpu.p = cpu.x === 0 ? cpu.p | ProcessorStatuses.ZERO : cpu.p & (~ProcessorStatuses.ZERO);
  });
};
