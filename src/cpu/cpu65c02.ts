export interface Memory {
  readByte(address: number): number;
  writeByte(address: number, value: number): void;
}

export interface Instruction {
  (cpu: Cpu65c02): Instruction[];
}

export enum ProcessorStatuses {
  CARRY = 0b00000001,
  ZERO = 0b00000010,
  IRQB = 0b00000100,
  DECIMAL = 0b00001000,
  BRK = 0b00010000,
  RESERVED = 0b00100000,
  OVERFLOW = 0b01000000,
  NEGATIVE = 0b10000000,
}

export class Cpu65c02 {
  s = 0x1ff;
  a = 0;
  x = 0
  y = 0;
  pc = 0;
  p = ProcessorStatuses.RESERVED;

  private _instructions: Instruction[] = [];

  constructor(
    public readonly memory: Memory,
    public readonly instructions: ReadonlyMap<number, Instruction>,
  ) { }

  run(): void {
    const instruction = (this._instructions.shift() ?? this._fetchInstruction());

    this._instructions.push(...instruction(this));
  }

  private _fetchInstruction = () => {
    const opcode = this.memory.readByte(this.pc++);
    const instruction = this.instructions.get(opcode);

    if (!instruction) {
      throw new Error(`Unknown instruction 0x${('00' + opcode.toString(16)).substr(2)}`);
    }

    return instruction;
  };
}
