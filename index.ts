import { EventTarget } from 'event-target-shim';

enum ProcessorStatuses {
  NEGATIVE = 0b1000_0000,
  OVERFLOW = 0b0100_0000,
  BRK = 0b0001_0000,
  DECIMAL = 0b0000_1000,
  IRQB_DISABLED = 0b0000_0100,
  ZERO = 0b0000_0010,
  CARRY = 0b0000_0001,
}

const inputElement = document.createElement('input');

document.getElementById('app').appendChild(inputElement);

enum OpCode {
  NOP = 0xea,
  LDA_IMMEDIATE = 0xa9,
  STA = 0x8d,
  ROR = 0x6a,
  JMP = 0x4c,
}

interface MemoryBank {
  [address: number]: number;
}

const rom = new Uint8Array(32 * 1024 * 8);

rom.fill(OpCode.NOP);

rom[0x0000] = OpCode.LDA_IMMEDIATE;
rom[0x0001] = 0x55;
rom[0x0002] = OpCode.STA;
rom[0x0003] = 0x00;
rom[0x0004] = 0x60;
rom[0x0005] = OpCode.ROR;
rom[0x0006] = OpCode.STA;
rom[0x0007] = 0x00;
rom[0x0008] = 0x60;
rom[0x0009] = OpCode.JMP;
rom[0x000a] = 0x00;
rom[0x000b] = 0x80;

rom[0x7ffc] = 0x00;
rom[0x7ffd] = 0x80;

const inputMem: MemoryBank = {};

Object.defineProperty(inputMem, '0', {
  get: () => parseInt(inputElement.value, 2),
  set: (value) => inputElement.value = ('00000000' + value.toString(2)).substr(-8), 
});

const memory = [0x8000, rom as MemoryBank, 0x6000, inputMem];

const getNumberLE = (low: number, hi: number) => (hi << 8) | low;

const log = (rw: 'r' | 'W', address: number, value: number) => console.log(
  rw,
  ('0000' + address.toString(16)).substr(-4), 
  ('00' + value.toString(16)).substr(-2),
);

const getMemoryBank = (address: number) => {
  for (let i = 0; i < memory.length; i += 2) {
    const offset = memory[i] as number;
    const bank = memory[i + 1] as MemoryBank;

    if (offset <= address) {
      return { offset, bank };
    }
  }

  return null;
};

const readByte = (address: number): number => {
  const mem = getMemoryBank(address);
  const value = mem ? mem.bank[address - mem.offset] : OpCode.NOP;

  log('r', address, value);

  return value;
};

const writeByte = (address: number, value: number): void => {
  const mem = getMemoryBank(address);

  if (mem) {
    mem.bank[address - mem.offset] = value;
  }
  
  log('W', address, value);
};

type Instruction = () => void;

class Clock extends EventTarget {
  private _intervalId = 0;

  constructor(
    private time: number,
  ) {
    super();
  }

  start(): void {
    this._intervalId = setInterval(() => {
      this.dispatchEvent(new CustomEvent('tick'));
    }, this.time);
  }

  stop(): void {
    clearInterval(this._intervalId);
  }
}

class CPU6502 {
  private _instructions: Instruction[] = [];
  
  private _a = 0; // 8-bit Accumulator Register
  private _pc = 0; // 16-bit program counter
  private _s = 0; // 8-bit stack pointer register
  private _x = 0; // 8-bit index register
  private _y = 0; // 8-bit index register
  private _p = 0; // 8-bit processor register

  constructor() {
    this.reset();
  }

  reset(): void {
    this._instructions.length = 0;

    let low: number;

    this._instructions.push(
      () => low = readByte(0xfffc),
      () => this._pc = getNumberLE(low, readByte(0xfffd)),
    );
  }

  loop = () => {
    (this._instructions.shift() || this.fetchInstruction)();
  }

  private nop = () => {

  };

  private ldaImmediate = () => {
    this._a = readByte(this._pc++);
  }

  private ror = () => {
    this._a = (this._a << 1) & 0xff;
  }

  private jmp = () => {
    let low: number;

    this._instructions.push(
      () => low = readByte(this._pc++),
      () => this._pc = getNumberLE(low, readByte(this._pc)),
    );
  }

  private sta = () => {
    let low, hi: number;

    this._instructions.push(
      () => low = readByte(this._pc++),
      () => hi = readByte(this._pc++),
      () => writeByte(getNumberLE(low, hi), this._a),
    );
  }

  private fetchInstruction = () => {
    let b = readByte(this._pc++);

    switch(b) {
      case OpCode.NOP:
        this._instructions.push(this.nop);
        break;
      case OpCode.LDA_IMMEDIATE:
        this._instructions.push(this.ldaImmediate);
        break;
      case OpCode.STA:
        this._instructions.push(this.sta);
        break;
      case OpCode.ROR:
        this._instructions.push(this.ror);
        break;
      case OpCode.JMP:
        this._instructions.push(this.jmp);
        break;
    }
  }
}

const cpu = new CPU6502();
const clock = new Clock(1);

clock.addEventListener('tick', () => cpu.loop());

clock.start();

document.getElementById('start').addEventListener('click', () => clock.start());
document.getElementById('stop').addEventListener('click', () => clock.stop());