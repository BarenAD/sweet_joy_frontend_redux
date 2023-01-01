import React, {FC, useContext, useEffect, useMemo, useState} from "react";
import {
  IconButton, Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField, Typography
} from "@mui/material";
import {AddCircleOutline, Clear, DeleteOutline, EditOutlined} from "@mui/icons-material";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import Preloader from "../../../common/Preloader/Preloader";
import {ICategory} from "../../../App/appTypes";
import "./ManagementCategories.scss";
import {MANAGEMENT_COUNT_CATEGORIES_ON_PAGE} from "../../../../config/config";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import Filters, {DEFAULT_VALUE_FILTERS, IFiltersState} from "../../../common/Filters/Filters";

const ManagementCategories: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICategory>({id: 0, name: ''});
  const [changingCategory, setChangingCategory] = useState<ICategory | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [filtersState, setFiltersState] = useState<IFiltersState>(DEFAULT_VALUE_FILTERS);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  const filteredCategories = useMemo(() => {
    if (!filtersState.selectedName) {
      return categories;
    }
    return categories.filter((category) => ~category.name.toLowerCase().indexOf(filtersState.selectedName.toLowerCase()));
  }, [filtersState, categories]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredCategories.length / MANAGEMENT_COUNT_CATEGORIES_ON_PAGE));
    setCurrentPage(1);
  }, [filteredCategories]);

  const renderedCategories = useMemo(() => {
    const startValue = (currentPage-1) * MANAGEMENT_COUNT_CATEGORIES_ON_PAGE;
    const lastValue = (startValue + MANAGEMENT_COUNT_CATEGORIES_ON_PAGE);
    return (
      <TableBody>
        {filteredCategories
          .map((category: ICategory, index) => {
            if (index < startValue || index > lastValue) {
              return null;
            }
            return (
              <TableRow key={`KEY_MANAGEMENT_CATEGORIES_${category.id}`}>
                <TableCell component="th" scope="row">
                  <Typography>
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton
                    edge="start"
                    color="inherit"
                    style={{marginRight: '10px'}}
                    onClick={() => {setChangingCategory(category);}}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                      setChangingCategory(category);
                      confirmActionCategory('DELETE', category.id);
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
  }, [filteredCategories, currentPage]);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    httpClient<ICategory[]>({
      url: ROUTES_API.MANAGEMENT_CATEGORIES,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setCategories(response.data))
      .finally(() => setIsLoading(false));
  }, [])

  const confirmActionCategory = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    setDialogContent({
      title: `Вы действительно хотите ${messageAction} категорию?`,
      confirmText: messageAction,
      handleConfirm: () => {
        setDialogContent(null);
        handleActionCategory(action,id)
      },
    });
  };

  const handleActionCategory = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const queryParam: string = action === 'POST' ? '' : `/${id ?? changingCategory?.id}`;
    setIsLoading(true);
    httpClient<ICategory>({
      url: ROUTES_API.MANAGEMENT_CATEGORIES + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(action === 'POST' ?
          newCategory
          :
          changingCategory
        ),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setCategories([
              response.data,
              ...categories
            ]);
            setNewCategory({id: 0, name: ''});
            break;
          case "PUT":
            setCategories(
              categories.map(category => {
                if (category.id === response.data?.id) {
                  return response.data;
                }
                return category;
              })
            );
            setChangingCategory(null);
            break;
          case "DELETE":
            setCategories(categories.filter(category => category.id !== id));
            setChangingCategory(null);
            break;
        }
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && (!changingCategory && !newCategory.name)) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-categories-container'>
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
          <TextField
            style={{width: '100%'}}
            label="название категории"
            variant="outlined"
            value={changingCategory?.name ?? newCategory.name}
            disabled={isLoading}
            onChange={(event) => {
              changingCategory ?
                setChangingCategory({
                  ...changingCategory,
                  name: event.target.value,
                })
                :
                setNewCategory({
                  ...newCategory,
                  name: event.target.value,
                });
            }}
          />
        </div>
        {isLoading && (changingCategory || newCategory.name) ?
          <div className='part-container part-container-center'>
            <Preloader size={30} />
          </div>
          :
          changingCategory ?
            <div className='part-container part-container-center'>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => {confirmActionCategory('PUT');}}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
                disabled={isLoading}
                onClick={() => {
                  setChangingCategory(null);
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
                onClick={() => confirmActionCategory('POST')}
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
                <TableCell>Название категории</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            {renderedCategories}
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

export default ManagementCategories;
