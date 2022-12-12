import {FC} from "react";
import "./Product.scss";
import {IProduct} from "../../App/appTypes";
import {Card} from "@mui/material";

const Product: FC<{
  product: IProduct;
  handleOpenDetails: () => void;
}> = ({
  product,
  handleOpenDetails,
}) => {
  return (
    <Card
      className="product-card"
      onClick={handleOpenDetails}
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
