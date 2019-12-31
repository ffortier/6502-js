import { Instruction } from "../parser";

export class OpCodeResolver {
  resolve(instruction: Instruction): number {
    return 0xea;
  }
}
