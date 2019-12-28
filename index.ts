import { OpCode } from "./src/opcode";
import { Memory } from "./src/memory";
import { W65C02S } from "./src/w65c02s/w65c02s";
import { Clock } from "./src/clock";

const rom = new Uint8Array(32 * 1024 * 8);

rom.fill(OpCode.NOP.IMPLIED);

rom[0x0000] = OpCode.LDA.IMMEDIATE;
rom[0x0001] = 0x55;
rom[0x0002] = OpCode.STA.ABSOLUTE;
rom[0x0003] = 0x00;
rom[0x0004] = 0x60;
rom[0x0005] = OpCode.ROL.ACCUMULATOR_A;
rom[0x0006] = OpCode.STA.ABSOLUTE;
rom[0x0007] = 0x00;
rom[0x0008] = 0x60;
rom[0x0009] = OpCode.JMP.ABSOLUTE;
rom[0x000a] = 0x00;
rom[0x000b] = 0x80;

rom[0x7ffc] = 0x00;
rom[0x7ffd] = 0x80;

const consoleMem = Object.defineProperty({}, 0, {
  set: value => console.log(('00000000' + (value as number).toString(2)).substr(-8)),
});

const memory = new Memory([
  { offset: 0x8000, memoryBank: rom },
  { offset: 0x6000, memoryBank: consoleMem },
]);

const w65c02s = new W65C02S(memory);
const clock = new Clock(10);

clock.on('tick', () => w65c02s.run());
clock.start();
