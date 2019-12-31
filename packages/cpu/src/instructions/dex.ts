import { State } from "../w65c02s";

export const dex = {
  implied: (state: State): void => {
    if (state.xRegister === 0) {
      throw new Error('Index is 0');
    }
    state.xRegister = state.xRegister === 0 ? 0xff : state.xRegister - 1;
  }
};
