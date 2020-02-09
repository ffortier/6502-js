import { Compiler } from './compiler';
import * as vasmParser from './parser/vasm';
import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.resolve(__dirname, '..', 'program', 'hello.s'), 'utf8');
const compiler = new Compiler(vasmParser, input, 32 * 1024);
console.time('test')
const { bytes, sourceMap } = compiler.compile();
console.timeEnd('test');
console.log(bytes);
