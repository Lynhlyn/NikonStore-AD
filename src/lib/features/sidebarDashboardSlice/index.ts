import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ISidebarDashboardState } from './type';
import { ListRouteDashboardGroup } from './utils';

const initialState: ISidebarDashboardState = {
  listRoute: ListRouteDashboardGroup,
};

export const sidebarDashboardSlice = createSlice({
  name: 'sidebarDashboard',
  initialState,
  reducers: {},
});

export const {} = sidebarDashboardSlice.actions;

export default sidebarDashboardSlice.reducer;

