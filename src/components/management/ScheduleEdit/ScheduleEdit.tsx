import React, {FC, useState} from "react";
import {ISchedule} from "../../App/appTypes";
import {Card, IconButton, TextField, Typography} from "@mui/material";
import {RUS_WEEK_DAYS, WEEK_DAYS} from "../../../config/config";
import {AddCircleOutline, DeleteOutline, EditOutlined} from "@mui/icons-material";
import "./ScheduleEdit.scss";
import Preloader from "../../common/Preloader/Preloader";

type IScheduleEditProps = {
  schedule?: ISchedule;
  handleAction: (action: 'POST' | 'PUT' | 'DELETE', schedule: ISchedule) => Promise<any>;
};

const ScheduleEdit: FC<IScheduleEditProps> = ({
  schedule,
  handleAction,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [changingSchedule, setChangingSchedule] = useState<ISchedule>(schedule ? {...schedule} : {
    id: 0,
    name: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
    holiday: '',
    particular: '',
  });

  const preparedHandleAction = (action: 'POST' | 'PUT' | 'DELETE', schedule: ISchedule) => {
    setIsLoading(true);
    handleAction(action, schedule)
      .finally(() => {
        setIsLoading(false)
      });
  };

  return (
    <Card className="schedule-edit-modal">
      <Typography
        variant='h6'
        align='center'
      >
        {schedule ? 'Редактирование расписания' : 'Создание расписания'}
      </Typography>
      <TextField
        label='Название'
        variant="outlined"
        value={changingSchedule.name}
        className="field"
        disabled={isLoading}
        onChange={(event) => {
          setChangingSchedule({
            ...changingSchedule,
            name: event.target.value,
          })
        }}
      />
      {Object.keys(changingSchedule)
        .filter((key: any) => !!WEEK_DAYS.find(weekDay => weekDay === key))
        .map((currentDay: any) => (
          <TextField
            key={`KEY_SCHEDULE_EDIT_WEEK_DAY_${currentDay}_DISABLED_${isLoading}}`}
            label={RUS_WEEK_DAYS[WEEK_DAYS.findIndex(weekDay => weekDay === currentDay)] ?? '???'}
            variant="outlined"
            //@ts-ignore
            value={changingSchedule[currentDay]}
            disabled={isLoading}
            className="field"
            onChange={(event) => {
              const newValue: any = {...changingSchedule};
              newValue[currentDay] = event.target.value;
              setChangingSchedule(newValue);
            }}
          />
        ))
      }
      {isLoading ?
        <div className='buttons-container'>
          <Preloader size={25} />
        </div>
        :
        <div className='buttons-container'>
          {schedule ?
            <div className='inner-container'>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading}
                onClick={() => preparedHandleAction("PUT", changingSchedule)}
              >
                <EditOutlined />
              </IconButton>
              <IconButton
                edge="start"
                color="inherit"
                disabled={isLoading}
                onClick={() => preparedHandleAction("DELETE", changingSchedule)}
              >
                <DeleteOutline />
              </IconButton>
            </div>
            :
            <IconButton
              edge="start"
              color="inherit"
              disabled={isLoading}
              onClick={() => preparedHandleAction('POST', changingSchedule)}
            >
              <AddCircleOutline />
            </IconButton>
          }
        </div>
      }
    </Card>
  );
};

export default ScheduleEdit;
