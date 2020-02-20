import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export const ror = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.ROR, (cpu, address) => {
    const value = cpu[address];

    cpu[address] = (value >> 1) | ((value << 7) & 0xff);
  });
};
