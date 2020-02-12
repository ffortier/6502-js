import { OpCode } from "../opcode";
import { InstructionRegistry } from "./instruction-registry";

export function nop(instructionRegistry: InstructionRegistry) {
  instructionRegistry.register(OpCode.NOP, () => { });
}
