import { InstructionRegistry, Addressable, MicroInstruction } from "./instruction-registry";
import { Memory, Cpu65c02 } from "../cpu65c02";
import { lda } from "./lda";
import { OpCode } from "../opcode";

describe('cpu/instructions/lda', () => {
  const address = 0x42;
  const value = 42;

  let instructionRegistry: jasmine.SpyObj<InstructionRegistry>;
  let memory: jasmine.SpyObj<Memory>;
  let cpu: Cpu65c02;

  beforeEach(() => {
    instructionRegistry = jasmine.createSpyObj('instructionRegistry', ['register']);
    memory = jasmine.createSpyObj('memory', ['readByte', 'writeByte']);
    cpu = new Cpu65c02(memory, new Map());

    memory.readByte.withArgs(address).and.returnValue(value);

    lda(instructionRegistry);
  });

  describe('when calling the instruction', () => {
    let opCode: Addressable;
    let microInstruction: MicroInstruction;

    beforeEach(() => {
      [opCode, microInstruction as any] = instructionRegistry.register.calls.mostRecent().args;

      microInstruction(cpu, address);
    });

    it('should use the LDA opCode', () => {
      expect(opCode).toBe(OpCode.LDA);
    });

    it('should set the a register with the value at the address provided', () => {
      expect(cpu.a).toBe(value);
    });
  });
});
