export type IConfigError = {
  id: number;
  message: string;
}

export type IErrorBody = {
  id: number;
  message: string;
  throwable?: Error;
}

export default class ErrorByConfig extends Error {
  public config: IConfigError;
  public throwableMessage?: string;

  public constructor(
    errorConfig: IConfigError,
    throwable: Error | null = null,
  ) {
    super(errorConfig.message);
    this.config = errorConfig;
    if (throwable && throwable.message) {
      this.throwableMessage = throwable.message;
    }
    if (throwable && throwable.name) {
      this.name = throwable.name;
    }
    if (throwable && throwable.stack) {
      this.stack = throwable.stack;
    }
  }
};
