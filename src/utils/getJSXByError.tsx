import React, {ReactElement} from "react";
import {ERRORS} from "../config/errors";
import {List, ListItem} from "@mui/material";

export const getJSXByError = (errorId: number, payloadError: any): ReactElement | undefined => {
  switch (errorId) {
    case ERRORS.VALIDATE_ERROR.id:
      return (
        <List>
          <ListItem>
            {ERRORS.VALIDATE_ERROR.message}
          </ListItem>
          {payloadError.errors && Object.entries<string[]>(payloadError.errors)
            .map(([field, errors]) => {
              return errors.map(error =>
                <ListItem>
                  {error}
                </ListItem>
              );
            })}
        </List>
      )
    default:
      return undefined;
  }
};
