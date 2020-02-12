import { InstructionRegistry, Addressable, MicroInstruction } from "./instruction-registry";
import { Memory, Cpu65c02 } from "../cpu65c02";
import { jmp } from "./jmp";
import { OpCode } from "../opcode";

describe('cpu/instructions/jmp', () => {
  const address = 0x42;

  let instructionRegistry: jasmine.SpyObj<InstructionRegistry>;
  let memory: jasmine.SpyObj<Memory>;
  let cpu: Cpu65c02;

  beforeEach(() => {
    instructionRegistry = jasmine.createSpyObj('instructionRegistry', ['register']);
    memory = jasmine.createSpyObj('memory', ['readByte', 'writeByte']);
    cpu = new Cpu65c02(memory, new Map());

    jmp(instructionRegistry);
  });

  describe('when calling the instruction', () => {
    let opCode: Addressable;
    let microInstruction: MicroInstruction;

    beforeEach(() => {
      [opCode, microInstruction] = instructionRegistry.register.calls.mostRecent().args;

      microInstruction(cpu, address);
    });

    it('should use the JMP opCode', () => {
      expect(opCode).toBe(OpCode.JMP);
    });

    it('should jump to the address provided', () => {
      expect(cpu.pc).toBe(address);
    });
  });
});
