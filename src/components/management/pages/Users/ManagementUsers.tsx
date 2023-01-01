import React, {FC, useContext, useEffect, useMemo, useState} from "react";
import {IUser} from "../../../App/appTypes";
import Filters, {DEFAULT_VALUE_FILTERS, IFiltersState} from "../../../common/Filters/Filters";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import {MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE, MANAGEMENT_COUNT_USERS_ON_PAGE} from "../../../../config/config";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {
  IconButton,
  Pagination,
  Paper, Table,
  TableBody,
  TableCell,
  TableContainer, TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {Clear, DeleteOutline, EditOutlined} from "@mui/icons-material";
import Preloader from "../../../common/Preloader/Preloader";
import {preparePhoneByMask} from "../../../../utils/utils";
import "./ManagementUsers.scss";

const ManagementUsers: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const [filtersState, setFiltersState] = useState<IFiltersState>(DEFAULT_VALUE_FILTERS);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [changingUser, setChangingUser] = useState<IUser & {password: string | null} | null>(null);

  const filteredUsers = useMemo(() => {
    if (!filtersState.selectedName) {
      return users;
    }
    return users.filter((filterItem) => ~filterItem.fio.toLowerCase().indexOf(filtersState.selectedName.toLowerCase()));
  }, [users, filtersState, currentPage]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredUsers.length / MANAGEMENT_COUNT_USERS_ON_PAGE));
    setCurrentPage(1);
  }, [filteredUsers]);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    httpClient<IUser[]>({
      url: ROUTES_API.MANAGEMENT_USERS,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setUsers(response.data))
      .finally(() => setIsLoading(false));
  }, []);

  const tableBody = useMemo(() => {
    return (
      <TableBody>
        {filteredUsers.map((user, index) => {
          const startValue = (currentPage-1) * MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE;
          const lastValue = (startValue + MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE);

          if (index < startValue || index > lastValue) {
            return null;
          }

          return (
            <TableRow key={`KEY_MANAGEMENT_DOCUMENTS_DOCUMENT_${user.id}`}>
              <TableCell component='th' scope='row'>
                <p>
                  {user.fio}
                </p>
              </TableCell>
              <TableCell component='th' scope='row'>
                <p>
                  {user.email}
                </p>
              </TableCell>
              <TableCell component='th' scope='row'>
                <p>
                  {preparePhoneByMask(user.phone)}
                </p>
              </TableCell>
              <TableCell component='th' scope='row'>
                <p>
                  {user.note}
                </p>
              </TableCell>
              <TableCell component='th' scope='row'>
                <IconButton
                  edge='start'
                  color='inherit'
                  onClick={() => {
                    setChangingUser({
                      ...user,
                      password: null,
                    });
                  }}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  edge='start'
                  color='inherit'
                  onClick={() => confirmActionUser('DELETE', user.id)}
                >
                  <DeleteOutline />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }, [filteredUsers, currentPage]);

  const confirmActionUser = (action: 'PUT' | 'DELETE', id?: number) => {
    const messageAction = action === 'PUT' ? 'изменить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} пользователя?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionUser(action,id)
      },
    });
  };

  const handleActionUser = (action: 'PUT' | 'DELETE', id?: number) => {
    const queryParam: string = `/${id ?? changingUser?.id}`;
    const preparedBody = {...changingUser};
    if (!preparedBody.password) {
      delete preparedBody.password;
    }
    setIsLoading(true);
    httpClient<IUser>({
      url: ROUTES_API.MANAGEMENT_USERS + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(preparedBody),
    })
      .then((response) => {
        switch (action) {
          case "PUT":
            setUsers(
              users.map((user) => {
                if (user.id === response.data?.id) {
                  return response.data;
                }
                return user;
              })
            );
            setChangingUser(null);
            break;
          case "DELETE":
            setUsers(users.filter(user => user.id !== id));
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && users.length === 0) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-users-container'>
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
        <div className='part-container' style={{flex: 4}}>
          <TextField
            disabled={!changingUser}
            className='text_fields_full'
            label='ФИО'
            variant='outlined'
            value={changingUser?.fio ?? ''}
            onChange={(event) => {
              if (changingUser) {
                setChangingUser({
                  ...changingUser,
                  fio: event.target.value,
                });
              }
            }}
          />
          <TextField
            disabled={!changingUser}
            className='text_fields_full'
            label='E-mail'
            variant='outlined'
            value={changingUser?.email ?? ''}
            onChange={(event) => {
              if (changingUser) {
                setChangingUser({
                  ...changingUser,
                  email: event.target.value,
                });
              }
            }}
          />
          <TextField
            disabled={!changingUser}
            className='text_fields_full'
            label='Телефон'
            variant='outlined'
            value={changingUser?.phone ?? ''}
            onChange={(event) => {
              if (changingUser) {
                setChangingUser({
                  ...changingUser,
                  phone: event.target.value,
                });
              }
            }}
          />
          <TextField
            disabled={!changingUser}
            className='text_fields_full'
            label='Заметка'
            variant='outlined'
            value={changingUser?.note ?? ''}
            onChange={(event) => {
              if (changingUser) {
                setChangingUser({
                  ...changingUser,
                  note: event.target.value,
                });
              }
            }}
          />
          <TextField
            disabled={!changingUser}
            className='text_fields_full'
            label='Пароль'
            variant='outlined'
            type='password'
            value={changingUser?.password ?? ''}
            onChange={(event) => {
              if (changingUser) {
                setChangingUser({
                  ...changingUser,
                  password: event.target.value,
                });
              }
            }}
          />
        </div>
        {changingUser && isLoading ?
            <div className='part-container part-container-center'>
              <Preloader size={30} />
            </div>
            :
            <div className='part-container part-container-center'>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading || !changingUser}
                onClick={() => confirmActionUser('PUT')}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading || !changingUser}
                onClick={() => {
                  setChangingUser(null);
                }}
              >
                <Clear/>
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
      <TableContainer component={Paper}>
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>ФИО</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Заметка</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          {tableBody}
        </Table>
      </TableContainer>
      <Pagination
        page={currentPage}
        count={countPages}
        onChange={handleChangePage}
        className='paginate-container'
      />
    </div>
  );
};

export default ManagementUsers;
