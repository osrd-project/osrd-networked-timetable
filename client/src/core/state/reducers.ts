import { ReducerWithoutAction } from "react";

import { AppState } from "./types";

interface Loading {
  type: "LOADING";
  value: boolean;
}
interface SetState {
  type: "SET_STATE";
  value: AppState | ReducerWithoutAction<AppState>;
}

export type MessageType = Loading | SetState;

/**
 * State reducer.
 * Given a state and an action, produce a new state.
 */
export const reducer = (state: AppState, action: MessageType): AppState => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.value === true ? state.loading + 1 : Math.max(0, state.loading - 1),
      };
    case "SET_STATE":
      if (typeof action.value === "function") return action.value(state);
      else return action.value;
    default:
      return state;
  }
};
