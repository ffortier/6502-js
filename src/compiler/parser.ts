export interface LocationValue {
  readonly offset: number;
  readonly line: number;
  readonly column: number;
}

export interface Location {
  readonly start: LocationValue;
  readonly end: LocationValue;
}

export type Value = HexValue | BinaryValue | DecimalValue | OctalValue | SymbolValue | AsciiValue | EvalValue;

export interface HexValue {
  readonly type: 'hex';
  readonly value: number;
  readonly text: string;
}

export interface BinaryValue {
  readonly type: 'binary'
  readonly value: number;
  readonly text: string;
}

export interface DecimalValue {
  readonly type: 'decimal'
  readonly value: number;
  readonly text: string;
}

export interface OctalValue {
  readonly type: 'octal'
  readonly value: number;
  readonly text: string;
}

export interface SymbolValue {
  readonly type: 'symbol'
  readonly text: string;
}

export interface AsciiValue {
  readonly type: 'ascii'
  readonly text: string;
  readonly digit: string;
}

export interface EvalValue {
  readonly type: 'eval'
  readonly text: string;
}

export interface DotDirective {
  readonly type: 'dotdir';
  readonly directive: string;
  readonly value: Value;
  readonly text: string;
  readonly location: Location
}

export interface Label {
  readonly type: 'label';
  readonly text: string;
  readonly name: string;
  readonly location: Location
}

export interface Declaration {
  readonly type: 'declaration';
  readonly name: string;
  readonly value: Value;
  readonly text: string;
  readonly location: Location
}

export interface Operation {
  readonly type: 'operation';
  readonly code: string;
  readonly value?: Value;
  readonly addressingMode: AddressingMode;
  readonly text: string;
  readonly location: Location
}

export enum AddressingMode {
  IMPLICIT = 'implicit',
  ABSOLUTE = 'absolute',
  IMMEDIATE = 'immediate',
}

export type ParserOutput = readonly (DotDirective | Declaration | Label | Operation)[];

export interface Parser {
  parse(input: string): ParserOutput;
}

export type NumericValue = HexValue | OctalValue | DecimalValue | BinaryValue;

export function isNumericValue(value: Value): value is NumericValue {
  return ['hex', 'octal', 'decimal', 'binary'].includes(value.type);
}
