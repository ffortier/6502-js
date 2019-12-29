import { Instruction } from "../instructions";
import { Memory } from "../memory";
import { State } from "./state";
import { fetchNextInstruction } from "./fetch-next-instruction";

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
