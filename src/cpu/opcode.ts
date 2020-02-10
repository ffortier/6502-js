export const OpCode: { readonly [name: string]: { readonly [addressingMode: string]: number } } = {
  LDA: {
    absolute: 0xad,
    immediate: 0xa9,
  },
  STA: {
    absolute: 0x8d,
  },
  JMP: {
    absolute: 0x4c,
  },
}
