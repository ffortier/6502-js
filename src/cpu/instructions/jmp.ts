import { Instruction, Cpu65c02 } from "../cpu65c02";
import { OpCode } from "../opcode";
import { microInstructions } from "./microInstructions";

export const jmp = (instructionRegistry: Map<number, Instruction>) => {
  instructionRegistry.set(OpCode.JMP.absolute, cpu => {
    let low: number;
    let hi: number;

    return microInstructions(
      () => low = cpu.memory.readByte(cpu.pc++),
      () => hi = cpu.memory.readByte(cpu.pc++),
      () => cpu.pc = (hi << 8) + low,
    );
  });
};
