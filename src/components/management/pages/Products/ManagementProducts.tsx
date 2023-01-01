import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {ICategory, IProduct} from "../../../App/appTypes";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import Preloader from "../../../common/Preloader/Preloader";
import Product from "../../../common/Product/Product";
import "./ManagementProducts.scss";
import {Pagination} from "@mui/material";
import CustomModal from "../../../common/CustomModal/CustomModal";
import {MANAGEMENT_COUNT_PRODUCTS_ON_PAGE} from "../../../../config/config";
import ProductEdit from "../../ProductEdit/ProductEdit";
import Filters, {DEFAULT_VALUE_FILTERS, IFiltersState} from "../../../common/Filters/Filters";

const ManagementProducts: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [filtersState, setFiltersState] = useState<IFiltersState>(DEFAULT_VALUE_FILTERS);

  const filteredProducts = useMemo(() => {
    if (!filtersState.selectedName) {
      return products;
    }
    return products.filter((filterItem) => ~filterItem.name.toLowerCase().indexOf(filtersState.selectedName.toLowerCase()));
  }, [filtersState, products]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredProducts.length / MANAGEMENT_COUNT_PRODUCTS_ON_PAGE));
    setCurrentPage(1);
  }, [filteredProducts]);

  useEffect(() => {
    Promise.all<Promise<void>[]>([
      httpClient<IProduct[]>({
        url: ROUTES_API.MANAGEMENT_PRODUCTS,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
        .then((response) => {
          setProducts(response.data);
        }),
      httpClient<ICategory[]>({
        url: ROUTES_API.MANAGEMENT_CATEGORIES,
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
        .then((response) => {
          setCategories(response.data);
        })
    ])
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  const confirmActionProduct = (action: 'POST' | 'DELETE', params: FormData, id?: number): Promise<void> => {
    const messageAction = action === 'POST' && !id ? 'создать' : action === 'POST' && !!id ? 'изменить' : 'удалить';
    return new Promise((resolve, reject) => {
      setDialogContent({
        title: `Вы действительно хотите ${messageAction} продукт?`,
        confirmText: messageAction,
        callbackDecline: () => {
          reject();
        },
        handleConfirm: () => {
          setDialogContent(null);
          handleActionProduct(action, params, id)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        },
      });
    });
  };

  const handleActionProduct = (action: 'POST' | 'DELETE', params: FormData, id?: number): Promise<void | IProduct> => {
    const queryParam: string = !id ? '' : `/${id}`;
    setIsLoading(true);
    return httpClient<IProduct>({
      url: ROUTES_API.MANAGEMENT_PRODUCTS + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      bodyIsFormData: true,
      body: action === 'DELETE' ?
        undefined
        :
        params,
    })
      .then((response) => {
        switch (action) {
          case "POST":
            if (!id) {
              setProducts([
                response.data,
                ...products
              ]);
            } else {
              setProducts(
                products.map(mapSchedule => {
                  if (mapSchedule.id === response.data.id) {
                    return response.data;
                  }
                  return mapSchedule;
                })
              );
            }
            break;
          case "DELETE":
            setProducts(products.filter(filterProduct => filterProduct.id !== id));
            break;
        }
        setModalContent(null);
      })
      .finally(() => setIsLoading(false));
  }

  const handleOpenEdit = (product?: IProduct) => {
    setModalContent((
      <ProductEdit
        product={product}
        categories={categories}
        needGetFullData
        handleAction={confirmActionProduct}
      />
    ));
  };

  if (isLoading && products.length === 0) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='management-products-container'>
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
        children={(modalContent && isLoading) ?
          <div className='preloader-modal-container'>
            <Preloader size={40} />
          </div>
          :
          modalContent
        }
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
      {/*<div className='filter-container'>*/}
      {/*  {filterState !== appliedFilter &&*/}
      {/*    <div className='filter-preloader'>*/}
      {/*      <Preloader size={30} />*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*  <TextField*/}
      {/*    style={{width: '100%'}}*/}
      {/*    label="Поиск"*/}
      {/*    variant="outlined"*/}
      {/*    value={filterState}*/}
      {/*    disabled={isLoading}*/}
      {/*    onChange={(event) => {*/}
      {/*      setFilterState(event.target.value);*/}
      {/*      debounceAppliedFilter(event.target.value);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</div>*/}
      <Pagination
        page={currentPage}
        count={countPages}
        onChange={handleChangePage}
        className='paginate-container'
      />
      <div className='products-container'>
        <Product
          handleOnClick={() => {handleOpenEdit()}}
        />
        {filteredProducts.map((product, index) => {
          const startValue = (currentPage-1) * MANAGEMENT_COUNT_PRODUCTS_ON_PAGE;
          const lastValue = (startValue + MANAGEMENT_COUNT_PRODUCTS_ON_PAGE);
          if (index < startValue || index > lastValue) {
            return null;
          }
          return (
            <Product
              key={`KEY_MANAGEMENT_PRODUCTS_PRODUCT_${product.id}`}
              product={product}
              handleOnClick={() => {handleOpenEdit(product)}}
            />
          );
        })}
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

export default ManagementProducts;
