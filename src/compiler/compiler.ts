import { RawSourceMap, SourceMapGenerator } from 'source-map';
import { Parser, DotDirective, Declaration, Operation, Label, Value, isNumericValue, AddressingMode } from './parser';
import { Buffer } from './buffer';

export interface CompilerOutput {
  sourceMap: RawSourceMap;
  bytes: Uint8Array;
}

export class Compiler {
  private sourceMapGenerator = new SourceMapGenerator();
  private origin = 0;
  private operationProcessed = false;
  private labelRefs: { [name: string]: number[] } = {};
  private labels: { [name: string]: number } = {};
  private symbols: { [name: string]: number } = {};

  constructor(
    private readonly parser: Parser,
    private readonly input: string,
    private readonly opCodes: { readonly [code: string]: { readonly [addressingMode: string]: number } },
  ) { }

  compile(buffer: ArrayBuffer): RawSourceMap {
    const parseOutput = this.parser.parse(this.input);
    const managedBuffer = new Buffer(buffer);

    this.sourceMapGenerator.setSourceContent('hello.s', this.input);

    for (const expr of parseOutput) {
      this._processors[expr.type](expr as any, managedBuffer);
    }

    Object.entries(this.labels).forEach(([name, position]) => {
      this.labelRefs[name]?.forEach(ref => {
        managedBuffer.position = ref;
        managedBuffer.writeWordLE(position + this.origin);
      });
    });

    this._reset();

    return this.sourceMapGenerator.toJSON();
  }

  private _reset(): void {
    this.sourceMapGenerator = new SourceMapGenerator();
    this.origin = 0;
    this.operationProcessed = false;
    this.labelRefs = {};
    this.labels = {};
    this.symbols = {};
  }

  private _resolveValue(value: Value, position: number, disallowLabels = false): number {
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
        this.labelRefs[value.text].push(position);
      } else {
        this.labelRefs[value.text] = [position];
      }
      return 0xFFFF;
    }

    if (value.type === 'ascii') {
      return value.digit.charCodeAt(0);
    }

    const expr = value.text
      .replace(/\b[a-zA-Z][a-zA-Z0-9_]*\b/g, symb => this.symbols[symb]?.toString() ?? symb);

    return eval(expr);
  }

  private _processors = {
    dotdir: (expr: DotDirective, buffer: Buffer) => {
      const value = this._resolveValue(expr.value, buffer.position, true);

      switch (expr.directive) {
        case '.org':
          this.operationProcessed ? buffer.position = value - this.origin : this.origin = value;
          break;
        case '.word':
          buffer.writeWordLE(value);
          break;
      }
    },
    declaration: (expr: Declaration, buffer: Buffer) => {
      this.symbols[expr.declaration] = this._resolveValue(expr.value, buffer.position, true);
    },
    operation: (expr: Operation, buffer: Buffer) => {
      const position = buffer.position;
      const opCodeValue = this.opCodes[expr.code][expr.addressingMode];

      this.operationProcessed = true;

      buffer.writeByte(opCodeValue);

      if (expr.value) {
        const value = this._resolveValue(expr.value, buffer.position);

        switch (expr.addressingMode) {
          case AddressingMode.IMMEDIATE:
            buffer.writeByte(value);
            break;
          default:
            buffer.writeWordLE(value);
            break;
        }
      }

      this.sourceMapGenerator.addMapping({
        source: 'hello.s',
        original: {
          line: expr.location.start.line,
          column: expr.location.start.column,
        },
        generated: {
          line: 1,
          column: position,
        }
      });
    },
    label: (expr: Label, buffer: Buffer) => {
      this.labels[expr.name] = buffer.position;
    },
  };
}
