import React, {FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState} from "react";
import "./Products.scss";
import {IKeyNumberStoreObject, IProduct, IShopProduct} from "../../../App/appTypes";
import {useAppSelector} from "../../../../redux/hooks";
import {getProducts, getShopProducts} from "../../../App/appSlice";
import { actionOnTheSite } from "../../../../redux/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../../config/metricActions";
import {COUNT_PRODUCTS_ROWS, PRODUCT_CARD_WIDTH} from "../../../../config/config";
import {
  debounce,
  Pagination,
} from "@mui/material";
import CustomModal from "../../../common/ModalContent/CustomModal";
import Product from "../../../common/Product/Product";
import {filterShopProducts} from "../../../../utils/utils";
import Filters from "../../../common/Filters/Filters";
import ProductDetailsModal from "../../../common/ProductDetailsModal/ProductDetailsModal";
import Demo from "../../../common/Demo/Demo";
import {SITE_CONFIG_IDENTIFIERS} from "../../../../config/siteConfigIdentifiers";
import {getConfigurations} from "../../../../redux/configurations/configurationsSlice";
import ConfigManager from "../../../common/ConfigManager/ConfigManager";

const Products: FC = () => {
  const products = useAppSelector(getProducts);
  const shopProducts = useAppSelector(getShopProducts);
  const configurations = useAppSelector(getConfigurations);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [filteringByShopId, setFilteringByShopId] = useState<number | null>(null);
  const [filteringByCategoriesIds, setFilteringByCategoriesIds] = useState<number[]>([]);
  const [isFilteringByAllOrNothing, setIsFilteringByAllOrNothing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsContainer = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const debounceOnChangeWindow = useCallback<() => void>(
    debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 2000),
    []);

  useEffect(() => {
    window.onresize = debounceOnChangeWindow;
    setWindowWidth(window.innerWidth);
  }, []);

  const countCardsPerPage = useMemo<number>(() => {
    if (!productsContainer.current) {
      return 0;
    }
    const widthContainer = productsContainer.current.getBoundingClientRect();
    return Math.floor(widthContainer.width / PRODUCT_CARD_WIDTH) * COUNT_PRODUCTS_ROWS;
  }, [productsContainer.current, windowWidth]);

  const filteredShopProducts = useMemo<IKeyNumberStoreObject<IShopProduct[]>>(() => {
    return filterShopProducts(
      shopProducts,
      products,
      {
        shopId: filteringByShopId,
        categoryIds: filteringByCategoriesIds,
        allOrNothing: isFilteringByAllOrNothing,
      }
    );
  }, [
    shopProducts,
    products,
    filteringByShopId,
    filteringByCategoriesIds,
    isFilteringByAllOrNothing
  ]);

  const renderedProductsByPagination = useMemo(() => {
    if (!countCardsPerPage) {
      return null;
    }
    const startValue = (currentPage-1) * (countCardsPerPage);
    const lastValue = (startValue + (countCardsPerPage));

    return Object.entries<IShopProduct[]>(filteredShopProducts)
      .map(([productId, productShops], index) => {
        if (index < startValue || index >= lastValue) {
          return null;
        }
        const intProductId = parseInt(productId);
        const product = products.find(findProduct => findProduct.id === intProductId);
        if (!product) {
          return null;
        }
        return (
          <Product
            key={`KEY_CARD_PRODUCT_${product.id}`}
            product={product}
            handleOpenDetails={() => {handleOpenDetails(product)}}
          />
        );
      });
  }, [filteredShopProducts, countCardsPerPage, currentPage]);

  const countPages = useMemo<number>(() => {
    return Math.ceil(Object.keys(filteredShopProducts).length / countCardsPerPage);
  }, [countCardsPerPage, filteredShopProducts]);

  const handleOpenDetails = (product: IProduct) => {
    actionOnTheSite({...METRIC_ACTIONS.PRODUCT_OPEN_DETAILS, payload: {product_id: product.id}});
    setModalContent(<ProductDetailsModal product={product} />);
  }

  const handleChangePage = (event: object, newPage: number) => {
    actionOnTheSite({...METRIC_ACTIONS.PRODUCT_CHANGE_PAGE, payload: {new_page: newPage}})
    setCurrentPage(newPage);
  };

  return (
    <div className="products-container">
      <CustomModal
        onClose={() => {
          setModalContent(null)
        }}
        children={modalContent}
      />
      <div>
        <Filters
          selectedShopId={filteringByShopId}
          isAllOrNothing={isFilteringByAllOrNothing}
          selectedCategoryIds={filteringByCategoriesIds}
          handleChangeSelectedShopId={setFilteringByShopId}
          handleChangeIsAllOrNothing={setIsFilteringByAllOrNothing}
          handleChangeSelectedCategoryIds={setFilteringByCategoriesIds}
        />
        {!!configurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value &&
          <ConfigManager/>
        }
        {!!configurations[SITE_CONFIG_IDENTIFIERS.DEMO_MODE]?.value &&
          <Demo/>
        }
      </div>
      <div className="content">
        <Pagination
          page={currentPage}
          count={countPages}
          onChange={handleChangePage}
          className='paginate-container'
        />
        <div ref={productsContainer} className="product-cards">
          {renderedProductsByPagination}
        </div>
        <Pagination
          page={currentPage}
          count={countPages}
          onChange={handleChangePage}
          className='paginate-container'
        />
      </div>
    </div>
  );
};

export default Products;
