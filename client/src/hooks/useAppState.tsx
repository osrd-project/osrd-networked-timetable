import { useContextSelector } from "use-context-selector";
import { AppContext, AppContextType } from "../core/context";

export function useAppState(): AppContextType {
  return useContextSelector(AppContext, (c) => c);
}
