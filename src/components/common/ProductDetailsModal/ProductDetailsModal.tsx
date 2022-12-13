import {IProduct, IShopProduct} from "../../App/appTypes";
import React, {FC, ReactElement, useState} from "react";
import ModalContent from "../ModalContent/ModalContent";
import {useAppSelector} from "../../../redux/hooks";
import {getCategories, getShopProducts} from "../../App/appSlice";
import "./ProductDetailsModal.scss";
import {Modal} from "@mui/material";
import ShopProduct from "../ShopProduct/ShopProduct";

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
