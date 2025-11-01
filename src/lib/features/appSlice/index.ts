import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IAppState } from './type';
import { EUserRole } from '@/common/enums';

const initialState: IAppState = {
  isOpenSidebar: true,
  segment: undefined,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
    toggleSidebar: (state) => {
      state.isOpenSidebar = !state.isOpenSidebar;
    },
    setSegment: (state, action: PayloadAction<EUserRole | undefined>) => {
      state.segment = action.payload;
    },
  },
});

export const { setIsOpenSidebar, toggleSidebar, setSegment } = appSlice.actions;

export default appSlice.reducer;

