import {IShopProduct} from "../../../types";
import React, {FC, ReactElement, useMemo, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import "./ProductDetailsModal.scss";
import ShopProduct from "../ShopProduct/ShopProduct";
import CustomModal from "../CustomModal/CustomModal";
import {getShopProductsStore} from "../../../redux/slices/shopProductsSlice";
import {getCategoriesStore} from "../../../redux/slices/categoriesSlice";
import {STORE_STATUSES} from "../../../config/storeStatuses";
import Preloader from "../Preloader/Preloader";
import {getProductsStore} from "../../../redux/slices/productsSlice";

type TypeProps = {
  productId: number;
};

const ProductDetailsModal: FC<TypeProps> = ({
  productId,
}) => {
  const products = useAppSelector(getProductsStore);
  const shopProducts = useAppSelector(getShopProductsStore);
  const categories = useAppSelector(getCategoriesStore);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const product = useMemo(() => {
    return products.products.find((findItem) => findItem.id === productId);
  }, [productId, products]);

  if (!product) {
    return null;
  }

  return (
    <div className="product-details-container">
      <CustomModal
        onClose={() => {
          setModalContent(null)
        }}
        children={modalContent}
      />
      <div className="details-container">
        <div className="image-container">
          <img
            src={`${product.image}`}
            alt="img"
          />
        </div>
        <div className="description-container">
          <span className="head">
            {product.name}
          </span>
          {product.manufacturer &&
          <span>
              Производитель:
              <br/>
              <b>
                  {product.manufacturer}
              </b>
            </span>
          }
          {product.composition &&
          <span>
              Состав:
              <br/>
              <b>
                  {product.composition}
              </b>
            </span>
          }
          {product.product_unit &&
          <span>
              Измерение:
              <br/>
              <b>
                  {product.product_unit}
              </b>
            </span>
          }
          {product.description &&
          <span>
              Описание:
              <br/>
              <b>
                {product.description}
              </b>
            </span>
          }
          <span>
            Категории товара:
          </span>
          {products.status === STORE_STATUSES.COMPLETE && categories.status === STORE_STATUSES.COMPLETE ?
            <div className="categories-container">
              {product.categories.map((categoryId: number) => {
                const category = categories.categories.find(findCategory => findCategory.id === categoryId);
                if (!category) {
                  return null;
                }
                return (
                  <span
                    className="product-category-container"
                    key={`PRODUCT_${product.id}_DETAILS_MODAL_CATEGORY_${category.id}`}
                    title={category.name}
                  >
                {category.name}
              </span>
                );
              })}
            </div>
            :
            <div className='preloader-row-center'>
              <Preloader size={40} />
            </div>
          }
        </div>
      </div>
      <div className="shop-products-container">
        {shopProducts.status === STORE_STATUSES.COMPLETE ?
          shopProducts.shopProducts[product.id]?.map((shopProduct: IShopProduct) => (
            <ShopProduct
              key={`KEY_PRODUCT_${product.id}_DETAILS_SHOP_PRODUCT_${shopProduct.id}`}
              shopProduct={shopProduct}
              handlePreviewMap={setModalContent}
            />
          ))
          :
          <Preloader size={40} />
        }
      </div>
    </div>
  );
}

export default ProductDetailsModal;
