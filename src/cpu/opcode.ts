export const OpCode = {
  LDA: {
    absolute: 0xad,
    immediate: 0xa9,
  } as const,
  STA: {
    absolute: 0x8d,
  } as const,
  JMP: {
    absolute: 0x4c,
  } as const,
  NOP: {
    implicit: 0xea,
  } as const,
} as const;
