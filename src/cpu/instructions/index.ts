import { InstructionRegistry } from "./instruction-registry";
import { jmp } from "./jmp";
import { lda } from './lda';
import { sta } from "./sta";
import { nop } from "./nop";
import { ror } from "./ror";
import { rol } from "./rol";
import { dex } from "./dex";
import { inx } from "./inx";
import { bne } from "./bne";
import { beq } from "./beq";

const instructionRegistry = new InstructionRegistry();

lda(instructionRegistry);
sta(instructionRegistry);
jmp(instructionRegistry);
nop(instructionRegistry);
ror(instructionRegistry);
rol(instructionRegistry);
dex(instructionRegistry);
inx(instructionRegistry);
bne(instructionRegistry);
beq(instructionRegistry);

export const instructions = instructionRegistry.toMap();
