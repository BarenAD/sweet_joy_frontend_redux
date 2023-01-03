import React, {FC, ReactElement, useEffect, useMemo, useState} from "react";
import {ISchedule} from "../../../types";
import {FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import Schedule from "../Schedule/Schedule";
import "./ShopEdit.scss";
import Preloader from "../../common/Preloader/Preloader";
import {AddCircleOutline, DeleteOutline, EditOutlined} from "@mui/icons-material";

export type IShopEdit = {
  id?: number;
  address: string;
  phone: string;
  schedule_id: number;
  map_integration: string;
};

type IShopEditProps = {
  shop?: IShopEdit;
  schedules: ISchedule[];
  handleAction: (action: 'POST' | 'PUT' | 'DELETE', shop: IShopEdit) => Promise<any>;
};

const ShopEdit: FC<IShopEditProps> = ({
  shop,
  schedules,
  handleAction,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changingShop, setChangingShop] = useState<IShopEdit>(shop ? {...shop} : {
    address: '',
    phone: '',
    schedule_id: -1,
    map_integration: '',
  });
  const [selectedScheduleID, setSelectedScheduleID] = useState<number | null>(shop?.schedule_id ?? null);
  const validated = useMemo<boolean>(() => {
    return (
      changingShop.schedule_id > -1 &&
      !!changingShop.phone &&
      !!changingShop.address &&
      !!changingShop.map_integration
    );
  }, [changingShop]);

  useEffect(() => {
    setChangingShop({
      ...changingShop,
      schedule_id: selectedScheduleID ?? -1,
    });
  }, [selectedScheduleID])

  const selectSchedule = useMemo<ReactElement>(() => {
    return (
      <FormControl variant="standard" className='field'>
        <InputLabel id={`ID_EDIT_SHOP_SELECT_LABEL_SCHEDULES`}>Расписание торговой точки</InputLabel>
        <Select
          labelId={`ID_EDIT_SHOP_SELECT_LABEL_SCHEDULES`}
          id={`ID_EDIT_SHOP_SELECT_SCHEDULES`}
          value={selectedScheduleID ? `${selectedScheduleID}` : ''}
          disabled={isLoading}
          onChange={(event) => {
            let value = event.target.value;
            if (typeof value === "number") {
              setSelectedScheduleID(value);
            }
          }}
        >
          {schedules.map(schedule => (
            <MenuItem
              key={`KEY_EDIT_SHOP_SELECT_SCHEDULE_ITEM_${schedule.id}`}
              value={schedule.id}
            >
              {schedule.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }, [isLoading, selectedScheduleID, schedules]);

  const preparedHandleAction = (action: 'POST' | 'PUT' | 'DELETE') => {
    setIsLoading(true);
    handleAction(action, changingShop)
      .finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <div className='shop-edit-modal'>
      <Typography
        variant='h6'
        align='center'
      >
        {shop ? 'Редактирование торговой точки' : 'Создание торговой точки'}
      </Typography>
      <TextField
        label='Адрес'
        variant='outlined'
        value={changingShop.address}
        className='field'
        disabled={isLoading}
        onChange={(event) => {
          setChangingShop({
            ...changingShop,
            address: event.target.value,
          })
        }}
      />
      <TextField
        label='Телефон'
        variant='outlined'
        value={changingShop.phone}
        className='field'
        disabled={isLoading}
        onChange={(event) => {
          setChangingShop({
            ...changingShop,
            phone: event.target.value,
          })
        }}
      />
      <TextField
        label='Интеграция карты'
        variant='outlined'
        value={changingShop.map_integration}
        className='field'
        disabled={isLoading}
        onChange={(event) => {
          setChangingShop({
            ...changingShop,
            map_integration: event.target.value,
          })
        }}
      />
      {selectSchedule}
      {selectedScheduleID &&
        <details className='field'>
          <summary>
            Показать расписание
          </summary>
          <Schedule
            schedule={schedules.find(findItem => findItem.id === selectedScheduleID)}
          />
        </details>
      }
      {isLoading ?
        <div className='buttons-container'>
          <Preloader size={25} />
        </div>
        :
        <div className='buttons-container'>
          {shop ?
            <div className='inner-container'>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading || !validated}
                onClick={() => preparedHandleAction("PUT")}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading}
                onClick={() => preparedHandleAction("DELETE")}
              >
                <DeleteOutline />
              </IconButton>
            </div>
            :
            <IconButton
              edge="start"
              color="inherit"
              disabled={isLoading || !validated}
              onClick={() => preparedHandleAction('POST')}
            >
              <AddCircleOutline />
            </IconButton>
          }
        </div>
      }
    </div>
  );
};

export default ShopEdit;
