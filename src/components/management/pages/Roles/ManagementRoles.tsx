import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import {IPermission, IRole} from "../../../App/appTypes";
import Filters, {DEFAULT_VALUE_FILTERS, IFiltersState} from "../../../common/Filters/Filters";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {getProfile, HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import {MANAGEMENT_COUNT_ROLES_ON_PAGE} from "../../../../config/config";
import {
  IconButton,
  Pagination, Paper, Table,
  TableBody,
  TableCell,
  TableContainer, TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {AddCircleOutline, Clear, DeleteOutline, EditOutlined, FormatListBulletedOutlined} from "@mui/icons-material";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import Preloader from "../../../common/Preloader/Preloader";
import "./ManagementRoles.scss";
import {useAppSelector} from "../../../../redux/hooks";
import {checkAllowByPermissions, generateBaseRules} from "../../../../utils/utils";
import CustomModal from "../../../common/CustomModal/CustomModal";
import RoleEdit from "../../RoleEdit/RoleEdit";


const ManagementRoles: FC = () => {
  const profile = useAppSelector(getProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [newRole, setNewRole] = useState<IRole>({id: 0, name: ''});
  const [changingRole, setChangingRole] = useState<IRole | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [filtersState, setFiltersState] = useState<IFiltersState>(DEFAULT_VALUE_FILTERS);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);

  const filteredRoles = useMemo(() => {
    if (!filtersState.selectedName) {
      return roles;
    }
    return roles.filter((role) => ~role.name.toLowerCase().indexOf(filtersState.selectedName.toLowerCase()));
  }, [filtersState, roles]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredRoles.length / MANAGEMENT_COUNT_ROLES_ON_PAGE));
    setCurrentPage(1);
  }, [filteredRoles]);

  const renderedRoles = useMemo(() => {
    const startValue = (currentPage-1) * MANAGEMENT_COUNT_ROLES_ON_PAGE;
    const lastValue = (startValue + MANAGEMENT_COUNT_ROLES_ON_PAGE);
    return (
      <TableBody>
        {filteredRoles
          .map((role: IRole, index) => {
            if (index < startValue || index > lastValue) {
              return null;
            }
            return (
              <TableRow key={`KEY_MANAGEMENT_ROLES_ROLE_${role.id}`}>
                <TableCell component="th" scope="row">
                  <Typography>
                    {role.name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      handleOpenEdit(role);
                    }}
                  >
                    <FormatListBulletedOutlined/>
                  </IconButton>
                  <IconButton
                    edge="start"
                    color="inherit"
                    style={{marginRight: '10px'}}
                    onClick={() => {setChangingRole(role);}}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      confirmActionRole('DELETE', role.id);
                    }}
                  >
                    <DeleteOutline/>
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  }, [filteredRoles, currentPage]);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    httpClient<IRole[]>({
      url: ROUTES_API.MANAGEMENT_ROLES,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setRoles(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!permissions.length &&
      profile?.permissions &&
      checkAllowByPermissions(generateBaseRules('permissions'), profile.permissions)
    ) {
      httpClient<IPermission[]>({
        url: ROUTES_API.MANAGEMENT_PERMISSIONS,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
        .then((response) => setPermissions(response.data))
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  const handleOpenEdit = (role: IRole) => {
    setModalContent((
      <RoleEdit
        role={role}
        permissions={permissions}
      />
    ));
  };

  const confirmActionRole = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} роль?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionRole(action,id)
      },
    });
  };

  const handleActionRole = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const queryParam: string = action === 'POST' ? '' : `/${id ?? changingRole?.id}`;
    setIsLoading(true);
    httpClient<IRole>({
      url: ROUTES_API.MANAGEMENT_ROLES + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(action === 'POST' ?
          newRole
          :
          changingRole
        ),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setRoles([
              response.data,
              ...roles
            ]);
            setNewRole({id: 0, name: ''});
            break;
          case "PUT":
            setRoles(
              roles.map(role => {
                if (role.id === response.data?.id) {
                  return response.data;
                }
                return role;
              })
            );
            setChangingRole(null);
            break;
          case "DELETE":
            setRoles(roles.filter(role => role.id !== id));
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && !roles.length) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-roles-container'>
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
      <CustomModal
        onClose={() => {setModalContent(null)}}
        children={modalContent}
      />
      <Filters
        currentState={filtersState}
        handleOnChange={setFiltersState}
        disabled={{
          allOrNothing: 'hide',
          reverseShopId: 'hide',
          filterByShop: 'hide',
          filterByCategories: 'hide',
        }}
      />
      <div className='edit-container'>
        <div className='part-container'>
          <TextField
            style={{width: '100%'}}
            label="название"
            variant="outlined"
            value={changingRole?.name ?? newRole.name}
            disabled={isLoading}
            onChange={(event) => {
              changingRole ?
                setChangingRole({
                  ...changingRole,
                  name: event.target.value,
                })
                :
                setNewRole({
                  ...newRole,
                  name: event.target.value,
                });
            }}
          />
        </div>
        {isLoading && (changingRole || newRole.name) ?
          <div className='part-container part-container-center'>
            <Preloader size={30} />
          </div>
          :
          changingRole ?
            <div className='part-container part-container-center'>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => {confirmActionRole('PUT');}}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => {
                  setChangingRole(null);
                }}
              >
                <Clear/>
              </IconButton>
            </div>
            :
            <div className='part-container part-container-center'>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading}
                onClick={() => confirmActionRole('POST')}
              >
                <AddCircleOutline />
              </IconButton>
            </div>
        }
      </div>
      <Pagination
        page={currentPage}
        count={countPages}
        onChange={handleChangePage}
        className='paginate-container'
      />
      <div className='table-content-container'>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Название роли</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            {renderedRoles}
          </Table>
        </TableContainer>
      </div>
      <Pagination
        page={currentPage}
        count={countPages}
        onChange={handleChangePage}
        className='paginate-container'
      />
    </div>
  );
};

export default ManagementRoles;
