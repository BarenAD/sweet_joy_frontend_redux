import React, {FC, useState} from "react";
import {
  FormControl,
  IconButton, InputLabel, MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {AddCircleOutline, Clear, DeleteOutline, EditOutlined} from "@mui/icons-material";
import "./ShopProductEdit.scss";
import {IProduct, IShop, IShopProduct} from "../../../types";

type IShopProductEditProps = {
  product: IProduct;
  shopProducts: IShopProduct[];
  shops: IShop[];
  handleAction: (action: 'POST' | 'PUT' | 'DELETE', params: IShopProduct) => Promise<any>;
};

const ShopProductEdit: FC<IShopProductEditProps> = ({
  product,
  shopProducts,
  shops,
  handleAction,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newShopId, setNewShopId] = useState<number | null>(null);
  const [newCount, setNewCount] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [changingShopProductId, setChangingShopProductId] = useState<number | null>(null);
  const [changingShopId, setChangingShopId] = useState<number | null>(null);
  const [changingCount, setChangingCount] = useState<number | null>(null);
  const [changingPrice, setChangingPrice] = useState<number | null>(null);

  const clearChanging = () => {
    setChangingShopProductId(null);
    setChangingShopId(null);
    setChangingPrice(null);
    setChangingCount(null);
  };

  const clearNew = () => {
    setNewShopId(null);
    setNewPrice(null);
    setNewCount(null);
  };

  const preparedHandleAction = (
    action: 'POST' | 'PUT' | 'DELETE',
    inShopProduct?: IShopProduct
  ) => {
    setIsLoading(true);
    const params: IShopProduct = inShopProduct ?? (changingShopProductId ?
        {
          id: changingShopProductId,
          shop_id: changingShopId ?? 0,
          product_id: product.id,
          price: changingPrice,
          count: changingCount
        }
        :
        {
          id: 0,
          shop_id: newShopId ?? 0,
          product_id: product.id,
          price: newPrice,
          count: newCount
        }
    );
    handleAction(action, params)
      .then(() => {
        clearChanging();
        clearNew();
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  const getJSXSelectShop = (action: number, inValue: number | null, handleChange: (newValue: number | null) => void, currentShopId?: number) => {
    return (
      <FormControl variant="outlined" style={{width: '100%'}}>
        <InputLabel id={`ID_MANAGEMENT_SHOP_PRODUCTS_SELECT_LABEL_SHOP_${action}`}>Точка продажи</InputLabel>
        <Select
          variant='standard'
          labelId={`ID_MANAGEMENT_SHOP_PRODUCTS_SELECT_LABEL_SHOP_${action}`}
          id={`ID_MANAGEMENT_SHOP_PRODUCTS_SELECT_SHOP_${action}`}
          disabled={isLoading}
          value={inValue ? `${inValue}` : ''}
          onChange={(event: any) => {
            let value = event.target.value;
            if (typeof value === "number") {
              handleChange(value);
            } else {
              handleChange(null);
            }
          }}
        >
          {shops
            .filter((filterItem) => (
              filterItem.id == currentShopId ||
              !shopProducts
                .find((findItem) => (
                  findItem.shop_id === filterItem.id
                ))
            ))
            .map((shop) => (
            <MenuItem
              key={`KEY_MANAGEMENT_SHOP_PRODUCTS_SELECT_SHOP_${action}_ITEM_${shop.id}`}
              value={shop.id}
            >
              {shop.address}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  };

  return (
    <div className='shop-product-edit-modal'>

        <Table aria-label='customized table'>
          <TableHead>
            <TableRow>
              <TableCell>Точка продажи</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component='th' scope='row'>
                {getJSXSelectShop(
                  0,
                  newShopId,
                  setNewShopId
                )}
              </TableCell>
              <TableCell component='th' scope='row'>
                <TextField
                  label='Цена'
                  variant='outlined'
                  type='number'
                  value={''+newPrice}
                  disabled={isLoading}
                  onChange={(event) => {
                    if (event.target.value === '0' || event.target.value === '') {
                      setNewPrice(null);
                    } else if (/^[1-9][0-9]*$/.test(event.target.value)) {
                      setNewPrice(parseInt(event.target.value));
                    }
                  }}
                />
              </TableCell>
              <TableCell component='th' scope='row'>
                <TextField
                  label='Количество'
                  variant='outlined'
                  type='number'
                  value={''+newCount}
                  disabled={isLoading}
                  onChange={(event) => {
                    if (event.target.value === '0' || event.target.value === '') {
                      setNewCount(null);
                    } else if (/^[1-9][0-9]*$/.test(event.target.value)) {
                      setNewCount(parseInt(event.target.value));
                    }
                  }}
                />
              </TableCell>
              <TableCell component='th' scope='row'>
                <IconButton
                  edge='start'
                  color='inherit'
                  disabled={isLoading}
                  onClick={() => preparedHandleAction('POST')}
                >
                  <AddCircleOutline />
                </IconButton>
              </TableCell>
            </TableRow>
            {shopProducts.map((shopProduct) => (
              <TableRow key={shopProduct.id}>
                <TableCell component='th' scope='row'>
                  {changingShopProductId === shopProduct.id ?
                    getJSXSelectShop(
                      shopProduct.id,
                      changingShopId,
                      setChangingShopId,
                      shopProduct.shop_id
                    )
                    :
                    <p>
                      {shops.find((findItem) => findItem.id === shopProduct.shop_id)?.address ?? '???'}
                    </p>
                  }
                </TableCell>
                <TableCell component='th' scope='row'>
                  {changingShopProductId === shopProduct.id ?
                    <TextField
                      label='Цена'
                      variant='outlined'
                      type='number'
                      value={''+changingPrice}
                      disabled={isLoading}
                      onChange={(event) => {
                        if (event.target.value === '0' || event.target.value === '') {
                          setChangingPrice(null);
                        } else if (/^[1-9][0-9]*$/.test(event.target.value)) {
                          setChangingPrice(parseInt(event.target.value));
                        }
                      }}
                    />
                    :
                    <p>
                      {shopProduct.price}
                    </p>
                  }
                </TableCell>
                <TableCell component='th' scope='row'>
                  {changingShopProductId === shopProduct.id ?
                    <TextField
                      label='Количество'
                      variant='outlined'
                      type='number'
                      value={''+changingCount}
                      disabled={isLoading}
                      onChange={(event) => {
                        if (event.target.value === '0' || event.target.value === '') {
                          setChangingCount(null);
                        } else if (/^[1-9][0-9]*$/.test(event.target.value)) {
                          setChangingCount(parseInt(event.target.value));
                        }
                      }}
                    />
                    :
                    <p>
                      {shopProduct.count}
                    </p>
                  }
                </TableCell>
                <TableCell component='th' scope='row'>
                  <IconButton
                    edge='start'
                    color='inherit'
                    disabled={isLoading}
                    onClick={() => {
                      if (changingShopProductId) {
                        preparedHandleAction('PUT');
                      } else {
                        setChangingShopProductId(shopProduct.id);
                        setChangingShopId(shopProduct.shop_id);
                        setChangingPrice(shopProduct.price);
                        setChangingCount(shopProduct.count);
                      }
                    }}
                  >
                    <EditOutlined />
                  </IconButton>
                  {changingShopProductId === shopProduct.id ?
                    <IconButton
                      edge="start"
                      color="inherit"
                      disabled={isLoading}
                      onClick={() => {
                        clearChanging();
                      }}
                    >
                      <Clear/>
                    </IconButton>
                    :
                    <IconButton
                      edge="start"
                      color="inherit"
                      disabled={isLoading}
                      onClick={() => preparedHandleAction('DELETE', shopProduct)}
                    >
                      <DeleteOutline/>
                    </IconButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default ShopProductEdit;
