import { State } from "./state";
import { Memory } from "../memory";
import { Instruction, lda, sta, ror, rol } from "../instructions";
import { OpCode } from "../opcode";
import { jmp } from "../instructions/jmp";

const fetchNextInstruction = (state: State, memory: Memory): readonly Instruction[] => {
  switch (memory.readByte(state.programCounter++)) {
    case OpCode.LDA.ABSOLUTE: return [lda.absolute];
    case OpCode.LDA.IMMEDIATE: return [lda.immediate];
    case OpCode.STA.ABSOLUTE: return [sta.absolute];
    case OpCode.ROR.ACCUMULATOR_A: return [ror.accumulatorA];
    case OpCode.ROL.ACCUMULATOR_A: return [rol.accumulatorA];
    case OpCode.JMP.ABSOLUTE: return [jmp.absolute];
    default: return [];
  }
};

export class W65C02S {
  private _state = new State();
  private _instructions: Instruction<void | Instruction[]>[] = [];

  constructor(
    private _memory: Memory,
    private _fetchNextInstruction = fetchNextInstruction,
  ) {
    this.reset();
  }

  reset(): void {
    this._instructions.length = 0;

    let low: number;

    this._instructions.push(
      (state, memory) => { low = memory.readByte(0xfffc); },
      (state, memory) => { state.programCounter = low + (memory.readByte(0xfffd) << 8); },
    );
  }

  run(): void {
    const instruction = this._instructions.shift() || this._fetchNextInstruction;
    const result = instruction(this._state, this._memory);

    if (Array.isArray(result)) {
      this._instructions.push(...result);
    }
  }

}
