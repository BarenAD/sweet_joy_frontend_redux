import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMetricAction} from "../../config/metricActions";
import {SITE_CONFIG_IDENTIFIERS} from "../../config/siteConfigIdentifiers";
import {IBaseStore, IRootState} from "../store";
import {
  ICategory, IDocument,
  IKeyNumberStoreObject,
  IKeyStringStoreObject,
  IProduct,
  IShop,
  IShopProduct
} from "../../components/App/appTypes";
import {httpClient} from "../../utils/httpClient";
import {ROUTES_API} from "../../config/routesApi";
import {addNotification} from "../../components/common/Notifications/notificationsSlice";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {ERRORS} from "../../config/errors";
import {APP_DEBUG} from "../../config/config";
import {refreshStore} from "../../components/App/appSlice";

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
        if (APP_DEBUG && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getConfigurations = (state: IRootState) => state.configurations.configurations;
export const getConfigurationsStatus = (state: IRootState) => state.configurations.status;

export default configurationsSlice.reducer;
