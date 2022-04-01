import { useEffect, RefObject } from "react";

export function useOnClickOutside(ref: RefObject<HTMLElement>, exec: () => void): void {
  useEffect(() => {
    const fn = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        exec();
      }
    };
    document.body.addEventListener("mousedown", fn, true);
    return () => {
      document.body.removeEventListener("mousedown", fn, true);
    };
  }, [ref, exec]);
}
