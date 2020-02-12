import { Cpu65c02, Instruction } from "../cpu65c02";
import { microInstructions } from "./micro-instructions";

export interface Addressable {
  absolute?: number;
  immediate?: number;
  implicit?: number;
}

export const addressingModes = ['absolute', 'immediate', 'implicit'] as const;

export interface MicroInstruction {
  (cpu: Cpu65c02, address: number): void;
}

export class InstructionRegistry {
  private instructions = new Map<number, Instruction>();

  register(opCode: Addressable, microInstruction: MicroInstruction): void {
    addressingModes
      .filter(addressingMode => addressingMode in opCode)
      .forEach(addressingMode => this.processors[addressingMode](opCode[addressingMode]!, microInstruction))
  }

  toMap(): ReadonlyMap<number, Instruction> {
    return this.instructions;
  }

  private processors = {
    absolute: (opCode: number, microInstruction: MicroInstruction) => {
      this.instructions.set(opCode, cpu => {
        let low: number;
        let hi: number;

        return microInstructions(
          () => low = cpu.memory.readByte(cpu.pc++),
          () => hi = cpu.memory.readByte(cpu.pc++),
          () => microInstruction(cpu, (hi << 8) + low),
        );
      });
    },
    immediate: (opCode: number, microInstruction: MicroInstruction) => {
      this.instructions.set(opCode, cpu => microInstructions(
        () => microInstruction(cpu, cpu.pc),
      ));
    },
    implicit: (opCode: number, microInstruction: MicroInstruction) => {
      this.instructions.set(opCode, cpu => microInstructions(
        () => microInstruction(cpu, 0),
      ));
    },
  }
}
