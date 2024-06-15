import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./reducers/user";
import authReducer from "./reducers/auth";

export default  configureStore({
        reducer: {
            auth: authReducer,
            user: userReducer,
        },
    });
