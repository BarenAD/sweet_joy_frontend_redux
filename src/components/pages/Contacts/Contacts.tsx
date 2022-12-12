import React, {FC, ReactElement, useState} from "react";
import {useAppSelector} from "../../../redux/hooks";
import {getShops} from "../../App/appSlice";
import Modal from "../../common/Modal/Modal";
import "./Contacts.scss";
import MapOutlined from "../../../assets/icons/map_outline.svg";
import Card from "../../common/Card/Card";
import {preparePhoneByMask} from "../../../utils/utils";
import {ISchedule} from "../../App/appTypes";
import Map from "../../common/Map/Map";

const Contacts: FC = () => {
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const shops = useAppSelector(getShops);

  const handlePreviewMap = (integratedMap: string) => {
    setModalContent(<Map map={integratedMap}/>);
  };

  return (
    <div className='contacts-main-container'>
      <Modal
        isShow={!!modalContent}
        allowClose
        handleClose={() => {
          setModalContent(null)
        }}
      >
        {modalContent}
      </Modal>
      {shops.map((shop) => {
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
                    <img
                      src={MapOutlined}
                      alt=''
                      className='map-icon'
                      onClick={() => {handlePreviewMap(shop.map_integration)}}
                    />
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

const rusWeekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'праздники', 'другое'] as const;
const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'holiday', 'particular'] as const;
const weekDaysOrder = [1,2,3,4,5,6,0,7,8] as const;

const renderSchedule = (schedule: ISchedule) => {
  const currentWeekDay: number = new Date().getDay();
  return (
    <>
      <hr/>
      {weekDaysOrder.map((indexDay) => {
        const weekDay = weekDays[indexDay];
        if (!schedule[weekDay]) {
          return null;
        }
        return renderWeekDay(
          schedule[weekDay],
          rusWeekDays[indexDay],
          weekDay === weekDays[currentWeekDay]
        );
      })}
    </>
  );
}

const renderWeekDay = (
  schedulePart: string,
  rusWeekDay: typeof rusWeekDays[keyof typeof rusWeekDays],
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
