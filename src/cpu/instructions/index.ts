import { InstructionRegistry } from "./instruction-registry";
import { jmp } from "./jmp";
import { lda } from './lda';
import { sta } from "./sta";
import { nop } from "./nop";

const instructionRegistry = new InstructionRegistry();

lda(instructionRegistry);
sta(instructionRegistry);
jmp(instructionRegistry);
nop(instructionRegistry);

export const instructions = instructionRegistry.toMap();
