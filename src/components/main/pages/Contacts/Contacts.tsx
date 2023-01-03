import React, {FC, ReactElement, useState} from "react";
import {Card, IconButton, Modal} from "@mui/material";
import {useAppSelector} from "../../../../redux/hooks";
import CustomModal from "../../../common/CustomModal/CustomModal";
import "./Contacts.scss";
import {preparePhoneByMask} from "../../../../utils/utils";
import {ISchedule} from "../../../../types";
import Map from "../../../common/Map/Map";
import {MapOutlined} from "@mui/icons-material";
import {RUS_WEEK_DAYS, WEEK_DAYS, WEEK_DAYS_ORDER} from "../../../../config/config";
import {getShopsStore} from "../../../../redux/slices/shopsSlice";
import {STORE_STATUSES} from "../../../../config/storeStatuses";
import Preloader from "../../../common/Preloader/Preloader";

const Contacts: FC = () => {
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const shops = useAppSelector(getShopsStore);

  const handlePreviewMap = (integratedMap: string) => {
    setModalContent(<Map map={integratedMap}/>);
  };

  if (shops.status !== STORE_STATUSES.COMPLETE) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className='contacts-main-container'>
      <CustomModal
        onClose={() => {
          setModalContent(null)
        }}
        children={modalContent}
      />
      {shops.shops.map((shop) => {
        return (
          <Card
            className='customize-card'
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
              {shop.map_integration &&
                <tr>
                  <td>Карта:</td>
                  <td>
                    <IconButton
                      color='inherit'
                      onClick={() => {handlePreviewMap(shop.map_integration)}}
                    >
                      <MapOutlined className='map-icon'/>
                    </IconButton>
                  </td>
                </tr>
              }
              <details>
                <summary>Расписание работы</summary>
                {renderSchedule(shop.schedule)}
              </details>
            </table>
          </Card>
        );
      })}
    </div>
  );
}

const renderSchedule = (schedule: ISchedule) => {
  const currentWeekDay: number = new Date().getDay();
  return (
    <>
      <hr/>
      {WEEK_DAYS_ORDER.map((indexDay) => {
        const weekDay = WEEK_DAYS[indexDay];
        if (!schedule[weekDay]) {
          return null;
        }
        return renderWeekDay(
          schedule[weekDay],
          RUS_WEEK_DAYS[indexDay],
          weekDay === WEEK_DAYS[currentWeekDay]
        );
      })}
    </>
  );
}

const renderWeekDay = (
  schedulePart: string,
  rusWeekDay: typeof RUS_WEEK_DAYS[keyof typeof RUS_WEEK_DAYS],
  isCurrentWeekDay: boolean = false,
) => {
  return (
    <tr className={isCurrentWeekDay ? 'is-bold' : undefined}>
      <td>{''+rusWeekDay}:</td>
      <td>{schedulePart}</td>
    </tr>
  );
}

export default Contacts;
