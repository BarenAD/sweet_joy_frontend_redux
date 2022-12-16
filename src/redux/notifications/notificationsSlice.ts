import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRootState} from "../store";
import {createContext, ReactElement} from "react";
import {FORMAT_DATE_NOTIFICATION, MAX_COUNT_NOTIFICATIONS} from "../../config/config";
import {format} from "date-fns";

export type INotification = {
  type: 'info' | 'warn' | 'error';
  message: string | ReactElement;
};

type INotificationsStore = Array<INotification & {
  created_at: string;
}>;

const initialState: INotificationsStore = [];

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      const currentDate = format(new Date(), FORMAT_DATE_NOTIFICATION);
      return state.reduce((result, current, index) => {
        if (index < MAX_COUNT_NOTIFICATIONS-1) {
          result.push(current);
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

export const getNotifications = (state: IRootState) => state;

export const HandleAddNotificationContext = createContext((notification: INotification) => {});

export default notificationsSlice.reducer;
