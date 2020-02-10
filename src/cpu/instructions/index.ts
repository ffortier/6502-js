import { Instruction } from "../cpu65c02";
import { lda } from './lda';
import { sta } from "./sta";
import { jmp } from "./jmp";

const instructionRegistry = new Map<number, Instruction>();

lda(instructionRegistry);
sta(instructionRegistry);
jmp(instructionRegistry);

export { instructionRegistry };
