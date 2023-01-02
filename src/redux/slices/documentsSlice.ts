import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {ROUTES_API} from "../../config/routesApi";
import {ERRORS} from "../../config/errors";
import {STORE_STATUSES} from "../../config/storeStatuses";
import {httpClient} from "../../utils/httpClient";
import {KEY_LOCAL_STORAGE_IS_DEBUG} from "../../config/config";
import { addNotification } from "./notificationsSlice";
import {IBaseStore, IRootState} from "../store";
import {IDocument, IKeyStringStoreObject} from "../../types";

type IDocumentsStore = IBaseStore & {
  documents: IKeyStringStoreObject<IDocument>;
};

const initialState: IDocumentsStore = {
  status: STORE_STATUSES.INITIAL,
  documents: {},
};

export const documentsRefreshStore = createAsyncThunk(
  'documents/refreshStore',
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await httpClient<IKeyStringStoreObject<IDocument>>({
        url: ROUTES_API.DOCUMENTS,
        handleAddNotification: (notification => dispatch(addNotification(notification)))
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(documentsRefreshStore.pending, (state) => {
        state.status = STORE_STATUSES.LOADING;
        delete state.error;
      })
      .addCase(documentsRefreshStore.fulfilled, (state, action) => {
        const data: any = action.payload;
        return {
          ...state,
          status: STORE_STATUSES.COMPLETE,
          documents: data,
        };
      })
      .addCase(documentsRefreshStore.rejected, (state, action) => {
        state.status = STORE_STATUSES.ERROR;
        const anyPayload: any = action.payload;
        state.error = anyPayload.message || ERRORS.UNKNOWN_ERROR.message;
        if (!!localStorage.getItem(KEY_LOCAL_STORAGE_IS_DEBUG) && anyPayload) {
          console.error(anyPayload);
        }
      });
  },
});

export const getDocuments = (state: IRootState) => state.documents.documents;
export const getDocumentsStore = (state: IRootState) => state.documents;


export default documentsSlice.reducer;
