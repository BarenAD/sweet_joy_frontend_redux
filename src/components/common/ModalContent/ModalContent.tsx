import React, {FC, PropsWithChildren} from "react";
import "./ModalContent.scss";
import {Card, IconButton} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";

export type ModalProps = {
  handleClose: () => void;
  children: React.ReactElement | null;
};

const ModalContent: FC<ModalProps & React.DataHTMLAttributes<HTMLDivElement>> = ({
  children,
  handleClose,
  ...props
}: PropsWithChildren<ModalProps & React.DataHTMLAttributes<HTMLDivElement>>) => {
  return (
    <Card
      {...props}
      className={`modal-content-container ${props.className ?? ''}`}
    >
      <IconButton
        color='inherit'
        size='large'
        onClick={handleClose}
        className='modal-close_container'
      >
        <CloseOutlined fontSize='large' />
      </IconButton>
      {children}
    </Card>
  );
};

export default ModalContent;
