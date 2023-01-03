import React, {FC, ReactElement} from "react";
import {Card, IconButton} from "@mui/material";
import "./ShopProduct.scss";
import {IShopProduct} from "../../../types";
import Map from "../Map/Map";
import {useAppSelector} from "../../../redux/hooks";
import {MapOutlined} from "@mui/icons-material";
import {preparePhoneByMask} from "../../../utils/utils";
import {WEEK_DAYS} from "../../../config/config";
import {getShops} from "../../../redux/slices/shopsSlice";

type IShopProductProps = {
  shopProduct: IShopProduct;
  handlePreviewMap: (content: ReactElement) => void;
};

const ShopProduct: FC<IShopProductProps> = ({
  shopProduct,
  handlePreviewMap,
}) => {
  const shop = useAppSelector(getShops).find(findShop => findShop.id === shopProduct.shop_id);

  if (!shop) {
    return null;
  }

  return (
    <Card
      className="shop-product-container"
    >
      {shop.map_integration &&
      <IconButton
        className="container-preview-map"
        color="inherit"
        onClick={() => {
          handlePreviewMap(<Map map={shop.map_integration}/>);
        }}
      >
        <MapOutlined/>
      </IconButton>
      }
      {shopProduct.count ?
        <span>
          Количество:
          <b>
            {shopProduct.count}
          </b>
        </span>
        :
        <span style={{fontSize: "14px"}}><b>Наличие уточняйте по телефону</b></span>
      }
      {shopProduct.price &&
      <span>
          Цена:
          <b>
              {`${shopProduct.price}₽`}
          </b>
        </span>
      }
      <span>
        Адрес:
        <b>
          {shop.address}
        </b>
      </span>
      <span>
        Телефон:
        <a href={`tel:+${shop.phone}`}>
          <b>
            {preparePhoneByMask(shop.phone)}
          </b>
        </a>
      </span>
      {shop.schedule &&
        <span>
          <b>
            {shop.schedule [WEEK_DAYS[new Date().getDay()]]}
          </b>
        </span>
      }
    </Card>
  );
};

export default ShopProduct;
