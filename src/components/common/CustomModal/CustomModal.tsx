import React, {FC, PropsWithChildren, ReactElement} from "react";
import "./CustomModal.scss";
import {Card, IconButton, Modal} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";

export type ModalProps = {
  onClose: () => void;
  children: ReactElement | null;
};

const CustomModal: FC<ModalProps & React.DataHTMLAttributes<HTMLDivElement>> = ({
  children,
  onClose,
  ...props
}: PropsWithChildren<ModalProps & React.DataHTMLAttributes<HTMLDivElement>>) => {
  return (
    <Modal
      open={!!children}
      onClose={onClose}
    >
      <Card
        {...props}
        className={`modal-content-container ${props.className ?? ''}`}
      >
        <IconButton
          color='inherit'
          size='large'
          onClick={onClose}
          className='modal-close_container'
        >
          <CloseOutlined fontSize='large' />
        </IconButton>
        {children}
      </Card>
    </Modal>
  );
};

export default CustomModal;
