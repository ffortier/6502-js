import { ProcessorStatuses } from "../processor-statuses";

export class State {
  constructor(
    public programCounter: number = 0,
    public aRegister: number = 0,
    public xRegister: number = 0,
    public yRegister: number = 0,
    public stack: number = 0x1ff,
    public processorStatuses: ProcessorStatuses = 0,
  ) { }
}
