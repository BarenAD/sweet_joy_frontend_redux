import React, {FC, useContext, useEffect, useState} from "react";
import {ICategory, IProduct} from "../../../types";
import {Autocomplete, Button, IconButton, TextField, Typography} from "@mui/material";
import "./ProductEdit.scss";
import Preloader from "../../common/Preloader/Preloader";
import {AddCircleOutline, DeleteOutline, EditOutlined} from "@mui/icons-material";
import {IParseToFormDataProps, parseToFormData} from "../../../utils/utils";
import {httpClient} from "../../../utils/httpClient";
import {ROUTES_API} from "../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../redux/slices/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../redux/slices/authSlice";

type IProductEditProps = {
  product?: IProduct;
  categories: ICategory[];
  needGetFullData?: boolean;
  handleAction: (action: 'POST' | 'DELETE', params: FormData, id?: number) => Promise<any>;
};

const ProductEdit: FC<IProductEditProps> = ({
  product,
  categories,
  handleAction,
  needGetFullData = false,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fullDataLoading, setFullDataLoading] = useState<boolean>(!!product && needGetFullData);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>(product?.image ?? '#');
  const buttonBrowseImage = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>(product?.name ?? '');
  const [composition, setComposition] = useState<string>(product?.composition ?? '');
  const [manufacturer, setManufacturer] = useState<string>(product?.manufacturer ?? '');
  const [description, setDescription] = useState<string>(product?.description ?? '');
  const [productUnit, setProductUnit] = useState<string>(product?.product_unit ?? '');
  const [categoriesIds, setCategoriesIds] = useState<number[]>(product?.categories ?? []);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);

  useEffect(() => {
    if (!fullDataLoading || !product) {
      return;
    }
    httpClient<IProduct>({
      url: ROUTES_API.MANAGEMENT_PRODUCTS+`/${product.id}?withCategories=true`,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => {
        setCategoriesIds(response.data.categories);
      })
      .finally(() => {
        setFullDataLoading(false);
      });
  }, []);

  const preparedHandleAction = (action: 'POST' | 'DELETE') => {
    const actionProps: IParseToFormDataProps = {
      name: {
        type: 'string',
        value: name,
      },
      composition: {
        type: 'string',
        value: composition,
      },
      manufacturer: {
        type: 'string',
        value: manufacturer,
      },
      description: {
        type: 'string',
          value: description,
      },
      product_unit: {
        type: 'string',
        value: productUnit,
      },
      categories: {
        type: 'json',
        value: categoriesIds,
      },
    };
    if (image) {
      actionProps['image'] = {
        type: 'base',
        value: image,
      };
    }
    setIsUploading(true);
    handleAction(
      action,
      parseToFormData(actionProps),
      product?.id
    )
      .finally(() => {
        setIsUploading(false)
      });
  };

  return (
    <div className='product-edit-modal'>
      <Typography
        variant='h6'
        align='center'
      >
        {product ? 'Редактирование продукта' : 'Создание продукта'}
      </Typography>
      <img
        className='preview-image'
        src={previewImageSrc}
        alt=''
      />
      <input
        ref={buttonBrowseImage}
        style={{opacity: 0, display: 'hidden', width: 0, height: 0, overflow: 'hidden'}}
        type='file'
        accept='image/png, image/jpeg'
        onChange={(event) => {
          if (event.target.files) {
            setImage(event.target.files[0]);
            setPreviewImageSrc(URL.createObjectURL(event.target.files[0]));
          }
        }}
      />
      <div>
        <Button
          style={{margin: '20px 0'}}
          variant='contained'
          onClick={() => {
            if (buttonBrowseImage.current) {
              buttonBrowseImage.current.click()
            }
          }}
        >
          ВЫБРАТЬ ИЗОБРАЖЕНИЕ
        </Button>
      </div>
      <TextField
        label='Название'
        variant='outlined'
        value={name}
        className='field'
        onChange={(event) => {setName(event.target.value)}}
      />
      <TextField
        label='Состав'
        variant='outlined'
        value={composition}
        className='field'
        onChange={(event) => {setComposition(event.target.value)}}
      />
      <TextField
        label='Производитель'
        variant='outlined'
        value={manufacturer}
        className='field'
        onChange={(event) => {setManufacturer(event.target.value)}}
      />
      <TextField
        label='Описание'
        variant='outlined'
        value={description}
        className='field'
        onChange={(event) => {setDescription(event.target.value)}}
      />
      <TextField
        label='Измерение'
        variant='outlined'
        value={productUnit}
        className='field'
        onChange={(event) => {setProductUnit(event.target.value)}}
      />
      {fullDataLoading ?
        <div className='preloader-container'>
          <Preloader size={30} />
        </div>
        :
        <Autocomplete
          className='field'
          options={categories
            .filter(value => !categoriesIds.includes(value.id))
            .map(category => {
              return {...category, label: category.name}
            })
          }
          renderInput={(params) => <TextField {...params} label='Выбрать категории' />}
          onChange={(event, newValue) => {
            setCategoriesIds(newValue.map(value => value.id));
          }}
          value={categoriesIds.reduce<any>((result, current) => {
            const foundCategory = categories.find(findItem => findItem.id === current);
            if (foundCategory) {
              result.push({...foundCategory, label: foundCategory.name});
            }
            return result;
          }, [])}
          multiple
        />
      }
      {isUploading ?
        <div className='buttons-container'>
          <Preloader size={25} />
        </div>
        :
        <div className='buttons-container'>
          {product ?
            <div className='inner-container'>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isUploading || fullDataLoading}
                onClick={() => preparedHandleAction('POST')}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isUploading || fullDataLoading}
                onClick={() => preparedHandleAction('DELETE')}
              >
                <DeleteOutline />
              </IconButton>
            </div>
            :
            <IconButton
              edge="start"
              color="inherit"
              disabled={isUploading || fullDataLoading}
              onClick={() => preparedHandleAction('POST')}
            >
              <AddCircleOutline />
            </IconButton>
          }
        </div>
      }
    </div>
  );
};

export default ProductEdit;
