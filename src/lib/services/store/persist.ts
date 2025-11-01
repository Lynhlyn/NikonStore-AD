import { persistReducer } from 'redux-persist';
import localStorage from './localStorage';
import authSlice from '@/lib/features/authSlice';
import { apiSlice } from '@/lib/services/api';
import { combineReducers, Reducer } from '@reduxjs/toolkit';
import type { Storage } from 'redux-persist';
import createCookieRoleStorage from './cookieAuthStorage';
import appSlice from '@/lib/features/appSlice';
import sidebarDashboardSlice from '@/lib/features/sidebarDashboardSlice';

const persist = (key: string, storage: Storage, reducer: Reducer) => persistReducer(
  {
    key,
    storage,
    keyPrefix: 'RT',
    version: 1,
  },
  reducer);

const cookieRoleStorage = createCookieRoleStorage({
  expires: 7,
  secure: false,
  sameSite: 'strict',
});

export default combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  app: persist('app', localStorage, appSlice),
  auth: persist('_SR', cookieRoleStorage, authSlice),
  sidebarDashboard: sidebarDashboardSlice,
});

