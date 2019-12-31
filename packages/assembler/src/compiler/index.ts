import { SourceMapGenerator } from 'source-map';
import { Token, Directive, Instruction, Label } from '../parser';
import { assertAbsoluteValue, assertDefined } from './assertions';
import { AutoAllocBuffer } from './auto-alloc-buffer';
import { OpCodeResolver } from './opcode-resolver';

export class Compiler {
  private offset = 0;
  private originOffset = 0
  private labelRefs: { [name: string]: { offset?: number, absoluteReferences: number[] } } = {};

  constructor(
    private sourceMapGenerator: SourceMapGenerator,
    private opCodeResolver: OpCodeResolver = new OpCodeResolver(),
    private buffer: Pick<Buffer, 'writeUInt8' | 'writeUInt16LE' | 'slice'> = new AutoAllocBuffer(),
  ) { }

  process(token: Token, source: string): void {
    switch (token.type) {
      case 'directive': this._processDirective(token); break;
      case 'instruction': this._writeInstruction(token, source); break;
      case 'label': this._defineLabel(token); break;
    }
  }

  toBuffer(): Buffer {
    this._resolveLabels();

    return this.buffer.slice(0, this.offset);
  }

  private _defineLabel(label: Label) {
    const labelRef = this._getLabelRef(label.label);

    labelRef.offset = this.offset;
  }

  private _getLabelRef(name: string): { offset?: number, absoluteReferences: number[] } {
    return this.labelRefs[name] = this.labelRefs[name] || { absoluteReferences: [] };
  }

  private _writeInstruction(instruction: Instruction, source: string) {
    this.sourceMapGenerator.addMapping({
      source,
      original: { line: instruction.location.start.line, column: instruction.location.start.column },
      generated: { line: 1, column: this.offset }
    });

    this.offset = this.buffer.writeUInt8(this.opCodeResolver.resolve(instruction), this.offset);

    if (instruction.value) {
      switch (instruction.value.type) {
        case 'immediate':
          this.offset = this.buffer.writeUInt8(instruction.value.number, this.offset);
          break;
        case 'absolute':
          this.offset = this.buffer.writeUInt16LE(instruction.value.number, this.offset);
          break;
        case 'label':
          this._getLabelRef(instruction.value.label).absoluteReferences.push(this.offset);
          this.offset = this.buffer.writeUInt16LE(0, this.offset);
          break;
      }
    }
  }

  private _resolveLabels() {
    for (const labelRef of Object.values(this.labelRefs)) {
      assertDefined(labelRef.offset);

      for (const absoluteReference of labelRef.absoluteReferences) {
        this.buffer.writeUInt16LE(labelRef.offset + this.originOffset, absoluteReference);
      }
    }
  }

  private _processDirective(directive: Directive) {
    switch (directive.directive.toUpperCase()) {
      case 'ORG':
        assertAbsoluteValue(directive.value);
        if (this.offset === 0) {
          this.originOffset = directive.value.number;
        } else {
          this.offset = directive.value.number - this.originOffset;
        }
        break;
      case 'WORD':
        assertAbsoluteValue(directive.value);
        this.offset = this.buffer.writeUInt16LE(directive.value.number, this.offset);
        break;
      default:
        throw new Error(`Unknown directive: ${directive.directive}`);
    }
  }

}
