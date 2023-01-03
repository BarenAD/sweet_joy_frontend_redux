import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {IRole, IUser, IUserRole} from "../../../types";
import Preloader from "../../common/Preloader/Preloader";
import ConfirmDialog, {ISimpleDialogContentState} from "../../common/ConfirmDialog/ConfirmDialog";
import {
  FormControl,
  IconButton, InputLabel, MenuItem, Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {AddCircleOutline, DeleteOutline} from "@mui/icons-material";
import {HandleAddNotificationContext} from "../../../redux/slices/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../redux/slices/authSlice";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import "./UserRolesEdit.scss";

type IUserRolesEditProps = {
  user: IUser;
  roles: IRole[];
};

type IPreparedUserRole = IUserRole & IRole;

const UserRolesEdit: FC<IUserRolesEditProps> = ({
  user,
  roles,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRoles, setUserRoles] = useState<IUserRole[]>([]);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [selectRoleID, setSelectRoleID] = useState<number | null>(null);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);

  const preparedUserRoles = useMemo(() => {
    return userRoles.reduce<IPreparedUserRole[]>((result, userRole) => {
      const role = roles.find((findItem) => findItem.id === userRole.role_id);
      if (role) {
        result.push({
          ...role,
          ...userRole,
        });
      }
      return result;
    }, []);
  }, [roles, userRoles]);

  const selectRole = useMemo<ReactElement>(() => {
    return (
      <FormControl variant='standard' className='field'>
        <InputLabel id={`ID_EDIT_USER_SELECT_LABEL_ROLES`}>Роль</InputLabel>
        <Select
          labelId={`ID_EDIT_USER_SELECT_LABEL_ROLES`}
          id={`ID_EDIT_USER_SELECT_ROLES`}
          value={selectRoleID ? `${selectRoleID}` : ''}
          disabled={isLoading}
          onChange={(event) => {
            let value = event.target.value;
            if (typeof value === "number") {
              setSelectRoleID(value);
            }
          }}
        >
          {roles
            .filter((role) => !userRoles
              .find((userRole) => userRole.role_id === role.id)
            )
            .map(role => (
              <MenuItem
                key={`KEY_EDIT_USER_SELECT_ROLE_ITEM_${role.id}`}
                value={role.id}
                title={role.description}
              >
                <Typography>
                  {role.name}
                </Typography>
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  }, [isLoading, selectRoleID, roles, userRoles]);

  useEffect(() => {
    httpClient<IUserRole[]>({
      url: ROUTES_API.MANAGEMENT_USERS_ROLES.replace(':userId', `${user.id}`),
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setUserRoles(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  const confirmActionUserRole = (action: 'POST' | 'DELETE', id: number) => {
    const messageAction = action === 'POST' ? 'добавить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} роль?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionUserRole(action,id)
      },
    });
  };

  const handleActionUserRole = (action: 'POST' | 'DELETE', id: number) => {
    const queryParam: string = action === 'POST' ? '' : `/${id}`;
    setIsLoading(true);
    httpClient<IUserRole>({
      url: ROUTES_API.MANAGEMENT_USERS_ROLES.replace(':userId', `${user.id}`) + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify({role_id: id}),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setUserRoles([
              response.data,
              ...userRoles,
            ]);
            setSelectRoleID(null);
            break;
          case "DELETE":
            setUserRoles(userRoles.filter(userRole => userRole.id !== id));
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && !userRoles.length && !selectRoleID) {
    return (
      <div className='user-roles-edit-modal'>
        <div className='preloader-center'>
          <Preloader size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className='user-roles-edit-modal'>
      <ConfirmDialog
        isOpen={!!dialogContent}
        title={dialogContent?.title}
        confirmButton={dialogContent ? {
            text: dialogContent.confirmText,
            handle: dialogContent.handleConfirm,
          }
          :
          undefined
        }
        declineButton={{
          text: 'Отмена',
          handle: () => {
            setDialogContent(null);
          }
        }}
      />
      <Typography
        variant='h6'
        align='center'
      >
        Редактирование ролей пользователя
      </Typography>
      <TableContainer>
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>Роль</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                component='th'
                scope='row'
              >
                {selectRole}
              </TableCell>
              <TableCell component='th' scope='row'>
                <IconButton
                  disabled={isLoading}
                  edge='start'
                  color='inherit'
                  onClick={() => {
                    if (selectRoleID) {
                      confirmActionUserRole('POST', selectRoleID);
                    }
                  }}
                >
                  <AddCircleOutline/>
                </IconButton>
              </TableCell>
            </TableRow>
            {preparedUserRoles
              .map((preparedUserRole) =>
                <TableRow key={`KEY_MANAGEMENT_USERS_USER_${user.id}_EDIT_MODAL_ROLES_${preparedUserRole.id}`}>
                  <TableCell component='th' scope='row'>
                    <Typography>
                      {preparedUserRole.name}
                    </Typography>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <IconButton
                      disabled={isLoading}
                      edge='start'
                      color='inherit'
                      onClick={() => {
                        confirmActionUserRole('DELETE', preparedUserRole.id);
                      }}
                    >
                      <DeleteOutline/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserRolesEdit;
