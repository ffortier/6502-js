export interface Memory {
  readByte(address: number): number;
  writeByte(address: number, value: number): void;
}

export interface Instruction {
  (cpu: Cpu65c02): Instruction[];
}

export class Cpu65c02 {
  s = 0x1ff;
  a = 0;
  x = 0
  y = 0;
  pc = 0;

  private _instructions: Instruction[] = [];

  constructor(
    public readonly memory: Memory,
    public readonly instructionRegistry: ReadonlyMap<number, Instruction>,
  ) { }

  run(): void {
    const instruction = (this._instructions.shift() ?? this._fetchInstruction());

    this._instructions.push(...instruction(this));
  }

  private _fetchInstruction = () => {
    const opcode = this.memory.readByte(this.pc++);
    const instruction = this.instructionRegistry.get(opcode);

    if (!instruction) {
      throw new Error(`Unknown instruction 0x${('00' + opcode.toString(16)).substr(2)}`);
    }

    return instruction;
  };
}
