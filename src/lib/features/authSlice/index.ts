import TokenService from "@/common/utils/tokenService";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { IAuthCredentials, IAuthState } from "./type";
import { authApi } from "@/lib/services/modules/authService";

const initialState: IAuthState = {
    isAuthenticated: false,
    token: { 
        accessToken: "",
        refreshToken: undefined,
     },
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setToken: (state, action: PayloadAction<{ accessToken: string, refreshToken?: string }>) => {
            state.token.accessToken = action.payload.accessToken;
            if (action.payload.refreshToken) {
                state.token.refreshToken = action.payload.refreshToken;
            }
            TokenService.setToken(action.payload.accessToken, action.payload.refreshToken);
        },
        setLogout: (state) => {
            state.isAuthenticated = false;
            state.token = { accessToken: "", refreshToken: undefined };
            TokenService.removeToken();
        },
        setCredentials: (state, action: PayloadAction<IAuthCredentials>) => {
            state.token.accessToken = action.payload.accessToken;
            state.token.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            
            TokenService.setToken(action.payload.accessToken, action.payload.refreshToken);
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                const loginData = action.payload.data;
                
                state.isAuthenticated = true;
                state.token.accessToken = loginData.accessToken;
                state.token.refreshToken = loginData.refreshToken;
                
                TokenService.setToken(loginData.accessToken, loginData.refreshToken);
            })
            .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
                state.isAuthenticated = false;
                state.token = { accessToken: "", refreshToken: undefined };
                TokenService.removeToken();
            });
    },
});

export const { setAuthenticated, setToken, setLogout, setCredentials } = authSlice.actions;

export default authSlice.reducer;

