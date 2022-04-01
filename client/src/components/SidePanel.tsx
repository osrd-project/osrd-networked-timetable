import React, { FC, useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export const SidePanel: FC<{ close?: () => void }> = ({ children, close }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => {
    if (close) close();
  });

  return (
    <div ref={ref} className="sidepanel">
      {close && (
        <button className="sidepanel-close btn btn-link" title="Fermer" onClick={() => close()}>
          <i className="icons-close"></i>
        </button>
      )}

      <div className="sidepanel-wrapper">{children}</div>
    </div>
  );
};
