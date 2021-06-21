import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router";
import {decodeToken, isExpired} from "react-jwt";

export const authorize = createAsyncThunk(
    'auth/authorize',
    async () => {

        const response = await fetch(`${process.env.REST_API_URL}/auth`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await response.json();

        return json;
    }
);

export const logIn = createAsyncThunk(
    'auth/logIn',
    async ({email, password}) => {

        const response = await fetch(`${process.env.REST_API_URL}/auth/user`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:email,
                password:password
            })
        });

        const json = await response.json();

        return json;
    }
);

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({email, phone, firstName, lastName, password, passwordRepeat}, { getState }) => {

        const { accessToken } = getState().auth;

        const response = await fetch(`${process.env.REST_API_URL}/users`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                email:email,
                phone:phone,
                firstName:firstName,
                lastName:lastName,
                password:password,
                passwordRepeat:passwordRepeat
            })
        });

        const json = await response.json();

        return json;
    }
);

export const sendVerificationCode = createAsyncThunk(
    'auth/sendVerificationCode',
    async ({phone}, {getState}) => {

        const { accessToken } = getState().auth;

        const response = await fetch(`${process.env.REST_API_URL}/phone/send`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                phone:phone,
            })
        });

        const json = await response.json();

        return json;
    }
);

export const verifyPhone = createAsyncThunk(
    'auth/verifyPhone',
    async ({phone, code}, {getState}) => {

        const { accessToken } = getState().auth;

        const response = await fetch(`${process.env.REST_API_URL}/phone/verify`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                phone:phone,
                code:code,
            })
        });

        const json = await response.json();

        console.log(json);

        return json;
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async ({accessToken, refreshToken}) => {

        const response = await fetch(`${process.env.REST_API_URL}/auth/refresh`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                refresh_token:refreshToken
            })
        });

        const json = await response.json();

        return json;
    }
);

const initialState = {
    accessToken: Cookies.get('accessToken') || '',
    refreshToken: Cookies.get('refreshToken') || '',
    userId: Cookies.get('userId') || '',
    isLoggedIn: Cookies.get('userId') ? true : false,
    errors: [],
    messages: []
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        logOut: (state) => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userId');

            state = initialState;

            Router.push('/login');
        },
        authToInitial: (state) => {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userId');

            state = initialState;
        }
    },
    extraReducers: {
        [logIn.fulfilled]: (state, { payload }) => {
            if(Object.keys(payload.errors).length) {
                state.status = 'error';
                state.errors = payload.errors;
            } else {
                Cookies.set('accessToken', payload.accessToken, {expires: 14});
                Cookies.set('refreshToken', payload.refreshToken, {expires: 14});
                Cookies.set('userId', payload.userId, {expires: 14});

                state.isLoggedIn = true;
                state.userId = payload.userId;
                state.accessToken = payload.accessToken;
                state.refreshToken = payload.refreshToken;
            }
        },
        [logIn.rejected]: (state, { meta, payload, error}) => {
            state.isLoggedIn = false;
            state.errors = error;
        },
        [logIn.pending]: (state, { meta, payload, error}) => {
            state.isLoggedIn = false;
        },
        [signUp.fulfilled]: (state, { payload }) => {
            if(Object.keys(payload.errors).length) {
                state.status = 'error';
                state.errors = payload.errors;
            } else {
                Cookies.set('accessToken', payload.accessToken, {expires: 14});
                Cookies.set('refreshToken', payload.refreshToken, {expires: 14});
                Cookies.set('userId', payload.userId, {expires: 14});

                state.isLoggedIn = true;
                state.userId = payload.userId;
                state.accessToken = payload.accessToken;
                state.refreshToken = payload.refreshToken;
            }
        },
        [signUp.rejected]: (state, { meta, payload, error}) => {
            state.isLoggedIn = false;
            state.errors = error;
        },
        [signUp.pending]: (state, { meta, payload, error}) => {
            state.isLoggedIn = false;
        },
        [refreshToken.fulfilled]: (state, { payload }) => {
            if(Object.keys(payload.errors).length) {
                state.status = 'error';
                state.errors = payload.errors;
            } else {
                Cookies.set('accessToken', payload.accessToken, {expires: 14});
                Cookies.set('refreshToken', payload.refreshToken, {expires: 14});
                Cookies.set('userId', payload.userId, {expires: 14});

                state.status = 'success';
                state.userId = payload.userId;
                state.accessToken = payload.accessToken;
                state.refreshToken = payload.refreshToken;
            }
        },
        [authorize.fulfilled]: (state, {payload}) => {
            Cookies.set('accessToken', payload.accessToken, {expires: 14});
            Cookies.set('refreshToken', payload.refreshToken, {expires: 14});

            state.isLoggedIn = false;
            state.accessToken = payload.accessToken;
            state.refreshToken = payload.refreshToken;
        },
        [sendVerificationCode.fulfilled]: (state, {payload}) => {
            console.log(payload);
            if(payload.errors) {
                state.errors = payload.errors;
                state.messages = '';
            } else {
                state.messages = payload.messages;
                state.errors = '';
            }
        },
        [sendVerificationCode.rejected]: (state, {payload}) => {
            console.log(2, payload);
            if(payload.errors) {
                state.errors = payload.errors;
                state.messages = '';
            } else {
                state.messages = payload.messages;
                state.errors = '';
            }
        },
        [verifyPhone.fulfilled]: (state, {payload}) => {
            console.log(payload);
            if(payload.errors) {
                state.errors = payload.errors;
                state.messages = '';
            } else if(payload.messages){
                state.messages = payload.messages;
                state.errors = '';
            }
        }
    }

});

export const { logOut, authToInitial } = authSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getAuth = state => state.auth;
export const getAuthErrors = state => state.auth.errors;
export const getAuthMessages = state => state.auth.messages;
export const getAuthStatus = state => state.auth.isLoggedIn;

export default authSlice.reducer;
