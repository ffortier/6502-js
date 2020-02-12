import { InstructionRegistry, Addressable, MicroInstruction } from "./instruction-registry";
import { Memory, Cpu65c02, Instruction } from "../cpu65c02";

describe('cpu/instructions/instruction-registry', () => {
  const absolute = 0x42;
  const immediate = 0x43;
  const implicit = 0x44;
  const pc = 0x8000;

  let instructionRegistry: InstructionRegistry;
  let microInstruction: jasmine.Spy<MicroInstruction>;
  let memory: jasmine.SpyObj<Memory>;
  let cpu: Cpu65c02;
  let callback: jasmine.Spy<() => Instruction>;

  beforeEach(() => {
    memory = jasmine.createSpyObj('memory', ['readByte']);
    microInstruction = jasmine.createSpy('microInstruction');
    callback = jasmine.createSpy('callback').and.callFake(fn => fn(cpu));
    instructionRegistry = new InstructionRegistry();
    cpu = new Cpu65c02(memory, instructionRegistry.toMap());

    memory.readByte.withArgs(pc).and.returnValue(0x02);
    memory.readByte.withArgs(pc + 1).and.returnValue(0x60);

    cpu.pc = pc;
  });

  describe('with an instruction having all addressing modes', () => {
    beforeEach(() => {
      instructionRegistry.register({ absolute, immediate, implicit }, microInstruction);
    });

    describe('when invoking the instruction using absolute addressing', () => {
      beforeEach(() => {
        instructionRegistry.toMap().get(absolute)!(cpu).forEach(callback);
      });

      it('should read the second and third byte of the instruction to form a 16-bit address', () => {
        expect(microInstruction).toHaveBeenCalledWith(cpu, 0x6002);
      });

      it('should advance the program counter', () => {
        expect(cpu.pc).toEqual(pc + 2);
      });

      it('should resolve in 3 clock cycles', () => {
        expect(callback).toHaveBeenCalledTimes(3);
      });
    });

    describe('when invoking the instruction using immediate addressing', () => {
      beforeEach(() => {
        instructionRegistry.toMap().get(immediate)!(cpu).forEach(callback);
      });

      it('should use the second byte of the instruction as an address', () => {
        expect(microInstruction).toHaveBeenCalledWith(cpu, pc);
      });

      it('should not advance the program counter', () => {
        expect(cpu.pc).toEqual(pc);
      });

      it('should resolve in 1 clock cycle', () => {
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });

    describe('when invoking the instruction using implicit addressing', () => {
      beforeEach(() => {
        instructionRegistry.toMap().get(implicit)!(cpu).forEach(callback);
      });

      it('should call the micro instruction with a 0 address', () => {
        expect(microInstruction).toHaveBeenCalledWith(cpu, 0);
      });

      it('should not advance the program counter', () => {
        expect(cpu.pc).toEqual(pc);
      });

      it('should resolve in 1 clock cycle', () => {
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
