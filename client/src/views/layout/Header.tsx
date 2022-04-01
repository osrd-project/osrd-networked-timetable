import React, { FC } from "react";
import { Link } from "react-router-dom";

export const Header: FC = () => {
  return (
    <div className="mastheader">
      <div className="mastheader-logo">
        <Link to={process.env.PUBLIC_URL} title="Accueil">
          <img alt="SNCF" src={`${process.env.PUBLIC_URL}/assets/img/sncf-logo.png`} width="70" />
        </Link>
      </div>
      <header role="banner" className="mastheader-title d-none d-xl-block">
        <h1 className="text-uppercase text-white pt-2 pl-3 mb-0">Reticular</h1>
      </header>
    </div>
  );
};
