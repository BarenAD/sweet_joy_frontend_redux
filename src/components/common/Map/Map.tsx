import React, {FC} from "react";
import Preloader from "../Preloader/Preloader";
import "./Map.scss";

const Map: FC<{map: string}> = (props) => {

  return (
    <div
      className='map-container'
      {...props}
    >
      <div className='preloader-container'>
        <Preloader size={40} />
      </div>
      <div className='content' dangerouslySetInnerHTML={{__html: props.map}}/>
    </div>
  );
}

export default Map;
