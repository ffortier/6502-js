import { InstructionRegistry, Addressable, MicroInstruction } from "./instruction-registry";
import { Memory, Cpu65c02 } from "../cpu65c02";
import { sta } from "./sta";
import { OpCode } from "../opcode";

describe('cpu/instructions/sta', () => {
  const address = 0x42;
  const value = 42;

  let instructionRegistry: jasmine.SpyObj<InstructionRegistry>;
  let memory: jasmine.SpyObj<Memory>;
  let cpu: Cpu65c02;

  beforeEach(() => {
    instructionRegistry = jasmine.createSpyObj('instructionRegistry', ['register']);
    memory = jasmine.createSpyObj('memory', ['readByte', 'writeByte']);
    cpu = new Cpu65c02(memory, new Map());

    cpu.a = value;

    sta(instructionRegistry);
  });

  describe('when calling the instruction', () => {
    let opCode: Addressable;
    let microInstruction: MicroInstruction;

    beforeEach(() => {
      [opCode, microInstruction] = instructionRegistry.register.calls.mostRecent().args;

      microInstruction(cpu, address);
    });

    it('should use the STA opCode', () => {
      expect(opCode).toBe(OpCode.STA);
    });

    it('should store the a register at the address provided', () => {
      expect(memory.writeByte).toHaveBeenCalledWith(address, value);
    });
  });
});
