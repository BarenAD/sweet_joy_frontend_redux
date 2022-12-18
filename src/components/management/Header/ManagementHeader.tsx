import {Button, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {MenuOutlined} from "@mui/icons-material";
import {Route, Routes} from "react-router";
import React, {FC, useContext, useState} from "react";
import {MANAGEMENT_PAGES} from "../Main/ManagementMain";
import "./ManagementHeader.scss";
import {httpClient} from "../../../utils/httpClient";
import {IResponseLogin} from "../../../redux/auth/authTypes";
import {ROUTES_API} from "../../../config/routesApi";
import {
  KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN,
  KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE
} from "../../../config/config";
import {HandleChangeAuthStatusContext, setProfile} from "../../../redux/auth/authSlice";
import {HandleAddNotificationContext} from "../../common/Notifications/notificationsSlice";
import {useAppDispatch} from "../../../redux/hooks";

type IManagementHeaderProps = {
  setIsOpenDrawer: (newStatus: boolean) => void;
};

const ManagementHeader: FC<IManagementHeaderProps> = ({
  setIsOpenDrawer
}) => {
  const dispatch = useAppDispatch();
  const [isOpenExitMenu, setIsOpenExitMenu] = useState<boolean>(false);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = (isAll: boolean = false) => {
    setIsOpenExitMenu(false);
    setIsLoading(true);
    httpClient<IResponseLogin>({
      url: isAll ? ROUTES_API.LOGOUT_ALL : ROUTES_API.LOGOUT,
      method: 'POST',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .finally(() => {
        setIsLoading(false);
        localStorage.removeItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN);
        localStorage.removeItem(KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE);
        dispatch(setProfile(null));
        handleChangeAuthStatusContext(false);
      });
  };

  return (
    <div className='management-header-container'>
      <div className='left-tab'>
        <IconButton
          color='inherit'
          onClick={() => {setIsOpenDrawer(true)}}
        >
          <MenuOutlined />
        </IconButton>
        <div className='current-page-container'>
          <Routes>
            {MANAGEMENT_PAGES.map((page, index) => (
              <Route
                key={`KEY_MANAGEMENT_NAVIGATION_CURRENT_PAGE_${index}`}
                path={page.route.path}
                element={
                  <Typography
                    variant='h6'
                    align='center'
                    fontWeight='bold'
                    alignItems='center'
                  >
                    {page.title}
                  </Typography>
                }
              />
            ))}
          </Routes>
        </div>
      </div>
      <div className='right-tab'>
        <Button
          style={{color: 'white'}}
          id='button_open_exit_menu'
          aria-controls='simple-menu'
          aria-haspopup='true'
          onClick={() => {setIsOpenExitMenu(true)}}
          disabled={isLoading}
        >
          Выйти
        </Button>
        <Menu
          id='simple-menu'
          anchorEl={document.getElementById('button_open_exit_menu')}
          keepMounted
          open={isOpenExitMenu}
          onClose={() => {setIsOpenExitMenu(false)}}
        >
          <MenuItem
            disabled={isLoading}
            onClick={() => {handleLogout(false)}}
          >
            Выйти на этом устройстве
          </MenuItem>
          <MenuItem
            disabled={isLoading}
            onClick={() => {handleLogout(true)}}
          >
            Выйти на всех устройствах
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default ManagementHeader;
