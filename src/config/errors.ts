import {IConfigError} from "../utils/ErrorByConfig";

type IErrors = {
  UNKNOWN_ERROR: IConfigError;
  UNAUTHORIZED_ERROR: IConfigError;
  FORBIDDEN_ERROR: IConfigError;
};

export const ERRORS: IErrors = {
  UNKNOWN_ERROR: {
    id: 0,
    message: 'Произошла непредвиденная ошибка'
  },
  UNAUTHORIZED_ERROR: {
    id: 1,
    message: 'Необходима авторизация пользователя'
  },
  FORBIDDEN_ERROR: {
    id: 2,
    message: 'Недостаточно прав администрирования'
  },
};
