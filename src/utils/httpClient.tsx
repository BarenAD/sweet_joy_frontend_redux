import {INotification} from "../redux/notifications/notificationsSlice";
import {APP_DEBUG, KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN, REQUEST_MODE} from "../config/config";
import ErrorByConfig, {IConfigError} from "./ErrorByConfig";
import {ERRORS} from "../config/errors";
import React from "react";
import {ROUTES} from "../config/routes";

type IFetchWithTokenProps = RequestInit & {
  url: string,
  isNeedAuth?: boolean;
  handleAddNotification?: (notification: INotification) => void;
  handleChangeAuthStatus?: (newStatus: boolean) => void;
  isDebug?: boolean
};

type IFetchWithTokenResponse<T> = {
  response: {
    status: number;
    statusText: string;
  }
  data: T;
};

export const httpClient = async <T,>({
  url,
  body,
  handleAddNotification,
  handleChangeAuthStatus,
  headers = {},
  isNeedAuth = false,
  method = 'get',
  mode = REQUEST_MODE,
  isDebug = APP_DEBUG
}: IFetchWithTokenProps): Promise<IFetchWithTokenResponse<T>> => {
  const accessToken = localStorage.getItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN);
  const preparedHeaders: HeadersInit = new Headers({
    'Accept': 'Application/json',
    'Content-Type': 'Application/json',
    ...headers
  });

  if (isNeedAuth && accessToken) {
    preparedHeaders.append('Authorization', accessToken);
  }

  return await fetch(url, {
    method: method,
    mode: mode,
    headers: preparedHeaders,
    body: body,
  })
    .then(async (response) => {
      const responseData = await response.json();
      if (!response.ok) {
        throwableByStatus(response.status, {
          response: response,
          responseData: responseData,
        });
      }
      if (isDebug && handleAddNotification) {
        handleAddNotification({
          type: 'info',
          message: `Запрос успешно выполнен: ${url}`,
        });
      }
      return {
        response: {
          status: response.status,
          statusText: response.statusText,
        },
        data: responseData,
      };
    })
    .catch((error) => {
      const isConfigError: boolean = error instanceof ErrorByConfig;
      if (handleAddNotification) {
        let message = `Ошибка выполнения запроса! ${error.message}`;
        if (isConfigError) {
          message = `Ошибка выполнения запроса! ${error.body?.payload?.responseData?.message ?? error.body.message}`;
        }
        handleAddNotification({
          type: 'error',
          message: message,
        });
      }
      if (isConfigError && error.body.id === ERRORS.UNAUTHORIZED_ERROR.id) {
        handleChangeAuthStatus ?
          handleChangeAuthStatus(false)
          :
          window.location.href = ROUTES.AUTH.link;
      }
      throw error;
    });
};

const throwableByStatus = (status: number, payload: any) => {
  let errorConfig: IConfigError;
  switch (status) {
    case 401:
      errorConfig = ERRORS.UNAUTHORIZED_ERROR;
      break;
    case 403:
      errorConfig = ERRORS.FORBIDDEN_ERROR;
      break;
    default:
      errorConfig = ERRORS.UNKNOWN_ERROR;
      break;
  }
  throw new ErrorByConfig({
    ...errorConfig,
    payload: payload,
  });
};