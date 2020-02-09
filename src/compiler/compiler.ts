import { RawSourceMap, SourceMapGenerator } from 'source-map';
import { Parser, DotDirective, Declaration, Operation, Label, Value, isNumericValue } from './parser';
import { Buffer } from './buffer';
import { OpCode } from '../cpu';

export interface CompilerOutput {
  sourceMap: RawSourceMap;
  bytes: Uint8Array;
}

export class Compiler {
  private buffer = new Buffer(new ArrayBuffer(this.size));
  private sourceMapGenerator = new SourceMapGenerator();
  private origin = 0;
  private operationProcessed = false;
  private labelRefs: { [name: string]: number[] } = {};
  private labels: { [name: string]: number } = {};
  private symbols: { [name: string]: number } = {};

  constructor(
    private parser: Parser,
    private input: string,
    private size: number,
  ) { }

  compile(): CompilerOutput {
    const parseOutput = this.parser.parse(this.input);

    for (const expr of parseOutput) {
      this._processors[expr.type](expr as any);
    }

    Object.entries(this.labels).forEach(([name, position]) => {
      this.labelRefs[name]?.forEach(ref => {
        this.buffer.position = ref;
        this.buffer.writeWordLE(position);
      });
    });

    return { bytes: this.buffer.bytes, sourceMap: this.sourceMapGenerator.toJSON() };
  }

  private _resolveValue(value: Value, disallowLabels = false): number {
    if (isNumericValue(value)) {
      return value.value;
    }

    if (value.type === 'symbol') {
      if (value.text in this.symbols) {
        return this.symbols[value.text];
      }
      if (disallowLabels) {
        throw new Error('label values not allowed: ' + value.text);
      }
      if (value.text in this.labelRefs) {
        this.labelRefs[value.text].push(this.buffer.position);
      } else {
        this.labelRefs[value.text] = [this.buffer.position];
      }
      return 0xFFFF;
    }

    if (value.type === 'ascii') {
      return value.digit.charCodeAt(0);
    }

    return 0;
  }

  private _processors = {
    dotdir: (expr: DotDirective) => {
      const value = this._resolveValue(expr.value, false);

      switch (expr.directive) {
        case '.org': this.operationProcessed ? this.buffer.position = value : this.origin = value;
        case '.word': this.buffer.writeWordLE(value);
      }
    },
    declaration: (expr: Declaration) => {
      this.symbols[expr.name] = this._resolveValue(expr.value, false);
    },
    operation: (expr: Operation) => {
      const opCodeValue = OpCode[expr.code][expr.addressingMode];

      this.buffer.writeByte(opCodeValue);

      if (expr.value) {
        this.buffer.writeByte(this._resolveValue(expr.value));
      }
    },
    label: (expr: Label) => {
      this.labels[expr.name] = this.buffer.position;
    },
  };
}
