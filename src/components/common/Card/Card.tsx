import React, {FC, PropsWithChildren} from "react";
import "./Card.scss";

const Card: FC<PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = (props) => {
  return (
    <div
      {...props}
      className={`card-container ${props.className || ''}`}
    >
      {props.children}
    </div>
  );
}

export default Card;
