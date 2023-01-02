import React, {FC, useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {Button, TextField, Typography} from "@mui/material";
import "./Login.scss"
import Preloader from "../Preloader/Preloader";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../redux/slices/notificationsSlice";
import { HandleChangeAuthStatusContext, setProfile } from "../../../redux/slices/authSlice";
import {
  KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN,
  KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE
} from "../../../config/config";
import {
  getConfigurations,
  getConfigurationsStatus,
  refreshConfigurations
} from "../../../redux/slices/configurationsSlice";
import {STORE_STATUSES} from "../../../config/storeStatuses";
import {IResponseLogin} from "../../../types";

const Login: FC = () => {
  const dispatch = useAppDispatch();
  const configurations = useAppSelector(getConfigurations);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const configurationsStatus = useAppSelector(getConfigurationsStatus);

  useEffect(() => {
    dispatch(refreshConfigurations());
  }, []);

  useEffect(() => {
    setEmail(configurations[SITE_CONFIG_IDENTIFIERS.DEMO_USER_EMAIL]?.value ?? '');
    setPassword(configurations[SITE_CONFIG_IDENTIFIERS.DEMO_USER_PASSWORD]?.value ?? '');
  }, [configurations]);

  const handleValidate = (): boolean => {
    return email.length > 0 && password.length > 0
  };

  const handleLogin = () => {
    setIsLoading(true);
    httpClient<IResponseLogin>({
      url: ROUTES_API.LOGIN,
      method: 'POST',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: false,
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(({data}) => {
        localStorage.setItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN, data.token);
        const preparedData: any = {...data};
        delete preparedData.token;
        localStorage.setItem(KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE, JSON.stringify(preparedData));
        dispatch(setProfile(preparedData));
        handleChangeAuthStatusContext(true);
      })
      .finally(() => {
        setPassword('');
        setIsLoading(false);
      });
  };

  if (configurationsStatus === STORE_STATUSES.LOADING) {
    return (
      <div className='authorization-login-container'>
        <div className='form-container'>
          <Preloader size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className='authorization-login-container'>
      <div className='form-container'>
        <Typography
          variant='h4'
        >
          Авторизация
        </Typography>
        <TextField
          label='E-mail'
          variant='outlined'
          value={email}
          className='form-element'
          disabled={isLoading}
          onChange={(event) => {setEmail(event.target.value)}}
        />
        <TextField
          label='Пароль'
          type='password'
          variant='outlined'
          value={password}
          className='form-element'
          disabled={isLoading}
          onChange={(event) => {setPassword(event.target.value)}}
        />
        {isLoading ?
          <div className='preloader-container'>
            <Preloader
              size={40}
            />
          </div>
          :
          <Button
            variant='contained'
            color='primary'
            className='form-element'
            onClick={handleLogin}
            disabled={!handleValidate()}
          >
            Войти
          </Button>
        }
      </div>
    </div>
  );
};

export default Login;
