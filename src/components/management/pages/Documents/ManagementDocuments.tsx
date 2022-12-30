import React, {FC, useContext, useEffect, useMemo, useState} from "react";
import {
  Button,
  IconButton, Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {AddCircleOutline, Clear, DeleteOutline, EditOutlined, InsertDriveFileOutlined} from "@mui/icons-material";
import Filters, {DEFAULT_VALUE_FILTERS, IFiltersState} from "../../../common/Filters/Filters";
import {IDocument} from "../../../App/appTypes";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import Preloader from "../../../common/Preloader/Preloader";
import "./ManagementDocuments.scss";
import {MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE} from "../../../../config/config";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import {IParseToFormDataProps, parseToFormData} from "../../../../utils/utils";

const ManagementDocuments: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [filtersState, setFiltersState] = useState<IFiltersState>(DEFAULT_VALUE_FILTERS);
  const [previewDocumentSrc, setPreviewDocumentSrc] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<any>(null);
  const [newName, setNewName] = useState<string>('');
  const buttonBrowseDocument = React.useRef<HTMLInputElement>(null);
  const [currentChangingDocumentId, setCurrentChangingDocumentId] = useState<number | null>(null);
  const [changingName, setChangingName] = useState<string>('');
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);

  const filteredDocuments = useMemo(() => {
    if (!filtersState.selectedName) {
      return documents;
    }
    return documents.filter((filterItem) => ~filterItem.name.toLowerCase().indexOf(filtersState.selectedName.toLowerCase()));
  }, [documents, filtersState, currentPage]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredDocuments.length / MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE));
    setCurrentPage(1);
  }, [filteredDocuments]);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    httpClient<IDocument[]>({
      url: ROUTES_API.MANAGEMENT_DOCUMENTS,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setDocuments(response.data))
      .finally(() => setIsLoading(false));
  }, [])

  const tableBody = useMemo(() => {
    return (
      <TableBody>
        {filteredDocuments.map((document, index) => {
          const startValue = (currentPage-1) * MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE;
          const lastValue = (startValue + MANAGEMENT_COUNT_DOCUMENTS_ON_PAGE);

          if (index < startValue || index > lastValue) {
            return null;
          }

          return (
            <TableRow key={`KEY_MANAGEMENT_DOCUMENTS_DOCUMENT_${document.id}`}>
              <TableCell component='th' scope='row'>
                <a href={document.url} target='_blank'>
                  <IconButton
                    edge='start'
                    color='inherit'
                  >
                    <InsertDriveFileOutlined />
                  </IconButton>
                </a>
              </TableCell>
              <TableCell component='th' scope='row'>
                <p>
                  {document.name}
                </p>
              </TableCell>
              <TableCell component='th' scope='row'>
                <IconButton
                  edge='start'
                  color='inherit'
                  onClick={() => {
                      setChangingName(document.name);
                      setCurrentChangingDocumentId(document.id);
                  }}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  edge='start'
                  color='inherit'
                  onClick={() => confirmActionDocument('DELETE', document.id)}
                >
                  <DeleteOutline />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }, [filteredDocuments, currentPage]);

  const confirmActionDocument = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} документ?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionDocument(action,id)
      },
    });
  };

  const handleActionDocument = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const queryParam: string = action === 'POST' ? '' : `/${id ?? currentChangingDocumentId}`;
    let body;
    if (action === 'POST') {
      const actionProps: IParseToFormDataProps = {
        name: {
          type: 'string',
          value: newName,
        },
      };
      if (newDocument) {
        actionProps['document'] = {
          type: 'base',
          value: newDocument,
        };
      }
      body = parseToFormData(actionProps)
    } else if (action === 'PUT') {
      body = JSON.stringify({name: changingName});
    }
    setIsLoading(true);
    httpClient<IDocument>({
      url: ROUTES_API.MANAGEMENT_DOCUMENTS + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      bodyIsFormData: action === 'POST',
      body: action === 'DELETE' ?
        undefined
        :
        body,
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setDocuments([
              response.data,
              ...documents
            ]);
            setNewName('');
            setNewDocument(null);
            break;
          case "PUT":
            setDocuments(
              documents.map((document) => {
                if (document.id === response.data?.id) {
                  return response.data;
                }
                return document;
              })
            );
            setChangingName('');
            setCurrentChangingDocumentId(null);
            break;
          case "DELETE":
            setDocuments(documents.filter(document => document.id !== id));
            setChangingName('');
            setCurrentChangingDocumentId(null);
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && documents.length === 0) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-documents-container'>
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
        <div className='part-container'>
          {!currentChangingDocumentId &&
            <div className='part-container part-container-center'>
              <input
                ref={buttonBrowseDocument}
                style={{opacity: 0, display: 'hidden', width: 0, height: 0, overflow: 'hidden'}}
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  if (event.target.files) {
                    setNewDocument(event.target.files[0]);
                    setPreviewDocumentSrc(URL.createObjectURL(event.target.files[0]));
                  }
                }}
              />
              {(newDocument && previewDocumentSrc) &&
                <a href={previewDocumentSrc} target='_blank'>
                  <IconButton
                    edge='start'
                    color='inherit'
                  >
                    <InsertDriveFileOutlined />
                  </IconButton>
                </a>
              }
              <Button
                style={{margin: '0 0 0 20px'}}
                variant='contained'
                size='small'
                onClick={() => {
                  if (buttonBrowseDocument.current) {
                    buttonBrowseDocument.current.click()
                  }
                }}
              >
                  ВЫБРАТЬ ДОКУМЕНТ
              </Button>
            </div>
          }
        </div>
        <div className='part-container' style={{flex: 2}}>
          <TextField
            className='text_fields_full'
            label='название документа'
            variant='outlined'
            value={currentChangingDocumentId ? changingName : newName}
            onChange={(event) => {
              currentChangingDocumentId ?
                setChangingName(event.target.value)
                :
                setNewName(event.target.value);
            }}
          />
        </div>
        {isLoading && (currentChangingDocumentId || newName) ?
          <div className='part-container part-container-center'>
            <Preloader size={30} />
          </div>
          :
          currentChangingDocumentId ?
            <div className='part-container part-container-center'>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => confirmActionDocument('PUT')}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => {
                  setChangingName('');
                  setCurrentChangingDocumentId(null);
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
                onClick={() => confirmActionDocument('POST')}
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
      <TableContainer component={Paper}>
        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>Документ</TableCell>
              <TableCell>Название</TableCell>
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

export default ManagementDocuments;
