import { SourceMapGenerator } from 'source-map';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { PegjsVasm6502Parser } from './parser/parser';
import { Compiler } from './compiler';

const file = resolve(__dirname, '..', 'program', 'fibonacci.asm');
const code = readFileSync(file, 'utf8');
const parser = new PegjsVasm6502Parser();

const sourceMapGenerator = new SourceMapGenerator({
  file: file + '.map'
});

const compiler = new Compiler(sourceMapGenerator);

parser.parse(code).forEach(token => compiler.process(token, file));

const buffer = compiler.toBuffer();

console.log(sourceMapGenerator.toString(), buffer);
