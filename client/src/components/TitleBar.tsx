import React, { FC } from "react";

export const TitleBar: FC<{ title: string }> = ({ title }) => {
  return (
    <div className="actionbar">
      <div className="actionbar-head">
        <h1 className="mb-0">{title}</h1>
        {/*
        <ul className="toolbar mb-0">
          <li className="toolbar-item">
            <button className="btn btn-sm btn-transparent btn-color-gray toolbar-item-spacing">
              <span className="sr-only">Edit</span>
              <i className="icons-pencil icons-size-1x25" aria-hidden="true"></i>
            </button>
          </li>
        </ul>
        */}
      </div>
    </div>
  );
};
