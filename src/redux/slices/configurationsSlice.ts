import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {SITE_CONFIG_IDENTIFIERS} from "../../config/siteConfigIdentifiers";
import {IBaseStore, IRootState} from "../store";
import {
  IKeyStringStoreObject,
} from "../../types";
import {httpClient} from "../../utils/httpClient";
import {ROUTES_API} from "../../config/routesApi";
import {addNotification} from "./notificationsSlice";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {ERRORS} from "../../config/errors";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";

export type IConfiguration = {
  id: number;
  name: string;
  identify: typeof SITE_CONFIG_IDENTIFIERS[keyof typeof SITE_CONFIG_IDENTIFIERS];
  value: string;
};

type IConfigurationStore = IBaseStore & {
  configurations: IKeyStringStoreObject<IConfiguration>;
}

const initialState: IConfigurationStore = {
  status: STORE_STATUSES.LOADING,
  configurations: {}
};

export const refreshConfigurations = createAsyncThunk(
  'configurations/refreshConfigurations',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IKeyStringStoreObject<IConfiguration>>({
        url: ROUTES_API.GET_CONFIGURATIONS,
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const configurationsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshConfigurations.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(refreshConfigurations.fulfilled, (state, action) => {
        const data: any = {...action.payload};
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          configurations: data,
        };
      })
      .addCase(refreshConfigurations.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getConfigurations = (state: IRootState) => state.configurations.configurations;
export const getConfigurationsStatus = (state: IRootState) => state.configurations.status;
export const getConfigurationsStore = (state: IRootState) => state.configurations;

export default configurationsSlice.reducer;
