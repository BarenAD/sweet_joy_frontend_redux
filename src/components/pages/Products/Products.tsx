import React, {FC, ReactElement, useEffect, useMemo, useState} from "react";
import "./Products.scss";
import {IProduct, IShopProduct} from "../../App/appTypes";
import {useAppSelector} from "../../../redux/hooks";
import {getCategories, getProducts, getShopProducts, getShops} from "../../App/appSlice";
import { actionOnTheSite } from "../../../utils/metrics/metricsSlice";
import {METRIC_ACTIONS} from "../../../config/metricActions";
import {COUNT_PRODUCTS_ON_PAGE} from "../../../config/config";
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Switch
} from "@mui/material";
import Card from "../../common/Card/Card";
import Modal from "../../common/Modal/Modal";
import Product from "../../common/Product/Product";
import {filterShopProducts} from "../../../utils/utils";

const Products: FC = () => {
  const products = useAppSelector(getProducts);
  const shopProducts = useAppSelector(getShopProducts);
  const categories = useAppSelector(getCategories);
  const shops = useAppSelector(getShops);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [filteringByShopId, setFilteringByShopId] = useState<number | undefined>(undefined);
  const [filteringByCategoriesIds, setFilteringByCategoriesIds] = useState<number[] | undefined>(undefined);
  const [isFilteringByAllOrNothing, setIsFilteringByAllOrNothing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countVisibleProducts, setCountVisibleProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(0);
  const [isOpenMenuCategories, setIsOpenMenuCategories] = useState<boolean>(false);

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
    setModalContent(null);
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
    <div className="container_main_products">
      <Modal
        isShow={!!modalContent}
        allowClose
        handleClose={() => {
          setModalContent(null)
        }}
      >
        {modalContent}
      </Modal>
      <Card className="container_options_sampling">
        <h4>Фильтры</h4>
        <FormControl style={{width: "90%"}}>
          <InputLabel id={`ID_SELECT_LABEL_PRODUCTS_POS`}>Точка продажи</InputLabel>
          <Select
            labelId={`ID_SELECT_LABEL_PRODUCTS_POS`}
            id={`ID_SELECT_SELECT_PRODUCTS_POS`}
            value={filteringByShopId ? `${filteringByShopId}` : undefined}
            onChange={(event) => {
              actionOnTheSite({...METRIC_ACTIONS.PRODUCT_FILTER_SELECT_SHOP, payload: {shop_id: event.target.value}});
              const value = event.target.value;
              if (typeof value === 'number') {
                setFilteringByShopId(value);
              } else {
                setFilteringByShopId( undefined);
              }
            }}
          >
            <MenuItem value="">сбросить выделение</MenuItem>
            {shops.map(shop => (
              <MenuItem
                key={`KEY_SELECT_PRODUCTS_POS_ITEM_${shop.id}`}
                value={shop.id}
              >
                {shop.address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{width: '100%', marginTop: '10px'}}>
          <FormControlLabel
            control={
              <Switch
                checked={isFilteringByAllOrNothing}
                onChange={() => {
                  actionOnTheSite(METRIC_ACTIONS.PRODUCT_FILTER_ALL_OR_NOTHING);
                  setIsFilteringByAllOrNothing(!isFilteringByAllOrNothing);
                }}
                name="onlySelectedCategories"
                color="primary"
              />
            }
            label="Все выбранные категории"
          />
          <div style={{margin: "10px 0"}}>
            <Button
              variant="outlined"
              id="button_open_add_category_item_options_sampling"
              aria-controls="simple-category-item-options-sampling"
              aria-haspopup="true"
              onClick={() => {setIsOpenMenuCategories(true)}}
              style={{width: "100%"}}
            >
              Добавить категорию
            </Button>
            <Menu
              id="simple-category-item-options-sampling"
              anchorEl={document.getElementById("button_open_add_category_item_options_sampling")}
              keepMounted
              open={isOpenMenuCategories}
              onClose={() => {setIsOpenMenuCategories(false)}}
            >
              {categories.map(category => {
                if (
                  filteringByCategoriesIds &&
                  filteringByCategoriesIds
                    .find(findIdCategory => findIdCategory === category.id)
                ) {
                  return null;
                }
                return (
                  <MenuItem
                    key={`KEY_SELECT_id_select_category_edit_item_CATEGORY_${category.id}`}
                    onClick={() => {
                      actionOnTheSite({...METRIC_ACTIONS.PRODUCT_FILTER_ADD_CATEGORY, payload: category});
                      if (filteringByCategoriesIds) {
                        setFilteringByCategoriesIds([
                          ...filteringByCategoriesIds,
                          category.id
                        ]);
                      } else {
                        setFilteringByCategoriesIds([category.id]);
                      }
                      setIsOpenMenuCategories(false);
                    }}
                  >
                    {category.name}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            {filteringByCategoriesIds && filteringByCategoriesIds.map(categoryID => (
              <span
                key={`KEY_OPTIONS_SAMPLING_ITEM_CATEGORY_ID_${categoryID}`}
                className="product_category_container alternate_delete_product_category_container"
                title="удалить"
                onClick={() => {
                  actionOnTheSite({...METRIC_ACTIONS.PRODUCT_FILTER_DELETE_CATEGORY, payload: categoryID});
                  const newValue = filteringByCategoriesIds.filter(filterCategoryID => filterCategoryID !== categoryID);
                  setFilteringByCategoriesIds(newValue.length > 0 ? newValue : undefined);
                }}
              >
                {categories.find(category => category.id === categoryID)?.name}
              </span>
            ))}
          </div>
        </div>
      </Card>
      <div className="container_pagination_and_cards_product">
        <Pagination
          page={currentPage}
          count={countPages}
          onChange={handleChangePage}
        />
        <div className="container_cards_product">
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
