import { OpCode } from "../opcode";
import { State } from "./state";
import { Memory } from "../memory";
import { Instruction, lda, sta, ror, rol, bne, clc, dex, pha, pla, rts, tax, tay, txa, tya, jmp, jsr } from "../instructions";

export const fetchNextInstruction = (state: State, memory: Memory): readonly Instruction[] => {
  switch (memory.readByte(state.programCounter++)) {
    case OpCode.LDA.ABSOLUTE: return [lda.absolute];
    case OpCode.LDA.IMMEDIATE: return [lda.immediate];
    case OpCode.STA.ABSOLUTE: return [sta.absolute];
    case OpCode.ROR.ACCUMULATOR_A: return [ror.accumulatorA];
    case OpCode.ROL.ACCUMULATOR_A: return [rol.accumulatorA];
    case OpCode.JMP.ABSOLUTE: return [jmp.absolute];
    case OpCode.BNE.RELATIVE: return [bne.relative];
    case OpCode.CLC.IMPLIED: return [clc.implied];
    case OpCode.DEX.IMPLIED: return [dex.implied];
    case OpCode.JSR.ABSOLUTE: return [jsr.absolute];
    case OpCode.PHA.IMPLIED: return [pha.implied];
    case OpCode.PLA.IMPLIED: return [pla.implied];
    case OpCode.RTS.IMPLIED: return [rts.implied];
    case OpCode.TAX.IMPLIED: return [tax.implied];
    case OpCode.TAY.IMPLIED: return [tay.implied];
    case OpCode.TXA.IMPLIED: return [txa.implied];
    case OpCode.TYA.IMPLIED: return [tya.implied];
    default: return [];
  }
};
