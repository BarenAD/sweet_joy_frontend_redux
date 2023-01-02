import React, {FC} from "react";
import {ISchedule} from "../../../types";
import {Card, IconButton, Typography} from "@mui/material";
import {preparePhoneByMask} from "../../../utils/utils";
import {AddCircleOutline, MapOutlined, Schedule as ScheduleIcon} from "@mui/icons-material";
import "./Shop.scss";
import {IShopEdit} from "../ShopEdit/ShopEdit";

type IShopProps = {
  shop?: IShopEdit;
  schedule?: ISchedule;
  handlePreviewMap?: (map: string) => void;
  handlePreviewSchedule?: (schedule: ISchedule) => void;
  handleShowEdit?: (shop?: IShopEdit) => void;
};

const Shop: FC<IShopProps> = ({
  shop,
  schedule,
  handlePreviewMap,
  handlePreviewSchedule,
  handleShowEdit,
}) => {
  if (!shop) {
    return (
      <Card className='shop-card-container' onClick={() => {
        if (handleShowEdit) {
          handleShowEdit(shop)
        }
      }}>
        <AddCircleOutline className='icon-add'/>
      </Card>
    );
  }

  return (
    <Card
      className='shop-card-container'
      onDoubleClick={() => {
        if (handleShowEdit) {
          handleShowEdit(shop);
        }
      }}
    >
      <table>
        <tr>
          <td>Адрес:</td>
          <td><b>{shop.address}</b></td>
        </tr>
        <tr>
          <td>Телефон:</td>
          <td><a href={`tel:+${shop.phone}`}><b>{preparePhoneByMask(shop.phone)}</b></a></td>
        </tr>
        {(shop.map_integration && handlePreviewMap) &&
          <tr>
            <td>Карта:</td>
            <td>
              <IconButton
                color='inherit'
                onClick={() => {handlePreviewMap(shop.map_integration)}}
              >
                <MapOutlined />
              </IconButton>
            </td>
          </tr>
        }
        {(schedule && handlePreviewSchedule) &&
          <tr>
            <td>Расписание:</td>
            <td>
              <IconButton
                color='inherit'
                onClick={() => {handlePreviewSchedule(schedule)}}
              >
                <ScheduleIcon />
              </IconButton>
            </td>
          </tr>
        }
      </table>
      <Typography
        align='center'
        color='gray'
        style={{fontSize: '12px'}}
      >
        Для редактирования нажмите на элемент дважды
      </Typography>
    </Card>
  );
};

export default Shop;
