import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ISidebarDashboardState } from './type';

const initialState: ISidebarDashboardState = {
  listRoute: [],
};

export const sidebarDashboardSlice = createSlice({
  name: 'sidebarDashboard',
  initialState,
  reducers: {},
});

export const {} = sidebarDashboardSlice.actions;

export default sidebarDashboardSlice.reducer;

