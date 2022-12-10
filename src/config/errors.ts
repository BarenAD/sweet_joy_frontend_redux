import {IConfigError} from "../utils/ErrorByConfig";

type IErrors = {
  UNKNOWN_ERROR: IConfigError;
};

export const ERRORS: IErrors = {
  UNKNOWN_ERROR: {
    id: 0,
    message: 'Произошла непредвиденная ошибка'
  },
};
