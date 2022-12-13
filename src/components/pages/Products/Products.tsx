import React, {FC, ReactElement, useEffect, useMemo, useState} from "react";
import "./Products.scss";
import {IProduct, IShopProduct} from "../../App/appTypes";
import {useAppSelector} from "../../../redux/hooks";
import {getProducts, getShopProducts} from "../../App/appSlice";
import { actionOnTheSite } from "../../../utils/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {COUNT_PRODUCTS_ON_PAGE} from "../../../config/config";
import {
  Modal,
  Pagination,
} from "@mui/material";
import ModalContent from "../../common/ModalContent/ModalContent";
import Product from "../../common/Product/Product";
import {filterShopProducts} from "../../../utils/utils";
import Filters from "../../common/Filters/Filters";
import ProductDetailsModal from "../../common/ProductDetailsModal/ProductDetailsModal";

const Products: FC = () => {
  const products = useAppSelector(getProducts);
  const shopProducts = useAppSelector(getShopProducts);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [filteringByShopId, setFilteringByShopId] = useState<number | null>(null);
  const [filteringByCategoriesIds, setFilteringByCategoriesIds] = useState<number[]>([]);
  const [isFilteringByAllOrNothing, setIsFilteringByAllOrNothing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countVisibleProducts, setCountVisibleProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(0);

  const filteredShopProducts = useMemo(() => {
    return filterShopProducts(
      shopProducts,
      products,
      {
        shopId: filteringByShopId,
        categoryIds: filteringByCategoriesIds,
        allOrNothing: isFilteringByAllOrNothing,
      }
    );
  }, [filteringByShopId, filteringByCategoriesIds, isFilteringByAllOrNothing]);

  useEffect(() => {
    const newCountVisibleProducts = Object.keys(filteredShopProducts).length;
    setCountVisibleProducts(newCountVisibleProducts);
    setCountPages(Math.ceil(newCountVisibleProducts / COUNT_PRODUCTS_ON_PAGE));
  }, [filteredShopProducts]);

  const handleOpenDetails = (product: IProduct) => {
    actionOnTheSite({...METRIC_ACTIONS.PRODUCT_OPEN_DETAILS, payload: {product_id: product.id}});
    setModalContent(<ProductDetailsModal product={product} />);
  }

  const handleChangePage = (event: object, newPage: number) => {
    actionOnTheSite({...METRIC_ACTIONS.PRODUCT_CHANGE_PAGE, payload: {new_page: newPage}})
    setCurrentPage(newPage);
  };

  const renderProductsByPagination = () => {
    const startValue = (currentPage-1) * COUNT_PRODUCTS_ON_PAGE;
    const expectedLastIndex = (startValue + COUNT_PRODUCTS_ON_PAGE);
    const lastValue = expectedLastIndex < countVisibleProducts ? expectedLastIndex : countVisibleProducts;

    return Object.entries<IShopProduct[]>(filteredShopProducts)
      .map(([productId, productShops], index) => {
        if (index < startValue || index > lastValue) {
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
  }

  return (
    <div className="products-container">
      <Modal
        open={!!modalContent}
        onClose={() => {
          setModalContent(null)
        }}
      >
        <ModalContent
          handleClose={() => {
            setModalContent(null)
          }}
        >
          {modalContent}
        </ModalContent>
      </Modal>
      <Filters
        selectedShopId={filteringByShopId}
        isAllOrNothing={isFilteringByAllOrNothing}
        selectedCategoryIds={filteringByCategoriesIds}
        handleChangeSelectedShopId={setFilteringByShopId}
        handleChangeIsAllOrNothing={setIsFilteringByAllOrNothing}
        handleChangeSelectedCategoryIds={setFilteringByCategoriesIds}
      />
      <div className="content">
        <Pagination
          page={currentPage}
          count={countPages}
          onChange={handleChangePage}
        />
        <div className="product-cards">
          {renderProductsByPagination()}
        </div>
        <Pagination
          page={currentPage}
          count={countPages}
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default Products;
