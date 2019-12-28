import { W65C02S } from "./w65c02s";
import { Memory } from "./memory";
import { OpCode } from "./opcode";

describe('interation tests', () => {
  let ram: Uint8Array;
  let rom: Uint8Array;
  let cpu: W65C02S;
  let memory: Memory;

  beforeEach(() => {
    memory = new Memory([
      { offset: 0x6000, memoryBank: ram },
      { offset: 0x8000, memoryBank: rom },
    ]);

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

      it('should oscillate between 01010101 and 10101010', () => {
        expect(ramValues).toEqual([0x55, 0xaa, 0x55, 0xaa]);
      });
    });
  });
});
