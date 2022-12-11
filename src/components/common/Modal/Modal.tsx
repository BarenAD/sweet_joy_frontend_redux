import React, {FC, PropsWithChildren} from "react";
import "./Modal.scss";
import CloseIcon from "../../../assets/icons/close.svg";

export type ModalProps = {
  handleClose: () => void;
  children: React.ReactElement | null;
  allowClose?: boolean;
  isShow?: boolean;
  isMobile?: boolean;
  callbackHandleClose?: () => void;
};

const Modal: FC<ModalProps & React.DataHTMLAttributes<HTMLDivElement>> = ({
  isShow = false,
  isMobile = true,
  allowClose = true,
  children,
  handleClose,
  callbackHandleClose,
  ...props
}: PropsWithChildren<ModalProps & React.DataHTMLAttributes<HTMLDivElement>>) => {
  if (!isShow) {
    return null;
  }

  const modalHandleClose = () => {
    if (!allowClose) {
      return null;
    }
    handleClose();
    if (callbackHandleClose) {
      callbackHandleClose();
    }
  }

  return (
    <div
      className='modal-main-container'
      {...props}
    >
      <div className='modal-background-container' onClick={modalHandleClose}/>
      <div className='modal-content-container'>
        <div className='modal-children-container'>
          {children}
        </div>
        {allowClose && (
          <div className={`modal-close-container${isMobile ? ' modal-close-container-mobile' : ''}`}>
            <div className='modal-close-icon-container' onClick={modalHandleClose}>
              <img src={CloseIcon} alt=''/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
