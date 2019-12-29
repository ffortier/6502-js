import { W65C02S } from "./w65c02s";
import { Memory } from "./memory";
import { OpCode } from "./opcode";

describe('integration tests', () => {
  let stack: Uint8Array;
  let ram: Uint8Array;
  let rom: Uint8Array;
  let cpu: W65C02S;
  let memory: Memory;
  let noConsole: Pick<Console, 'error'>;

  beforeEach(() => {
    stack = new Uint8Array(0x100);
    ram = new Uint8Array(0x100);
    rom = new Uint8Array(0x8000);
    noConsole = jasmine.createSpyObj('noConsole', ['error']);

    memory = new Memory([
      { offset: 0x100, memoryBank: stack },
      { offset: 0x6000, memoryBank: ram },
      { offset: 0x8000, memoryBank: rom },
    ]/*, noConsole*/);

    cpu = new W65C02S(memory);

    rom[0x7ffc] = 0x00;
    rom[0x7ffd] = 0x80;
  });

  describe('flipping bits', () => {
    beforeEach(() => {
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
    });

    describe('when stepping the clock many times', () => {
      let ramValues: number[];

      beforeEach(() => {
        ramValues = [0];

        for (let i = 0; i < 100; i++) {
          cpu.run();

          if (ramValues[ramValues.length - 1] !== ram[0]) {
            ramValues.push(ram[0]);
          }
        }

        ramValues.shift();
      });

      it('should alternate between 01010101 and 10101010', () => {
        expect(ramValues.length).toBeGreaterThanOrEqual(2);

        ramValues.filter((value, index) => index % 2 === 0).forEach(value => {
          expect(value).toBe(0b0101_0101);
        });

        ramValues.filter((value, index) => index % 2 === 1).forEach(value => {
          expect(value).toBe(0b101_01010);
        });
      });
    });
  });

  describe('fibonacci', () => {
    beforeEach(() => {
      rom[0x00] = OpCode.LDA.IMMEDIATE;
      rom[0x01] = 5;
      rom[0x02] = OpCode.TAX.IMPLIED;
      rom[0x03] = OpCode.JSR.ABSOLUTE;
      rom[0x04] = 0xa0;
      rom[0x05] = 0x80;
      rom[0x06] = OpCode.TXA.IMPLIED;
      rom[0x07] = OpCode.STA.ABSOLUTE;
      rom[0x08] = 0x00;
      rom[0x09] = 0x60;
      rom[0xa0] = OpCode.TXA.IMPLIED;
      rom[0xa1] = OpCode.BNE.RELATIVE;
      rom[0xa2] = 0x01;
      rom[0xa3] = OpCode.RTS.IMPLIED;
      rom[0xa4] = OpCode.DEX.IMPLIED;
      rom[0xa5] = OpCode.BNE.RELATIVE;
      rom[0xa6] = 0x01;
      rom[0xa7] = OpCode.TXA.IMPLIED;
      rom[0xa8] = OpCode.PHA.IMPLIED;
      rom[0xa9] = OpCode.JSR.ABSOLUTE;
      rom[0xaa] = 0x00;
      rom[0xab] = 0x80;
      rom[0xac] = OpCode.TAY.IMPLIED;
      rom[0xad] = OpCode.PLA.IMPLIED;
      rom[0xae] = OpCode.TAX.IMPLIED;
      rom[0xaf] = OpCode.TYA.IMPLIED;
      rom[0xb0] = OpCode.PHA.IMPLIED;
      rom[0xb1] = OpCode.DEX.IMPLIED;
      rom[0xb2] = OpCode.JSR.ABSOLUTE;
      rom[0xb3] = 0x00;
      rom[0xb4] = 0x80;
      rom[0xb5] = OpCode.STA.ABSOLUTE;
      rom[0xb6] = 0xff;
      rom[0xb7] = 0x60;
      rom[0xb8] = OpCode.PLA.IMPLIED;
      rom[0xb9] = OpCode.CLC.IMPLIED;
      rom[0xba] = OpCode.ADC.ABSOLUTE;
      rom[0xbb] = 0x0f;
      rom[0xbc] = 0x60;
      rom[0xbd] = OpCode.RTS.IMPLIED;
    });

    describe('when stepping the clock', () => {
      beforeEach(() => {
        const start = Date.now();

        while (ram[0] === 0 && start + 5000 > Date.now()) {
          cpu.run();
        }
      });

      fit("should store the correct result", () => {
        expect(ram[0]).toBe(8);
      });
    });
  });
});
