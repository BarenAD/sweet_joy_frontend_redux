import React, {FC, ReactElement, useContext, useEffect, useState} from "react";
import {ISchedule} from "../../../App/appTypes";
import {httpClient} from "../../../../utils/httpClient";
import {ROUTES_API} from "../../../../config/routesApi";
import {HandleAddNotificationContext} from "../../../common/Notifications/notificationsSlice";
import {HandleChangeAuthStatusContext} from "../../../../redux/auth/authSlice";
import Preloader from "../../../common/Preloader/Preloader";
import CustomModal from "../../../common/CustomModal/CustomModal";
import Schedule from "../../Schedule/Schedule";
import ScheduleEdit from "../../ScheduleEdit/ScheduleEdit";
import "./ManagementSchedules.scss";
import ConfirmDialog, {ISimpleDialogContentState} from "../../../common/ConfirmDialog/ConfirmDialog";

const ManagementSchedules: FC = () => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const handleAddNotificationContext = useContext(HandleAddNotificationContext);
  const handleChangeAuthStatusContext = useContext(HandleChangeAuthStatusContext);
  const [dialogContent, setDialogContent] = useState<null | ISimpleDialogContentState>(null);

  useEffect(() => {
    httpClient<ISchedule[]>({
      url: ROUTES_API.MANAGEMENT_SCHEDULES,
      method: 'GET',
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
    })
      .then((response) => setSchedules(response.data))
      .finally(() => setIsLoading(false));
  }, [])


  const confirmActionSchedule = (action: 'POST' | 'PUT' | 'DELETE', schedule: ISchedule): Promise<void> => {
    const messageAction = action === 'POST' ? 'создать' : action === 'PUT' ? 'изменить' : 'удалить';
    return new Promise((resolve, reject) => {
      setDialogContent({
        title: `Вы действительно хотите ${messageAction} расписание?`,
        confirmText: messageAction,
        callbackDecline: () => {
          reject();
        },
        handleConfirm: () => {
          setDialogContent(null);
          handleActionSchedule(action, schedule)
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        },
      });
    });
  };

  const handleActionSchedule = (action: 'POST' | 'PUT' | 'DELETE', schedule: ISchedule): Promise<void | ISchedule> => {
    const queryParam: string = action === 'POST' ? '' : `/${schedule.id}`;
    setIsLoading(true);
    return httpClient<ISchedule>({
      url: ROUTES_API.MANAGEMENT_SCHEDULES + queryParam,
      method: action,
      handleAddNotification: handleAddNotificationContext,
      handleChangeAuthStatus: handleChangeAuthStatusContext,
      isNeedAuth: true,
      body: action === 'DELETE' ?
        undefined
        :
        JSON.stringify(schedule),
    })
      .then((response) => {
        switch (action) {
          case "POST":
            setSchedules([
              response.data,
              ...schedules
            ]);
            break;
          case "PUT":
            setSchedules(
              schedules.map(mapSchedule => {
                if (mapSchedule.id === response.data.id) {
                  return response.data;
                }
                return mapSchedule;
              })
            );
            break;
          case "DELETE":
            setSchedules(schedules.filter(filterSchedule => filterSchedule.id !== schedule.id));
            break;
        }
        setModalContent(null);
      })
      .finally(() => setIsLoading(false));
  }

  if (isLoading && !modalContent) {
    return (
      <div className='preloader-center'>
        <Preloader size={50} />
      </div>
    );
  }

  return (
    <div className="management-schedules-container">
      <ConfirmDialog
        isOpen={!!dialogContent}
        title={dialogContent?.title}
        confirmButton={dialogContent ? {
            text: dialogContent.confirmText,
            handle: dialogContent.handleConfirm,
          }
          :
          undefined
        }
        declineButton={{
          text: 'Отмена',
          handle: () => {
            if (dialogContent?.callbackDecline) {
              dialogContent.callbackDecline();
            }
            setDialogContent(null);
          }
        }}
      />
      <CustomModal
        onClose={() => {setModalContent(null)}}
        children={modalContent}
      />
      <Schedule
        onClick={() => {
          setModalContent(
            <ScheduleEdit
              handleAction={confirmActionSchedule}
            />
          );
        }}
      />
      {schedules.map(schedule => (
        <Schedule
          key={`KEY_MANAGEMENT_SCHEDULE_${schedule.id}`}
          schedule={schedule}
          onClick={() => {
            setModalContent(
              <ScheduleEdit
                handleAction={confirmActionSchedule}
                schedule={schedule}
              />
            );
          }}
        />
      ))}
    </div>
  );
};

export default ManagementSchedules;
