import React, {FC, useContext, useEffect, useMemo, useState} from "react";
import {
  debounce,
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
import {AddCircleOutline, Clear, DeleteOutline, EditOutlined} from "@mui/icons-material";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import Preloader from "../../../common/Preloader/Preloader";
import {ICategory} from "../../../App/appTypes";
import "./ManagementCategories.scss";

const ManagementCategories: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<string>('');
  const [appliedFilter, setAppliedFilter] = useState<string>('');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICategory>({id: 0, name: ''});
  const [changingCategory, setChangingCategory] = useState<ICategory | null>(null);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const debounceAppliedFilter = useMemo(() => {
    return debounce((newValue: string) => {
      setAppliedFilter(newValue);
    }, 2000);
  }, []);
  const renderedCategories = useMemo(() => {
    return (
      <TableBody>
        {categories
          .filter((category) => ~category.name.toLowerCase().indexOf(appliedFilter.toLowerCase()))
          .map((category: ICategory) => (
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
                    handleActionCategory('DELETE', category.id);
                  }}
                >
                  <DeleteOutline/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    );
  }, [appliedFilter, categories]);

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

  const handleActionCategory = (action: 'POST' | 'PUT' | 'DELETE', id?: number) => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    if (!window.confirm(`Вы действительно хотите ${messageAction} категорию?`)) {
      return;
    }
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
      <div className='edit-container'>
        <div className='part-container'>
          {filterState !== appliedFilter &&
            <div className='filter-preloader'>
              <Preloader size={30} />
            </div>
          }
          <TextField
            style={{width: '100%'}}
            label="Поиск"
            variant="outlined"
            value={filterState}
            onChange={(event) => {
              setFilterState(event.target.value);
              debounceAppliedFilter(event.target.value);
            }}
          />
        </div>
        <div className='part-container'>
          <TextField
            style={{width: '100%'}}
            label="название категории"
            variant="outlined"
            value={changingCategory?.name ?? newCategory.name}
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
                onClick={() => {handleActionCategory('PUT');}}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                style={{marginRight: '10px'}}
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
                onClick={() => handleActionCategory('POST')}
              >
                <AddCircleOutline />
              </IconButton>
            </div>
        }
      </div>
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
  );
};

export default ManagementCategories;
