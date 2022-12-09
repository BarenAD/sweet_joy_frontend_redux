import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appSlice from "../components/App/appSlice";
import {BASE_STORE_STATUSES} from "../config/storeStatuses";

export const store = configureStore({
  reducer: {
    app: appSlice,
  },
});

export type IBaseStore = {
  status: typeof BASE_STORE_STATUSES[keyof typeof BASE_STORE_STATUSES];
  error?: any;
};
export type IAppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export type IAppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  IRootState,
  unknown,
  Action<string>
>;
