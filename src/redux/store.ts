import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import appSlice from "../components/App/appSlice";
import metricSlice from "./metrics/metricsSlice";
import {STORE_STATUSES} from "../config/storeStatuses";
import authSlice from "./auth/authSlice";
import notificationsSlice from "../components/common/Notifications/notificationsSlice";
import configurationsSlice from "./configurations/configurationsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    notifications: notificationsSlice,
    app: appSlice,
    metrics: metricSlice,
    configurations: configurationsSlice,
  },
});

export type IBaseStore = {
  status: typeof STORE_STATUSES[keyof typeof STORE_STATUSES];
  error?: any;
};
export type IAppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export type IAppThunk<ReturnType = void> = ThunkAction<ReturnType,
  IRootState,
  unknown,
  Action<string>>;
