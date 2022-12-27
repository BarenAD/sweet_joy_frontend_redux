import React, {FC, ReactElement, useContext, useEffect, useMemo, useState} from "react";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Preloader from "../../../common/Preloader/Preloader";
import {Pagination, TextField} from "@mui/material";
import Product from "../../../common/Product/Product";
import {MANAGEMENT_COUNT_PRODUCTS_ON_PAGE} from "../../../../config/config";
import {ICategory, IKeyNumberStoreObject, IProduct, IShop, IShopProduct} from "../../../App/appTypes";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import ProductEdit from "../../ProductEdit/ProductEdit";
import {filterProducts} from "../../../../utils/utils";
import Filters, {IFiltersState} from "../../../common/Filters/Filters";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {IShopEdit} from "../../ShopEdit/ShopEdit";

const ManagementShopProducts: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [shopProducts, setShopProducts] = useState<IKeyNumberStoreObject<IShopProduct[]>>({});
  const [shops, setShops] = useState<IShop[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState<number>(0);
  const [filtersState, setFiltersState] = useState<IFiltersState>({
    selectedName: '',
    selectedShopId: null,
    selectedCategoryIds: [],
    isReverseShopId: false,
    isAllOrNothing: false,
  });

  useEffect(() => {
    Promise.all<Promise<void>[]>([
      httpClient<IProduct[]>({
        url: ROUTES_API.MANAGEMENT_PRODUCTS+'?withCategories=true',
        method: 'GET',
        handleAddNotification: handleAddNotificationContext,
        handleChangeAuthStatus: handleChangeAuthStatusContext,
        isNeedAuth: true,
      })
        .then((response) => {
          setProducts(response.data);
        }),
      // httpClient<IKeyNumberStoreObject<IShopProduct[]>>({
      //   url: ROUTES_API.MANAGEMENT_SHOPS,
      //   method: 'GET',
      //   handleAddNotification: handleAddNotificationContext,
      //   handleChangeAuthStatus: handleChangeAuthStatusContext,
      //   isNeedAuth: true,
      // })
      //   .then((response) => {
      //     setShopProducts(response.data);
      //   }),
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

  const handleOpenEdit = (product?: IProduct) => {
    setModalContent(null);
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
        shops={shops}
        categories={categories}
        currentState={filtersState}
        handleOnChange={setFiltersState}
        disabled={{
          filterByCategories: !categories.length,
          allOrNothing: !categories.length,
          filterByShop: !shops.length || !Object.keys(shopProducts).length,
          reverseShopId: !shops.length || !Object.keys(shopProducts).length,
        }}
      />
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
              key={`KEY_MANAGEMENT_SHOP_PRODUCTS_PRODUCT_${product.id}`}
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

export default ManagementShopProducts;
