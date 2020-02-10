import { Compiler } from './compiler';
import * as vasmParser from './parser/vasm';
import * as fs from 'fs';
import * as path from 'path';
import { OpCode } from './cpu';

const input = fs.readFileSync(path.resolve(__dirname, '..', 'program', 'hello.s'), 'utf8');
const compiler = new Compiler(vasmParser, input, OpCode);
console.time('test')
const sourceMap = compiler.compile(new ArrayBuffer(32 * 1024));
console.timeEnd('test');
console.log(sourceMap);
