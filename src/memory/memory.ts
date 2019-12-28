import { MemoryBank } from "./memory-bank";
import { OpCode } from "../opcode";

export class Memory {
  private readonly _items: readonly { offset: number, memoryBank: MemoryBank }[];

  constructor(
    items: { offset: number, memoryBank: MemoryBank }[],
    private _console: Pick<Console, 'error'> = console,
  ) {
    this._items = items.slice().sort((item1, item2) => item2.offset - item1.offset);
  }

  readByte(address: number): number {
    const item = this._getItem(address);
    const value = item ? item.memoryBank[address - item.offset] : OpCode.NOP.IMPLIED;

    this._log('r', address, value);

    return value;
  }

  writeByte(address: number, value: number): void {
    const item = this._getItem(address);

    if (item) {
      item.memoryBank[address - item.offset] = value;
    }

    this._log('W', address, value);
  }

  private _log(rw: 'r' | 'W', address: number, value: number): void {
    this._console.error(
      rw,
      ('0000' + address.toString(16)).substr(-4),
      ('00' + value.toString(16)).substr(-2),
    );
  }

  private _getItem(address: number): { offset: number, memoryBank: MemoryBank } | null {
    for (const item of this._items) {
      if (item.offset <= address) {
        return item;
      }
    }

    return null;
  }
}
