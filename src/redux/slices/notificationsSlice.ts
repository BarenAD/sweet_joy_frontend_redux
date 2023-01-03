import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRootState} from "../store";
import {createContext, ReactElement} from "react";
import {FORMAT_DATE_NOTIFICATION, NOTIFICATIONS_MAX_COUNT} from "../../config/config";
import {format} from "date-fns";

export type INotificationAction = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string | ReactElement;
};

export type INotification = INotificationAction & {
  created_at: string;
};

const initialState: INotification[] = [];

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotificationAction>) => {
      const currentDate = format(new Date(), FORMAT_DATE_NOTIFICATION);
      return state.reduce((result, current, index) => {
        if (index < NOTIFICATIONS_MAX_COUNT-1) {
          result.unshift(current);
        }
        return result;
      }, [{
        ...action.payload,
        created_at: currentDate,
      }]);
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      return state.filter((notification, index) => index !== action.payload);
    },
  },
});

export const { addNotification, deleteNotification } = notificationsSlice.actions;

export const getNotifications = (state: IRootState) => state.notifications;

export const HandleAddNotificationContext = createContext((notification: INotificationAction) => {});

export default notificationsSlice.reducer;
