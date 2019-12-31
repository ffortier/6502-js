import { readFileSync } from 'fs';
import { resolve } from 'path';
import { generate } from 'pegjs';
import { Vasm6502Parser, Token } from './interface';

export class PegjsVasm6502Parser implements Vasm6502Parser {
  constructor(
    grammar = readFileSync(resolve(__dirname, '..', '..', 'grammar', 'vasm-6502.pegjs'), 'utf8'),
    private _parser = generate(grammar),
  ) { }

  parse(input: string): Token[] {
    return this._parser.parse(input);
  }
}
