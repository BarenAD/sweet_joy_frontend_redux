import {ReactElement} from "react";
import {getJSXByError} from "./getJSXByError";

export type IConfigError = {
  id: number;
  message: string;
}

export type IErrorBody = IConfigError & {
  jsxError?: ReactElement;
}

export default class ErrorByConfig extends Error {
  public body: IErrorBody;
  public throwableMessage?: string;

  public constructor(
    errorConfig: IConfigError,
    payload?: any,
    throwable: Error | null = null,
  ) {
    super(errorConfig.message);
    this.body = errorConfig;
    if (throwable && throwable.message) {
      this.throwableMessage = throwable.message;
    }
    if (throwable && throwable.name) {
      this.name = throwable.name;
    }
    if (throwable && throwable.stack) {
      this.stack = throwable.stack;
    }
    this.body.jsxError = payload ? getJSXByError(errorConfig.id, payload) : undefined;
  }
};
