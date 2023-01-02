import {IProduct, IShopProduct} from "../../../types";
import React, {FC, ReactElement, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import "./ProductDetailsModal.scss";
import ShopProduct from "../ShopProduct/ShopProduct";
import CustomModal from "../CustomModal/CustomModal";
import {getShopProducts} from "../../../redux/slices/shopProductsSlice";
import {getCategories} from "../../../redux/slices/categoriesSlice";

type TypeProps = {
  product: IProduct;
};

const ProductDetailsModal: FC<TypeProps> = ({
  product,
}) => {
  const shopProducts: IShopProduct[] = useAppSelector(getShopProducts)[product.id];
  const categories = useAppSelector(getCategories);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);

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
          {product.categories.length && categories.length &&
            <div className="categories-container">
              {product.categories.map((categoryId: number) => {
                const category = categories.find(findCategory => findCategory.id === categoryId);
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
          }
        </div>
      </div>
      {shopProducts &&
        <div className="shop-products-container">
          {shopProducts.map((shopProduct: IShopProduct) => (
            <ShopProduct
              key={`KEY_PRODUCT_${product.id}_DETAILS_SHOP_PRODUCT_${shopProduct.id}`}
              shopProduct={shopProduct}
              handlePreviewMap={setModalContent}
            />
          ))}
        </div>
      }
    </div>
  );
}

export default ProductDetailsModal;
