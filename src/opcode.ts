export const OpCode = Object.freeze({
  NOP: { IMPLIED: 0xea } as const,
  LDA: { ABSOLUTE: 0xad, IMMEDIATE: 0xa9 } as const,
  JMP: { ABSOLUTE: 0x4c } as const,
  STA: { ABSOLUTE: 0x8d } as const,
} as const);
