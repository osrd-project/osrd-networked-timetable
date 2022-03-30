import React, { FC } from "react";

export const NavBar: FC = () => {
  return (
    <nav role="navigation" className="mastnav">
      <ul className="mastnav-top">
        <li>
          <a href="#" className="mastnav-item active">
            <i className="icons-bookmark icons-size-1x5" aria-hidden="true"></i>
            <span className="font-weight-medium">Favoris</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};
