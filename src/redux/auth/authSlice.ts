import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN} from "../../config/config";
import {IRootState} from "../store";
import {createContext} from "react";

type IAuthStore = {
  status: boolean;
};

const initialState: IAuthStore = {
  status: !!localStorage.getItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const { changeAuthStatus } = authSlice.actions;

export const getAuthStatus = (state: IRootState) => state.auth.status;

export const HandleChangeAuthStatusContext = createContext((newStatus: boolean) => {});

export default authSlice.reducer;
