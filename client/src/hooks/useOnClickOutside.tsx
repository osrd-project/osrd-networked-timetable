import { useEffect, RefObject } from "react";

export function useOnClickOutside(ref: RefObject<HTMLElement>, exec?: () => void): void {
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (exec) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          exec();
        }
      }
    };
    document.body.addEventListener("click", fn, false);
    return () => {
      document.body.removeEventListener("click", fn, false);
    };
  }, [ref, exec]);
}
