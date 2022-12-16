import React, {FC, useContext, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import {getConfigurations} from "../../App/appSlice";
import {SITE_CONFIG_IDENTIFIERS} from "../../../config/siteConfigIdentifiers";
import {Button, TextField, Typography} from "@mui/material";
import "./Login.scss"
import Preloader from "../Preloader/Preloader";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import {IProfile} from "../../../redux/auth/authTypes";
import {HandleAddNotificationContext} from "../../../redux/notifications/notificationsSlice";
import { HandleChangeAuthStatusContext } from "../../../redux/auth/authSlice";

const Login: FC = () => {
  const isDemo: boolean = !!useAppSelector(getConfigurations)[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value;
  const [email, setEmail] = useState<string>(isDemo ? 'admin' : '');
  const [password, setPassword] = useState<string>(isDemo ? 'qwerty' : '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  const handleValidate = (): boolean => {
    return email.length > 0 && password.length > 0
  };

  const handleLogin = () => {
    setIsLoading(true);
    httpClient<IProfile>({
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
      .finally(() => {
        setIsLoading(false);
      });
  };

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
