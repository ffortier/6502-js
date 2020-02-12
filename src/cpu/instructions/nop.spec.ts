import { InstructionRegistry, Addressable, MicroInstruction } from "./instruction-registry";
import { Memory, Cpu65c02 } from "../cpu65c02";
import { nop } from "./nop";
import { OpCode } from "../opcode";

describe('cpu/instructions/nop', () => {
  let instructionRegistry: jasmine.SpyObj<InstructionRegistry>;
  let memory: jasmine.SpyObj<Memory>;
  let cpu: Cpu65c02;

  beforeEach(() => {
    instructionRegistry = jasmine.createSpyObj('instructionRegistry', ['register']);
    memory = jasmine.createSpyObj('memory', ['readByte', 'writeByte']);
    cpu = new Cpu65c02(memory, new Map());

    nop(instructionRegistry);
  });

  describe('when calling the instruction', () => {
    let opCode: Addressable;
    let microInstruction: MicroInstruction;

    beforeEach(() => {
      [opCode, microInstruction] = instructionRegistry.register.calls.mostRecent().args;

      microInstruction(cpu, 0);
    });

    it('should use the NOP opCode', () => {
      expect(opCode).toBe(OpCode.NOP);
    });
  });
});
