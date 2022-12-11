import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IMetricAction} from "../../config/metricActions";

type IMetricsStore = {
  countActions: number;
};

const initialState: IMetricsStore = {
  countActions: 0,
};

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    actionOnTheSite: (state, action: PayloadAction<IMetricAction>) => {
      state.countActions++;
    },
  },
});

export const { actionOnTheSite } = metricsSlice.actions;

export default metricsSlice.reducer;
