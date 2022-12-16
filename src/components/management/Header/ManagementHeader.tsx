import {Button, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {MenuOutlined} from "@mui/icons-material";
import {Route, Routes} from "react-router";
import React, {FC, useState} from "react";
import {MANAGEMENT_PAGES} from "../Main/ManagementMain";
import "./ManagementHeader.scss";

type IManagementHeaderProps = {
  setIsOpenDrawer: (newStatus: boolean) => void;
};

const ManagementHeader: FC<IManagementHeaderProps> = ({
  setIsOpenDrawer
}) => {
  const [isOpenExitMenu, setIsOpenExitMenu] = useState<boolean>(false);

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
            //onClick={() => {setIsOpenExitMenu(false), handleLogout);}}
          >
            Выйти на этом устройстве
          </MenuItem>
          <MenuItem
            //onClick={() => {setIsOpenExitMenu(false), handleAllLogout);}}
          >
            Выйти на всех устройствах
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default ManagementHeader;
