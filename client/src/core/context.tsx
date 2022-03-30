import React, { FC, useReducer, ReducerWithoutAction, ReactNode } from "react";
import { createContext } from "use-context-selector";
import { noop } from "lodash";

import { AppState, initialState, reducer } from "./state";

export type AppContextType = {
  state: AppState;
  setState: (stateOrReducer: AppState | ReducerWithoutAction<AppState>) => void;
};

export const AppContext = createContext<AppContextType>({
  state: initialState,
  setState: noop,
});

/**
 * Application context provider.
 */
export const AppContextProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, setState: dispatch }}>{children}</AppContext.Provider>;
};
