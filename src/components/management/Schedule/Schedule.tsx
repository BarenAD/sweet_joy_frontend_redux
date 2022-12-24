import React, {FC} from "react";
import {ISchedule} from "../../App/appTypes";
import {Card} from "@mui/material";
import {AddCircleOutline, EditOutlined} from "@mui/icons-material";
import "./Schedule.scss";

type IScheduleProps = {
  schedule?: ISchedule;
  onClick: () => void;
};

const Schedule: FC<IScheduleProps> = ({
  schedule,
  onClick,
}) => {
  if (!schedule) {
    return (
      <Card className="schedule-card-container" onClick={onClick}>
        <AddCircleOutline className="icon-add"/>
      </Card>
    );
  }

  return (
    <Card
      className="schedule-card-container"
      onClick={onClick}
    >
      <span><b>Название:</b> {schedule.name}</span>
      <span><b>Понедельник:</b> {schedule.monday}</span>
      <span><b>Вторник:</b> {schedule.tuesday}</span>
      <span><b>Среда:</b> {schedule.wednesday}</span>
      <span><b>Четверг:</b> {schedule.thursday}</span>
      <span><b>Пятница:</b> {schedule.friday}</span>
      <span><b>Суббота:</b> {schedule.saturday}</span>
      <span><b>Воскресенье:</b> {schedule.sunday}</span>
      <span><b>Выходные:</b> {schedule.holiday}</span>
      <span><b>Особые:</b> {schedule.particular}</span>
      {!!onClick &&
        <div
          className="container-hover-edit"
        >
          <EditOutlined className="edit-icon"/>
        </div>
      }
    </Card>
  );
};

export default Schedule;
