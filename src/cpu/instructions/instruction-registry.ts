import { Cpu65c02, Instruction } from "../cpu65c02";
import { microInstructions } from "./micro-instructions";

export interface AccumulatorAddressable {
  accumulator: number;
}

export interface AbsoluteAddressable {
  absolute: number;
}

export interface ImmediateAddressable {
  immediate: number;
}

export interface ImplicitAddressable {
  implicit: number;
}

export type Addressable = AccumulatorAddressable | AbsoluteAddressable | ImmediateAddressable | ImplicitAddressable;

export const addressingModes = ['absolute', 'immediate', 'implicit', 'accumulator'] as const;

export interface MicroInstruction<T = unknown> {
  (cpu: Cpu65c02, address: T): void;
}

export type AddressingTypes = {
  accumulator: 'a',
  absolute: number,
  immediate: number,
  implicit: undefined,
};

export type AddressingType<T> = { [P in keyof T]: P extends keyof AddressingTypes ? AddressingTypes[P] : never }[keyof T];

export type AddressableMicroInstruction<T extends Addressable> = MicroInstruction<AddressingType<T>>

export class InstructionRegistry {
  private instructions = new Map<number, Instruction>();

  register<T extends Addressable>(opCode: T, microInstruction: AddressableMicroInstruction<T>): void {
    addressingModes
      .filter(addressingMode => addressingMode in opCode)
      .forEach(addressingMode => this.processors[addressingMode]((opCode as any)[addressingMode], microInstruction as any))
  }

  toMap(): ReadonlyMap<number, Instruction> {
    return this.instructions;
  }

  private processors = {
    accumulator: (opCode: number, microInstruction: MicroInstruction<'a'>) => {
      this.instructions.set(opCode, cpu => microInstructions(
        () => microInstruction(cpu, 'a'),
      ));
    },
    absolute: (opCode: number, microInstruction: MicroInstruction<number>) => {
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
    immediate: (opCode: number, microInstruction: MicroInstruction<number>) => {
      this.instructions.set(opCode, cpu => microInstructions(
        () => microInstruction(cpu, cpu.pc),
      ));
    },
    implicit: (opCode: number, microInstruction: MicroInstruction<undefined>) => {
      this.instructions.set(opCode, cpu => microInstructions(
        () => microInstruction(cpu, undefined),
      ));
    },
  }
}
