import {Alert, Slide, Snackbar, Typography} from "@mui/material";
import {deleteNotification, getNotifications} from "./notificationsSlice";
import React, {FC, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import "./Notifications.scss";
import {NOTIFICATIONS_LIFE_TIME} from "../../../config/config";

const Notifications: FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(getNotifications);
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>();

  useEffect(() => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
    const indexNotify = notifications.findIndex(notification => notification.type !== 'error');
    if (indexNotify === -1) {
      return;
    }
    setAutoHideTimer(
      setTimeout(() => {
        dispatch(deleteNotification(indexNotify));
      }, NOTIFICATIONS_LIFE_TIME)
    );
  }, [notifications]);

  return (
    <Snackbar
      open={notifications.length > 0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      message={'test'}
    >
      <div className='notifications-content-container'>
        {notifications.map((notification, index) =>
          <Alert
            key={`KEY_NOTIFICATION_ALERT_${index}_TYPE_${notification.type}_CREATED_${notification.created_at}`}
            onClose={() => {dispatch(deleteNotification(index))}}
            severity={notification.type}
            className='notification-container'
          >
            <Typography>
              {notification.message}
            </Typography>
            <Typography className='notification-date-container'>
              {notification.created_at.split(' ')[1]}
            </Typography>
          </Alert>
        )}
      </div>
    </Snackbar>
  );
};

export default Notifications;
