import React, { FC, useReducer, ReducerWithoutAction, ReactNode, Dispatch } from "react";
import { createContext } from "use-context-selector";
import { noop } from "lodash";

import { AppState, MessageType, defaultState, reducer } from "./state";

export type AppContextType = {
  state: AppState;
  setState: (stateOrReducer: AppState | ReducerWithoutAction<AppState>) => void;
  dispatch: Dispatch<MessageType>;
};

export const AppContext = createContext<AppContextType>({
  state: defaultState,
  setState: noop,
  dispatch: noop,
});

/**
 * Application context provider.
 */
export const AppContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  function setState(value: AppState | ReducerWithoutAction<AppState>) {
    dispatch({ type: "SET_STATE", value });
  }
  return <AppContext.Provider value={{ state, dispatch, setState }}>{children}</AppContext.Provider>;
};
