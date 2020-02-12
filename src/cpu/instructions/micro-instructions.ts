import { Instruction } from "../cpu65c02";

export const microInstructions = (...microInstructions: (() => void)[]): Instruction[] => microInstructions.map(microInstruction => () => {
  microInstruction();

  return [];
});
