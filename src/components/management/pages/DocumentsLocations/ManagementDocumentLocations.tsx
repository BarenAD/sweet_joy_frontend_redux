import React, {FC, useContext, useEffect, useState} from "react";
import {
  Autocomplete,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from "@mui/material";
import {Clear, EditOutlined} from "@mui/icons-material";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import {HandleAddNotificationContext} from "../../../../redux/slices/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/slices/authSlice";
import {IDocument, IDocumentLocation} from "../../../../types";
import {httpClient, IFetchWithTokenResponse} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import Preloader from "../../../common/Preloader/Preloader";
import "./ManagementDocumentLocations.scss";

const ManagementDocumentLocations: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [documentLocations, setDocumentLocations] = useState<IDocumentLocation[]>([]);
  const [changingDocumentLocation, setChangingDocumentLocation] = useState<IDocumentLocation | null>(null);
  const [changingDocument, setChangingDocument] = useState<any>(undefined);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  useEffect(() => {
    Promise.all<[Promise<IFetchWithTokenResponse<IDocumentLocation[]>>, Promise<IFetchWithTokenResponse<IDocument[]>>]>([
      httpClient<IDocumentLocation[]>({
        url: ROUTES_API.MANAGEMENT_DOCUMENTS_LOCATIONS,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      }),
      httpClient<IDocument[]>({
        url: ROUTES_API.MANAGEMENT_DOCUMENTS,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
    ])
      .then((value) => {
        const [responseDocumentLocations, responseDocuments] = value;
        setDocumentLocations(responseDocumentLocations.data);
        setDocuments(responseDocuments.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const confirmChangeDocumentLocation = () => {
    setDialogContent({
      title: `Вы действительно хотите изменить локацию документа?`,
      confirmText: 'изменить',
      handleConfirm: () => {
        setDialogContent(null);
        handleChangeDocumentLocation();
      },
    });
  };

  const handleChangeDocumentLocation = () => {
    if (!changingDocumentLocation) {
      return null;
    }
    setIsLoading(true);
    httpClient<IDocumentLocation>({
      url: ROUTES_API.MANAGEMENT_DOCUMENTS_LOCATIONS + `/${changingDocumentLocation.id}`,
      method: 'PUT',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: JSON.stringify({
        ...changingDocumentLocation,
        document_id: changingDocument?.id ?? null,
      }),
    })
      .then((response) => {
        setDocumentLocations(
          documentLocations.map((documentLocation) => {
            if (documentLocation.id === response.data?.id) {
              return response.data;
            }
            return documentLocation;
          })
        );
        setChangingDocumentLocation(null);
        setChangingDocument(undefined);
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && !changingDocumentLocation) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-documents-locations-container'>
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
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Документ</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentLocations.map((documentLocation) => (
              <TableRow key={`KEY_MANAGEMENT_DOCUMENTS_LOCATIONS_${documentLocation.id}`}>
                <TableCell component='th' scope='row'>
                  <p>
                    {documentLocation.name}
                  </p>
                </TableCell>
                <TableCell component='th' scope='row'>
                  {changingDocumentLocation?.id === documentLocation.id ?
                    <Autocomplete
                      disabled={isLoading}
                      style={{width: '100%'}}
                      options={documents.map(document => {
                          return {...document, label: document.name}
                        })
                      }
                      value={changingDocument}
                      renderInput={(params) => <TextField {...params} label="Выбрать документ"/>}
                      onChange={(event, newValue) => {
                        setChangingDocument(newValue);
                      }}
                    />
                    :
                    documentLocation.document_id &&
                      <p>
                        {documents.find((findItem) => findItem.id === documentLocation.document_id)?.name}
                      </p>
                  }
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    disabled={isLoading}
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      if (changingDocumentLocation) {
                        confirmChangeDocumentLocation();
                      } else {
                        const selectedDocument = documents.find((findItem) => findItem.id === documentLocation.document_id);
                        setChangingDocument(selectedDocument ? {...selectedDocument, label: selectedDocument.name} : undefined);
                        setChangingDocumentLocation(documentLocation);
                      }
                    }}
                  >
                    <EditOutlined />
                  </IconButton>
                  {changingDocumentLocation?.id === documentLocation.id &&
                    <IconButton
                      disabled={isLoading}
                      edge="start"
                      color="inherit"
                      onClick={() => {
                        setChangingDocumentLocation(null);
                      }}
                    >
                      <Clear/>
                    </IconButton>
                    }
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManagementDocumentLocations;
