export const OpCode: { readonly [name: string]: { readonly [addressingMode: string]: number } } = {
  LDA: {
    absolute: 0xa9,
    immediate: 0xa9,
    implicit: 0xa9,
  },
  STA: {
    absolute: 0xa9,
    immediate: 0xa9,
    implicit: 0xa9,
  },
  JMP: {
    absolute: 0xa9,
    immediate: 0xa9,
    implicit: 0xa9,
  },
}
