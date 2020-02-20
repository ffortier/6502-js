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
  ROR: {
    accumulator: 0x6a,
  } as const,
  ROL: {
    accumulator: 0x2a,
  } as const,
  DEX: {
    implicit: 0xc4,
  } as const,
  INX: {
    implicit: 0xe8,
  } as const,
} as const;
