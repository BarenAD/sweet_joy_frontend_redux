import React, {FC, useState} from "react";
import {ICategory, IProduct, ISchedule} from "../../App/appTypes";
import {Autocomplete, Button, IconButton, TextField, Typography} from "@mui/material";
import "./ProductEdit.scss";
import Preloader from "../../common/Preloader/Preloader";
import {AddCircleOutline, DeleteOutline, EditOutlined} from "@mui/icons-material";
import {IParseToFormDataProps, parseToFormData} from "../../../utils/utils";

type IProductEditProps = {
  product?: IProduct;
  categories: ICategory[];
  handleAction: (action: 'POST' | 'DELETE', params: FormData, id?: number) => Promise<any>;
};

const ProductEdit: FC<IProductEditProps> = ({
  product,
  categories,
  handleAction,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewImageSrc, setPreviewImageSrc] = useState<string>(product?.image ?? '#');
  const buttonBrowseImage = React.useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>(product?.name ?? '');
  const [composition, setComposition] = useState<string>(product?.composition ?? '');
  const [manufacturer, setManufacturer] = useState<string>(product?.manufacturer ?? '');
  const [description, setDescription] = useState<string>(product?.description ?? '');
  const [productUnit, setProductUnit] = useState<string>(product?.product_unit ?? '');
  const [categoriesIds, setCategoriesIds] = useState<number[]>(product?.categories ?? []);

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
    setIsLoading(true);
    handleAction(
      action,
      parseToFormData(actionProps),
      product?.id
    )
      .finally(() => {
        setIsLoading(false)
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
      {isLoading ?
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
                disabled={isLoading}
                onClick={() => preparedHandleAction('POST')}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading}
                onClick={() => preparedHandleAction('DELETE')}
              >
                <DeleteOutline />
              </IconButton>
            </div>
            :
            <IconButton
              edge="start"
              color="inherit"
              disabled={isLoading}
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
