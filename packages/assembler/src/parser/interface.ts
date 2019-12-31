export type Token = Directive | Label | Instruction;

export interface Directive {
  type: 'directive';
  directive: string;
  value?: Value;
  location: Location;
}

export interface Label {
  type: 'label';
  label: string;
  location: Location;
}

export interface Instruction {
  type: 'instruction';
  opcode: string;
  value?: Value;
  location: Location;
}

export type Value = AbsoluteValue | ImmediateValue | LabelValue;

export interface AbsoluteValue {
  type: 'absolute';
  number: number;
}

export interface ImmediateValue {
  type: 'immediate';
  number: number;
}

export interface LabelValue {
  type: 'label';
  label: string;
}

export interface Location {
  start: LocationPosition;
  end: LocationPosition;
}

export interface LocationPosition {
  offset: number;
  line: number;
  column: number;
}

export interface Vasm6502Parser {
  parse(input: string): Token[];
}
