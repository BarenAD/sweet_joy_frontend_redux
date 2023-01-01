import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {IPermission, IRole, IRolePermission} from "../../App/appTypes";
import {
  FormControl,
  IconButton, InputLabel, MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import "./RoleEdit.scss";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import {HandleAddNotificationContext} from "../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../redux/auth/authSlice";
import {AddCircleOutline, DeleteOutline} from "@mui/icons-material";
import ConfirmDialog, {ISimpleDialogContentState} from "../../common/ConfirmDialog/ConfirmDialog";
import Preloader from "../../common/Preloader/Preloader";

type IRoleEditProps = {
  role: IRole;
  permissions: IPermission[];
};

type IPreparedRolePermissions = IPermission & IRolePermission;

const RoleEdit: FC<IRoleEditProps> = ({
  role,
  permissions,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rolePermissions, setRolePermissions] = useState<IRolePermission[]>([]);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [selectPermissionID, setSelectPermissionID] = useState<number | null>(null);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);

  const preparedRolePermissions = useMemo(() => {
    return rolePermissions.reduce<IPreparedRolePermissions[]>((result, rolePermission) => {
      const permission = permissions.find((findItem) => findItem.id === rolePermission.permission_id);
      if (permission) {
        result.push({
          ...permission,
          ...rolePermission,
        });
      }
      return result;
    }, []);
  }, [permissions, rolePermissions]);

  useEffect(() => {
    httpClient<IRolePermission[]>({
      url: ROUTES_API.MANAGEMENT_ROLES_PERMISSIONS.replace(':roleId', `${role.id}`),
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setRolePermissions(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  const confirmActionRolePermission = (action: 'POST' | 'DELETE', id: number) => {
    const messageAction = action === 'POST' ? 'добавить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} право?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionRolePermission(action,id)
      },
    });
  };

  const handleActionRolePermission = (action: 'POST' | 'DELETE', id: number) => {
    const queryParam: string = action === 'POST' ? '' : `/${id}`;
    setIsLoading(true);
    httpClient<IRolePermission>({
      url: ROUTES_API.MANAGEMENT_ROLES_PERMISSIONS.replace(':roleId', `${role.id}`) + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify({permission_id: id}),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setRolePermissions([
              response.data,
              ...rolePermissions,
            ]);
            setSelectPermissionID(null);
            break;
          case "DELETE":
            setRolePermissions(rolePermissions.filter(rolePermission => rolePermission.id !== id));
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  const selectPermission = useMemo<ReactElement>(() => {
    return (
      <FormControl variant='standard' className='field'>
        <InputLabel id={`ID_EDIT_ROLE_SELECT_LABEL_PERMISSION`}>Право роли</InputLabel>
        <Select
          labelId={`ID_EDIT_ROLE_SELECT_LABEL_PERMISSION`}
          id={`ID_EDIT_ROLE_SELECT_PERMISSION`}
          value={selectPermissionID ? `${selectPermissionID}` : ''}
          disabled={isLoading}
          onChange={(event) => {
            let value = event.target.value;
            if (typeof value === "number") {
              setSelectPermissionID(value);
            }
          }}
        >
          {permissions
            .filter((permission) => !rolePermissions
              .find((rolePermission) => rolePermission.permission_id === permission.id)
            )
            .map(permission => (
              <MenuItem
                key={`KEY_EDIT_SHOP_SELECT_SCHEDULE_ITEM_${permission.id}`}
                value={permission.id}
                title={permission.description}
              >
                <Typography
                  color='blue'
                  style={{width: '300px', marginRight: '15px'}}
                >
                  {`[${permission.permission}]  `}
                </Typography>
                <Typography>
                  {permission.name}
                </Typography>
              </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [isLoading, selectPermissionID, permissions, rolePermissions]);

  if (isLoading && !rolePermissions.length) {
    return (
      <div className='role-edit-modal'>
        <div className='preloader-center'>
          <Preloader size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className='role-edit-modal'>
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
        Редактирование роли
      </Typography>
      <TableContainer>
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>Право</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                component='th'
                scope='row'
              >
                {selectPermission}
              </TableCell>
              <TableCell component='th' scope='row'>
                <IconButton
                  disabled={isLoading}
                  edge='start'
                  color='inherit'
                  onClick={() => {
                    if (selectPermissionID) {
                      confirmActionRolePermission('POST', selectPermissionID);
                    }
                  }}
                >
                  <AddCircleOutline/>
                </IconButton>
              </TableCell>
            </TableRow>
            {preparedRolePermissions
              .map((preparedRolePermission) =>
                <TableRow
                  key={`KEY_MANAGEMENT_ROLES_ROLE_${role.id}_EDIT_MODAL_PERMISSION_${preparedRolePermission.id}`}
                  title={preparedRolePermission.description}
                >
                  <TableCell component='th' scope='row'>
                    <Typography color='blue'>
                      {`[${preparedRolePermission.permission}]  `}
                    </Typography>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <Typography>
                      {preparedRolePermission.name}
                    </Typography>
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <IconButton
                      disabled={isLoading}
                      edge='start'
                      color='inherit'
                      onClick={() => {
                        confirmActionRolePermission('DELETE', preparedRolePermission.id);
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

export default RoleEdit;
