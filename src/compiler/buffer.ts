export class Buffer {
  bytes: Uint8Array;
  position = 0;

  constructor(arrayBuffer: ArrayBuffer) {
    this.bytes = new Uint8Array(arrayBuffer);
  }

  writeWordLE(word: number): this {
    return this.writeByte(word).writeByte(word >> 8);
  }

  writeByte(byte: number): this {
    this.bytes[this.position++] = byte & 0xFF;

    return this;
  }
}
