import React, {FC} from "react";
import "./Product.scss";
import {IProduct} from "../../../types";
import {Card} from "@mui/material";
import {AddCircleOutline} from "@mui/icons-material";

const Product: FC<{
  product?: IProduct;
  handleOnClick?: () => void;
}> = ({
  product,
  handleOnClick,
}) => {
  if (!product) {
    return (
      <Card className='product-card' onClick={handleOnClick}>
        <AddCircleOutline className='icon-add'/>
      </Card>
    );
  }

  return (
    <Card
      className="product-card"
      onClick={handleOnClick}
    >
      <div className="product-card-image-container">
        <img
          src={product.image_mini}
          alt="img"
        />
      </div>
      <div className="product-info-container">
        <span className="head">
          {product.name}
        </span>
        {product.manufacturer &&
          <span>
            Производитель:<br/><b>{product.manufacturer}</b>
          </span>
        }
        {product.composition &&
          <span>
            Состав:<br/><b>{product.composition}</b>
          </span>
        }
        {product.product_unit &&
          <span>
            Измерение:<br/><b>{product.product_unit}</b>
          </span>
        }
      </div>
    </Card>
  );
};

export default Product;
