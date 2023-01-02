import {INotificationAction} from "../redux/slices/notificationsSlice";
import {
  API_URL,
  KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN,
  KEY_LOCAL_STORAGE_IS_DEBUG,
  REQUEST_MODE
} from "../config/config";
import ErrorByConfig, {IConfigError} from "./ErrorByConfig";
import {ERRORS} from "../config/errors";
import React from "react";
import {ROUTES} from "../config/routes";

type IFetchWithTokenProps = RequestInit & {
  url: string,
  isNeedAuth?: boolean;
  bodyIsFormData?: boolean,
  handleAddNotification?: (notification: INotificationAction) => void;
  handleChangeAuthStatus?: (newStatus: boolean) => void;
  isDebug?: boolean
};

export type IFetchWithTokenResponse<T> = {
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
  bodyIsFormData = false,
  method = 'get',
  mode = REQUEST_MODE,
  isDebug
}: IFetchWithTokenProps): Promise<IFetchWithTokenResponse<T>> => {
  const preparedIsDebug = isDebug ?? !!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG);
  const accessToken = localStorage.getItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN);
  const preparedHeaders: HeadersInit = new Headers({
    'Accept': 'Application/json',
    ...headers
  });

  if (!bodyIsFormData) {
    preparedHeaders.append('Content-Type', 'Application/json');
  }

  if (isNeedAuth && accessToken) {
    preparedHeaders.append('Authorization', `Bearer ${accessToken}`);
  }

  // if (preparedIsDebug && handleAddNotification) {
  //   handleAddNotification({
  //     type: 'info',
  //     message: `[DEBUG] Запрос: ${url.replace(API_URL, '')}`,
  //   });
  // }

  const timeBeforeFetch: number = new Date().getTime();
  return await fetch(url, {
    method: method,
    mode: mode,
    headers: preparedHeaders,
    body: body,
  })
    .then(async (response) => {
      const responseData = await response.json();
      if (!response.ok) {
        throwableByStatus(response.status, responseData);
      }
      if (preparedIsDebug) {
        const timeAfterFetch: number = new Date().getTime();
        const fetchTime: number = (timeAfterFetch - timeBeforeFetch) / 1000;
        console.log(`[DEBUG] request successfully on [${fetchTime}] seconds. Result response:`);
        console.log(response);
        console.log(responseData);
        if (handleAddNotification) {
          handleAddNotification({
            type: 'success',
            message: `[DEBUG] Запрос : ${url.replace(API_URL, '')} успешно выполнен за [${fetchTime}] секунд`,
          });
        }
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
        handleAddNotification({
          type: 'error',
          message: error?.body?.jsxError ?? error.message,
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
    case 422:
      throw new ErrorByConfig(ERRORS.VALIDATE_ERROR, payload);
    default:
      errorConfig = ERRORS.UNKNOWN_ERROR;
      break;
  }
  throw new ErrorByConfig({
    id: errorConfig.id,
    message: payload?.message ?? errorConfig.message,
  }, payload);
};
