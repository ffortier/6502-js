export class AutoAllocBuffer implements Pick<Buffer, 'writeUInt8' | 'writeUInt16LE' | 'slice'> {
  private buffer: Buffer;

  constructor(chunkSize = 65536) {
    this.buffer = Buffer.alloc(chunkSize);
  }

  writeUInt8(value: number, offset: number): number {
    return this.buffer.writeUInt8(value, offset);
  }

  writeUInt16LE(value: number, offset: number): number {
    return this.buffer.writeUInt16LE(value, offset);
  }

  slice(begin?: number, end?: number): Buffer {
    return this.buffer.slice(begin, end);
  }
}
