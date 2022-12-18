import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN,
  KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE
} from "../../config/config";
import {IRootState} from "../store";
import {createContext} from "react";
import {IProfile} from "./authTypes";

type IAuthStore = {
  status: boolean;
  profile: IProfile | null;
};

const initialState: IAuthStore = {
  status: !!localStorage.getItem(KEY_LOCAL_STORAGE_AUTHORIZATION_ACCESS_TOKEN),
  profile: JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE_AUTHORIZATION_PROFILE) ?? 'null'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeAuthStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
    setProfile: (state, action: PayloadAction<IProfile | null>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile, changeAuthStatus } = authSlice.actions;

export const getAuthStatus = (state: IRootState) => state.auth.status;
export const getProfile = (state: IRootState) => state.auth.profile;

export const HandleChangeAuthStatusContext = createContext((newStatus: boolean) => {});

export default authSlice.reducer;
