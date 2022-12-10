import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import appSlice from "../components/App/appSlice";
import metricSlice from "../utils/metrics/metricsSlice";
import {STORE_STATUSES} from "../config/storeStatuses";

export const store = configureStore({
  reducer: {
    app: appSlice,
    metrics: metricSlice,
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
