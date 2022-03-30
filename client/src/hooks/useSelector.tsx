import { useContextSelector } from "use-context-selector";

import { AppContext, AppContextType } from "../core/context";

export function useSelector<Selected>(selector: (state: AppContextType["state"]) => Selected): Selected {
  const value = useContextSelector(AppContext, (context) => selector(context.state));
  return value;
}
