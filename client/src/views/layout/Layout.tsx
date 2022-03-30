import React, { FC } from "react";

import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: FC<{ className?: string }> = ({ className, children }) => {
  return (
    <div id="app-root" className={className}>
      <Header />
      <main className="mastcontainer">{children}</main>
      <Footer />
    </div>
  );
};
