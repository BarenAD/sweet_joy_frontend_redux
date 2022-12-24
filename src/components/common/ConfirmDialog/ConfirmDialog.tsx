import React, {FC} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export type ISimpleDialogContentState = {
  title: string;
  confirmText: string;
  handleConfirm: () => void;
  callbackDecline?: () => void;
};

type IConfirmDialogProps = {
  isOpen: boolean;
  title?: string;
  content?: string;
  confirmButton?: {
    text: string;
    handle: () => void;
  };
  declineButton?: {
    text: string;
    handle: () => void;
  };
};

const ConfirmDialog: FC<IConfirmDialogProps> = ({
  isOpen,
  title,
  content,
  confirmButton,
  declineButton,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={declineButton?.handle}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title &&
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
      }
      {content &&
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
      }
      <DialogActions>
        {declineButton &&
          <Button onClick={declineButton.handle}>
            {declineButton.text}
          </Button>
        }
        {confirmButton &&
          <Button onClick={confirmButton.handle} autoFocus>
            {confirmButton.text}
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
