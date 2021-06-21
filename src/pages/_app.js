import Router from 'next/router';
import { useState, useEffect, createContext } from 'react';
import Cookies from 'js-cookie';
import { isExpired, decodeToken } from "react-jwt";
import useSWR, { trigger, mutate } from 'swr'
import {Provider} from "react-redux";
import axios from "axios";

import '../../public/css/index.scss';
import store from "../redux/store";

export const UserContext = createContext();

const App = ({ Component, pageProps }) => {
    let [userId, setUserId] = useState();
    let [accessToken, setAccessToken] = useState();
    let [refreshToken, setRefreshToken] = useState();

    // get the token from the cookie
    const cookieAccessToken     = Cookies.get('accessToken');
    const cookieRefreshToken    = Cookies.get('refreshToken');
    const cookieUserId          = Cookies.get('userId');

    useEffect(() => {
        if (cookieAccessToken && cookieRefreshToken && cookieUserId) {
            setAccessToken(cookieAccessToken);
            setRefreshToken(cookieRefreshToken);
            setUserId(cookieUserId);
        }
        else {
            setUserId(null);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('userId');
        }
    }, [])

    return (

            <UserContext.Provider
                value={{
                    accessToken: cookieAccessToken || accessToken,
                    refreshToken: cookieRefreshToken || refreshToken,
                    userId: cookieUserId || userId,
                }}>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </UserContext.Provider>

    )
}

export default App