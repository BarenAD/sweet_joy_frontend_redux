import React, {FC, useContext, useState} from "react";
import {useAppDispatch} from "../../../redux/hooks";
import {Button, TextField, Typography} from "@mui/material";
import "./Registration.scss"
import Preloader from "../Preloader/Preloader";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../redux/slices/notificationsSlice";
import { HandleChangeAuthStatusContext, setProfile } from "../../../redux/slices/authSlice";
import {
  KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN,
  KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE
} from "../../../config/config";
import {IResponseLogin} from "../../../types";

const Registration: FC = () => {
  const dispatch = useAppDispatch();
  const [fio, setFio] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  const handleValidate = (): boolean => {
    return fio.length > 0 && phone.length > 0 && email.length > 0 && password.length > 0
  };

  const handleRegistration = () => {
    setIsLoading(true);
    httpClient<IResponseLogin>({
      url: ROUTES_API.REGISTRATION,
      method: 'POST',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: false,
      body: JSON.stringify({
        fio: fio,
        phone: phone,
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
        setIsLoading(false);
      });
  };

  return (
    <div className='authorization-login-container'>
      <div className='form-container'>
        <Typography
          variant='h4'
        >
          Регистрация
        </Typography>
        <TextField
          label='ФИО'
          variant='outlined'
          value={fio}
          className='form-element'
          disabled={isLoading}
          onChange={(event) => {setFio(event.target.value)}}
        />
        <TextField
          label='Телефон'
          variant='outlined'
          value={phone}
          className='form-element'
          disabled={isLoading}
          onChange={(event) => {setPhone(event.target.value)}}
        />
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
            onClick={handleRegistration}
            disabled={!handleValidate()}
          >
            Зарегистрироваться
          </Button>
        }
      </div>
    </div>
  );
};

export default Registration;
