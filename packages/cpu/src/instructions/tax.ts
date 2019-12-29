import { State } from "../w65c02s";

export const tax = {
  implied: (state: State): void => {
    state.xRegister = state.aRegister;
  }
};
