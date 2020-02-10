import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import * as util from 'util';
import * as vasmParser from './parser/vasm';
import { Compiler } from './compiler';
import { OpCode } from './cpu';
import { SourceMapConsumer, RawSourceMap } from 'source-map';

describe('with a program 6502 program', () => {
  let program: string;

  beforeEach(() => {
    program = fs.readFileSync(path.resolve(__dirname, '..', 'program', 'hello.s'), 'utf8');
  });

  describe('when compiling with vasm and this compiler', () => {
    let view1: Uint8Array;
    let view2: Uint8Array;
    let sourceMap: RawSourceMap;

    beforeEach(async () => {
      await util.promisify(cp.execFile)(
        path.resolve(__dirname, '..', 'vasm', 'vasm6502_oldstyle'),
        ['-Fbin', '-dotdir', 'program/hello.s'],
        { cwd: path.resolve(__dirname, '..') });

      const compiler = new Compiler(vasmParser, program, OpCode);
      const buffer = new ArrayBuffer(32 * 1024);

      sourceMap = compiler.compile(buffer);

      view1 = new Uint8Array(buffer);
      view2 = new Uint8Array(fs.readFileSync(path.resolve(__dirname, '..', 'a.out')));
    });

    it('should', async () => {
      const consumer = await new SourceMapConsumer(sourceMap);

      expect(view1.length).toEqual(view2.length);

      let equal = true;

      for (let i = 0, len = view1.length; i < len; i++) {
        if (view1[i] !== view2[i]) {
          const original = consumer.originalPositionFor({ line: 1, column: i });
          const sourceIndex = consumer.sources.indexOf(original.source!);
          const line = consumer.sourcesContent[sourceIndex].split(/\n/)[original.line! - 1];

          console.error(line,
            Array.prototype.map.call(view1.slice(i - 2, i + 2), value => ('00' + value.toString(16)).slice(-2)).join(' '),
            Array.prototype.map.call(view2.slice(i - 2, i + 2), value => ('00' + value.toString(16)).slice(-2)).join(' '),
          );

          equal = false;
        }
      }

      expect(equal).toBe(true);
    });
  });
});
