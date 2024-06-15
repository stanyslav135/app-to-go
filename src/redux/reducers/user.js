import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export const getUser = createAsyncThunk(
    'user/getById',
    async (user, { getState }) => {

        const { userId, accessToken } = getState().auth;

        const response = await fetch(`${process.env.REST_API_URL}/users/${ userId }`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${ accessToken }`
            }
        });

        const json = await response.json();

        return json;
    }
);

const initialState = {
    user: {
        permissionLevel: 1
    },
    request: {
        status: '',
        error: ''
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        userToInitial: (state) => {
            state = initialState;
        }
    },
    extraReducers: {
        [getUser.pending]: (state, { meta, payload, error}) => {
            state.status = 'pending';
        },
        [getUser.rejected]: (state, { meta, payload, error} ) => {
            state.error = error;
            state.status = 'rejected';
        },
        [getUser.fulfilled]: (state, { meta, payload, error}) => {
            if(payload.error) {
                state.request.status = 'rejected';
                state.request.error = payload.error;
            } else {
                state.request.status = 'fulfilled';
                state.user = payload;
            }
        }
    }
});

export const { userToInitial } = userSlice.actions;

export const getUserData = state => state.user.user;
export const getUserStatus = state => state.user.request.status;
export const getUserPermissionLevel = state => state.user.user.permissionLevel;

export default userSlice.reducer;
