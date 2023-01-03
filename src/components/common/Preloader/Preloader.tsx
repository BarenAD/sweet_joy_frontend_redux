import React, {FC, useEffect} from "react";
import "./Preloader.scss";

declare interface IIconAnimateLoading {
  color?: string;
  size?: number;
  delay?: {
    delay: number;
    setDelay: (newDelay: number) => void;
  }
}

const Preloader: FC<IIconAnimateLoading> = ({
  color = '#244fea',
  size = 30,
  delay,
}) => {
  useEffect(() => {
    if (!delay?.delay) {
      return;
    }
    const leftTimeOut = setTimeout(() => {
      delay.setDelay(delay.delay - 1);
    }, 1000);
    return () => clearTimeout(leftTimeOut);
  }, [delay]);

  if (delay !== undefined && !delay?.delay) {
    return null;
  }

  return (
    <div
      className='component-preloader-container'
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `${size / 10}px solid #fff`,
          borderRight: `${size / 10}px solid ${color}`,
        }}
        className='circle-loading-animation-container'
      />
      <span
        style={{
          fontSize: `${size/2}px`,
          color: color,
        }}
      >
        {delay?.delay}
      </span>
    </div>
  )
};

export default Preloader;
