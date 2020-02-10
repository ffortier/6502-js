import { Instruction } from "../cpu65c02";
import { OpCode } from "../opcode";
import { microInstructions } from "./microInstructions";

export const sta = (instructionRegistry: Map<number, Instruction>) => {
  instructionRegistry.set(OpCode.STA.absolute, cpu => {
    let low: number;
    let hi: number;

    return microInstructions(
      () => low = cpu.memory.readByte(cpu.pc++),
      () => hi = cpu.memory.readByte(cpu.pc++),
      () => cpu.memory.writeByte((hi << 8) + low, cpu.a),
    );
  });
};
