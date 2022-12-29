import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Preloader from "../../../common/Preloader/Preloader";
import {Pagination} from "@mui/material";
import Product from "../../../common/Product/Product";
import {MANAGEMENT_COUNT_PRODUCTS_ON_PAGE} from "../../../../config/config";
import {ICategory, IKeyNumberStoreObject, IProduct, IProductCategory, IShop, IShopProduct} from "../../../App/appTypes";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import {filterProducts} from "../../../../utils/utils";
import Filters, {IFiltersState} from "../../../common/Filters/Filters";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import ShopProductEdit from "../../ShopProductEdit/ShopProductEdit";

const ManagementShopProducts: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productCategories, setProductCategories] = useState<IKeyNumberStoreObject<IProductCategory[]>>({});
  const [shopProducts, setShopProducts] = useState<IKeyNumberStoreObject<IShopProduct[]>>({});
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [shops, setShops] = useState<IShop[]>([]);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [changingProduct, setChangingProduct] = useState<IProduct | null>(null);
  const [changingShopProducts, setChangingShopProducts] = useState<IShopProduct[] | null>(null);
  const [filtersState, setFiltersState] = useState<IFiltersState>({
    selectedName: '',
    selectedShopId: null,
    selectedCategoryIds: [],
    isReverseShopId: false,
    isAllOrNothing: false,
  });

  useEffect(() => {
    httpClient<IProduct[]>({
      url: ROUTES_API.MANAGEMENT_PRODUCTS,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then(async (responseProducts) => {
        setProducts(responseProducts.data);
        Promise.all<Promise<void>[]>([
          httpClient<IKeyNumberStoreObject<IProductCategory[]>>({
            url: ROUTES_API.MANAGEMENT_PRODUCTS_CATEGORIES+'?groupBy=products',
            method: 'GET',
            handleAddNotification: handleAddNotificationContext,
            handleChangeAuthStatus: handleChangeAuthStatusContext,
            isNeedAuth: true,
          })
            .then((response) => {
              setProducts(responseProducts.data.map((product) => {
                return {
                  ...product,
                  categories: response.data[product.id]
                    ?.map((productCategory) => productCategory.category_id)
                    ??
                    [],
                };
              }));
              setProductCategories(response.data);
            }),
          httpClient<IKeyNumberStoreObject<IShopProduct[]>>({
            url: ROUTES_API.MANAGEMENT_SHOPS_PRODUCTS+'?groupBy=products',
            method: 'GET',
            handleAddNotification: handleAddNotificationContext,
            handleChangeAuthStatus: handleChangeAuthStatusContext,
            isNeedAuth: true,
          })
            .then((response) => {
              setShopProducts(response.data);
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
            }),
          httpClient<IShop[]>({
            url: ROUTES_API.MANAGEMENT_SHOPS,
            method: 'GET',
            handleAddNotification: handleAddNotificationContext,
            handleChangeAuthStatus: handleChangeAuthStatusContext,
            isNeedAuth: true,
          })
            .then((response) => {
              setShops(response.data);
            })
        ])
          .finally(() => {
            setIsLoading(false);
          });
      });
  }, []);

  const filteredProducts = useMemo<IProduct[]>(() => {
    return filterProducts(
      shopProducts,
      products,
      filtersState
    );
  }, [
    shopProducts,
    products,
    filtersState
  ]);

  useEffect(() => {
    setCountPages(Math.ceil(filteredProducts.length / MANAGEMENT_COUNT_PRODUCTS_ON_PAGE));
    setCurrentPage(1);
  }, [filteredProducts]);

  const handleChangePage = (event: object, newPage: number) => {
    setCurrentPage(newPage);
  };

  const confirmActionShopProduct = (action: 'POST' | 'PUT' | 'DELETE', params: IShopProduct): Promise<void> => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    return new Promise((resolve, reject) => {
      setDialogContent({
        title: `Вы действительно хотите ${messageAction} продукт?`,
        confirmText: messageAction,
        callbackDecline: () => {
          reject();
        },
        handleConfirm: () => {
          setDialogContent(null);
          handleActionShopProduct(action, params)
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

  const handleActionShopProduct = (action: 'POST' | 'PUT' | 'DELETE', params: IShopProduct): Promise<void> => {
    const queryParam: string = action === 'POST' ? '' : `/${params?.id}`;
    setIsLoading(true);
    return httpClient<IShopProduct>({
      url: ROUTES_API.MANAGEMENT_SHOPS_PRODUCTS_WITH_ID
        .replace(':shopId', `${params.shop_id}`) + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(params),
    })
      .then((response) => {
        const nevValue = {...shopProducts};
        switch (action) {
          case "POST":
            nevValue[response.data.product_id] = [
              response.data,
              ...nevValue[response.data.product_id],
            ];
            break;
          case "PUT":
            const indexPut = nevValue[response.data.product_id]
              .findIndex((findItem) => findItem.id === response.data.id);
            if (indexPut > -1) {
              nevValue[response.data.product_id][indexPut] = response.data;
            }
            break;
          case "DELETE":
            nevValue[params.product_id] = nevValue[params.product_id]
              .filter((filterItem) => filterItem.id !== params.id);
            break;
        }
        setChangingShopProducts(nevValue[params.product_id]);
        setShopProducts(nevValue);
      })
      .finally(() => setIsLoading(false));
  }

  const modalContent = useMemo(() => {
    if (!changingProduct) {
      return null;
    }
    if (
      !shops.length ||
      !Object.keys(shopProducts).length
    ) {
      handleAddNotificationContext({
        type: 'error',
        message: 'Магазины или их товары ещё не загрузились, подождите!',
      });
      return null;
    }
    return (
      <ShopProductEdit
        product={changingProduct}
        shopProducts={changingShopProducts ?? []}
        shops={shops}
        handleAction={confirmActionShopProduct}
      />
    );
  }, [changingShopProducts, changingProduct]);

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
            if (dialogContent?.callbackDecline) {
              dialogContent.callbackDecline();
            }
            setDialogContent(null);
          }
        }}
      />
      <CustomModal
        onClose={() => {setChangingProduct(null)}}
        children={modalContent}
      />
      <Filters
        shops={shops}
        categories={categories}
        currentState={filtersState}
        handleOnChange={setFiltersState}
        disabled={{
          filterByCategories: (!categories.length && !Object.keys(productCategories).length) ? 'disabled' : undefined,
          allOrNothing: (!categories.length && !Object.keys(productCategories).length) ? 'disabled' : undefined,
          filterByShop: (!shops.length || !Object.keys(shopProducts).length) ? 'disabled' : undefined,
          reverseShopId: (!shops.length || !Object.keys(shopProducts).length) ? 'disabled' : undefined,
        }}
      />
      <Pagination
        page={currentPage}
        count={countPages}
        onChange={handleChangePage}
        className='paginate-container'
      />
      <div className='products-container'>
        {filteredProducts.map((product, index) => {
          const startValue = (currentPage-1) * MANAGEMENT_COUNT_PRODUCTS_ON_PAGE;
          const lastValue = (startValue + MANAGEMENT_COUNT_PRODUCTS_ON_PAGE);
          if (index < startValue || index > lastValue) {
            return null;
          }
          return (
            <Product
              key={`KEY_MANAGEMENT_SHOP_PRODUCTS_PRODUCT_${product.id}`}
              product={product}
              handleOnClick={() => {
                setChangingShopProducts(shopProducts[product.id]);
                setChangingProduct(product);
              }}
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

export default ManagementShopProducts;
