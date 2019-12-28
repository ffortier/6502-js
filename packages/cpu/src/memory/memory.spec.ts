import { Memory } from "./memory";
import { MemoryBank } from "./memory-bank";

describe('memory/memory', () => {
  const offset = 0x42;

  let memory: Memory;
  let console: Pick<Console, 'error'>;
  let bank100: MemoryBank;
  let bank200: MemoryBank;
  let bank300: MemoryBank;

  beforeEach(() => {
    console = jasmine.createSpyObj('console', ['error']);

    bank100 = { [offset]: 0x10 };
    bank200 = { [offset]: 0x20 };
    bank300 = { [offset]: 0x30 };

    memory = new Memory([
      { offset: 0x100, memoryBank: bank100 },
      { offset: 0x300, memoryBank: bank300 },
      { offset: 0x200, memoryBank: bank200 },
    ], console);
  });

  [[0x100, () => bank100] as const, [0x200, () => bank200] as const, [0x300, () => bank300] as const].forEach(([bankOffset, supplier]) => {
    describe(`with a memory bank starting at address ${bankOffset.toString(16)}`, () => {
      let bank: MemoryBank;

      beforeEach(() => {
        bank = supplier();
      });

      describe(`when reading a byte`, () => {
        let returnedValue: number;

        beforeEach(() => {
          bank[offset] = 11;

          returnedValue = memory.readByte(bankOffset + offset);
        });

        it('should read the correct byte', () => {
          expect(returnedValue).toBe(11);
        });

        it('should log the read operation', () => {
          expect(console.error).toHaveBeenCalledWith('r', jasmine.stringMatching(/^[0-9a-f]{4}$/), '0b');
        });
      });

      describe(`when writing a byte`, () => {
        beforeEach(() => {
          memory.writeByte(bankOffset + offset, 12);
        });

        it('should write the correct byte', () => {
          expect(bank[offset]).toBe(12);
        });

        it('should log the write operation', () => {
          expect(console.error).toHaveBeenCalledWith('W', jasmine.stringMatching(/^[0-9a-f]{4}$/), '0c');
        });
      });
    });
  });
});
