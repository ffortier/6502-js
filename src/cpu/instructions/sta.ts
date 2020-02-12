import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export const sta = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.STA, (cpu, address) => cpu.memory.writeByte(address, cpu.a));
};
