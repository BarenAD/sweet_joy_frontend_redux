import React, {FC, useContext, useEffect, useState} from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField, Typography
} from "@mui/material";
import {Clear, EditOutlined} from "@mui/icons-material";
import {IConfiguration} from "../../../../redux/slices/configurationsSlice";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../../redux/slices/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/slices/authSlice";
import Preloader from "../../../common/Preloader/Preloader";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import "./ManagementConfigurations.scss";

const ManagementConfigurations: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [configurations, setConfigurations] = useState<IConfiguration[]>([]);
  const [changingConfiguration, setChangingConfiguration] = useState<IConfiguration | null>(null);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  useEffect(() => {
    httpClient<IConfiguration[]>({
      url: ROUTES_API.MANAGEMENT_CONFIGURATIONS,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setConfigurations(response.data))
      .finally(() => setIsLoading(false));
  }, [])

  const confirmChangeConfiguration = () => {
    setDialogContent({
      title: `Вы действительно хотите изменить конфигурацию?`,
      confirmText: 'изменить',
      handleConfirm: () => {
        setDialogContent(null);
        handleChangeConfiguration();
      },
    });
  };

  const handleChangeConfiguration = () => {
    if (!changingConfiguration) {
      return;
    }
    setIsLoading(true);
    httpClient<IConfiguration>({
      url: ROUTES_API.MANAGEMENT_CONFIGURATIONS+`/${changingConfiguration.id}`,
      method: 'PUT',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: JSON.stringify(changingConfiguration),
    })
      .then((response) => {
        setConfigurations(
          configurations.map(configuration => {
            if (configuration.id === response.data.id) {
              return response.data;
            }
            return configuration;
          })
        );
        setChangingConfiguration(null);
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && !changingConfiguration) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-configurations-container'>
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
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Значение</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configurations.map(configuration => (
              <TableRow key={configuration.id}>
                <TableCell component="th" scope="row">
                  <Typography>
                    {configuration.name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  {changingConfiguration && changingConfiguration.id === configuration.id ?
                    <TextField
                      style={{width: '100%'}}
                      label="новое значение"
                      variant="outlined"
                      value={changingConfiguration.value}
                      onChange={(event) => {changingConfiguration.value = event.target.value; setChangingConfiguration({...changingConfiguration});}}
                    />
                    :
                    <Typography dangerouslySetInnerHTML={{__html: configuration.value || ''}}/>
                  }
                </TableCell>
                {isLoading && changingConfiguration?.id === configuration.id ?
                  <TableCell component="th" scope="row">
                    <Preloader size={30} />
                  </TableCell>
                  :
                  <TableCell component="th" scope="row">
                    <IconButton
                      edge="start"
                      color="inherit"
                      style={{marginRight: '10px'}}
                      onClick={() => {
                        if (changingConfiguration?.id === configuration.id) {
                          confirmChangeConfiguration();
                        } else {
                          setChangingConfiguration(configuration);
                        }
                      }}
                    >
                      <EditOutlined/>
                    </IconButton>
                    {changingConfiguration && changingConfiguration.id === configuration.id &&
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                          setChangingConfiguration(null);
                        }}
                      >
                        <Clear/>
                      </IconButton>
                    }
                  </TableCell>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManagementConfigurations;
