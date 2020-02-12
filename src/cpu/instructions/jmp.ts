import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export const jmp = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.JMP, (cpu, address) => cpu.pc = address);
};
