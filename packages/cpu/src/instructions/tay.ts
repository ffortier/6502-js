import { State } from "../w65c02s";

export const tay = {
  implied: (state: State): void => {
    state.yRegister = state.aRegister;
  }
};
