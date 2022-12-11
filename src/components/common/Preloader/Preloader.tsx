import React, { FunctionComponent } from "react";
import "./Preloader.scss";

declare interface IIconAnimateLoading {
  color?: string;
  size?: number;
}

const Preloader: FunctionComponent<IIconAnimateLoading> = ({
  color = '#244fea',
  size = 30,
}) => <div
  style={{
    width: `${size}px`,
    height: `${size}px`,
    border: `${size / 10}px solid #fff`,
    borderRight: `${size / 10}px solid ${color}`,
  }}
  className='circle-loading-animation-container'
/>;

export default Preloader;
