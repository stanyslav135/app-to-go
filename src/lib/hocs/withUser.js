import { useEffect } from 'react'
import Router from 'next/router';
import { useAuth } from '../hooks/useAuth';
import {isExpired} from "react-jwt";
import {useDispatch,  useSelector} from "react-redux";
import {getUser, getUserPermissionLevel, userToInitial} from "../../redux/reducers/user";
import {authorize, authToInitial} from "../../redux/reducers/auth";

const getRedirectTo = () => {
    if (typeof window !== 'undefined' && window.location) {
        return window.location
    }
    return {}
}

export const withUser = (WrappedComponent, ComponentPermission) => {


    const Wrapper = props => {
        const {accessToken, refreshToken, userId} = useAuth();
        const dispatch = useDispatch();

        const userPermissionLevel = useSelector(getUserPermissionLevel);

        /*
        Если accessToken истек или не существует,
        то авторизуемся без пользователя
        */

        if(isExpired(accessToken) || (!accessToken && !refreshToken && !userId)) {
            dispatch(authToInitial());
            dispatch(userToInitial());
            dispatch(authorize());
        } else if(accessToken && refreshToken && userId) {
            dispatch(getUser());
        }

        // if(userId && accessToken && refreshToken) {
        //     dispatch(getUser());
        // }

        useEffect(() => {
            if(userPermissionLevel < ComponentPermission) {
                Router.replace(`/login?r=${getRedirectTo().pathname + encodeURIComponent(getRedirectTo().search)}`, '/login', { shallow: true });
            }
        },[userPermissionLevel]);



        //IF NO USER IN STORE - GET IT

        //HERE SHOULD USER PERMISSION FOR EACH COMPONENT BE CHECKED
        ////IF LESS, THEN GO BACK


        // const userPermissionLevel = ;

        // console.log(user);

        // const [shouldFetchUser, setShouldFetchUser] = useState(true);
        // const [shouldGetUser, setShouldGetUser] = useState(false);

        // const cookieToken = cookie.get('token');
        // const cookieUserId = cookie.get('userId');

        // const fetchWithToken = (url, token) => {
        //     return fetch(url, {
        //         method: 'GET',
        //         headers: { 'Authorization': 'Bearer: ' + token },
        //     }).then(res => res.json());
        // }
        //
        // const { data: fetchedUser } = () => { shouldFetchUser ? fetchWithToken(`http://localhost:3600/users/${cookieUserId}`, cookieToken) : null }

        // useEffect(() => {
        //     const redir = getRedirectTo()
        //     if (cookieToken) {
        //         setToken(cookieToken)
        //         setUserId(cookieUserId)
        //         setShouldGetUser(true)
        //     } else {
        //         Router.replace(`/login?r=${redir.pathname + encodeURIComponent(redir.search)}`, '/login', { shallow: true })
        //     }
        // }, [shouldGetUser])

        // useEffect(() => {
        //     if (fetchedUser) {
        //         setUser(fetchedUser)
        //     }
        // }, [fetchedUser])

        return <WrappedComponent {...props} />
    }

    return Wrapper
}