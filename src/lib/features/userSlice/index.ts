import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { IUserState } from './type';
import { IUserResponse } from '@/lib/services/modules/userService/type';
import { userApi } from '@/lib/services/modules/userService';

const initialState: IUserState = {
  user: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserResponse>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.fetchCurrentUser.matchFulfilled,
        (state, action: PayloadAction<IUserResponse>) => {
          state.user = action.payload;
        }
      )
      .addMatcher(
        userApi.endpoints.fetchCurrentUser.matchRejected,
        (state) => {
          state.user = undefined;
        }
      );
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

