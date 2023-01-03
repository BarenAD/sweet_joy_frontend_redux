import React, {FC, useState} from "react";

import "./Demo.scss";


const Demo: FC = () => {
  const [isLoadedImage, setIsLoadedImage] = useState<boolean>(false);

  return (
    <div className={`demo-container ${isLoadedImage ? 'demo-container-background' : ''}`}>
      {isLoadedImage &&
        <div className='demo'>
          DEMO
        </div>
      }
      <img
        src={'images/hole.png'}
        onLoadCapture={() => {setIsLoadedImage(true)}}
      />
    </div>
  );
};

export default Demo;
