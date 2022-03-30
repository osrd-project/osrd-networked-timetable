import React, { FC } from "react";
import { useSelector } from "../hooks/useSelector";

export const Loader: FC = () => {
  return <div className="spinner-border" role="status"></div>;
};

export const LoaderFill: FC = () => {
  return (
    <div className="fill flex-centered" style={{ zIndex: 9999, backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
      <Loader />
    </div>
  );
};

export const LoaderFillState: FC = () => {
  const loading = useSelector((state) => state.loading);
  return <>{loading > 0 && <LoaderFill />}</>;
};
