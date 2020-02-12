import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export function lda(instructionRegistry: InstructionRegistry) {
  instructionRegistry.register(OpCode.LDA, (cpu, address) => cpu.a = cpu.memory.readByte(address));
}
