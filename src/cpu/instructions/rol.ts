import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export const rol = (instructionRegistry: InstructionRegistry) => {
  instructionRegistry.register(OpCode.ROL, (cpu, address) => {
    const value = cpu[address];

    cpu[address] = ((value << 1) & 0xff) | (value >> 7);
  });
};
