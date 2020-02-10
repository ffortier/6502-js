import { Instruction } from "../cpu65c02";
import { OpCode } from "../opcode";
import { microInstructions } from "./microInstructions";

export function lda(instructionRegistry: Map<number, Instruction>) {
  instructionRegistry.set(OpCode.LDA.absolute, cpu => {
    let low: number;
    let hi: number;

    return microInstructions(
      () => low = cpu.memory.readByte(cpu.pc++),
      () => hi = cpu.memory.readByte(cpu.pc++),
      () => cpu.a = cpu.memory.readByte((hi << 8) + low),
    );
  });

  instructionRegistry.set(OpCode.LDA.immediate, cpu => {
    return microInstructions(
      () => cpu.a = cpu.memory.readByte(cpu.pc++),
    );
  });
}
