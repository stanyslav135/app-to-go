import {useEffect} from 'react'
import Router from 'next/router';
import {useAuth} from '../hooks/useAuth';
import {isExpired} from "react-jwt";
import {useDispatch, useSelector} from "react-redux";
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

        if(isExpired(accessToken) || (!accessToken && !refreshToken && !userId)) {
            dispatch(authToInitial());
            dispatch(userToInitial());
            dispatch(authorize());
        } else if(accessToken && refreshToken && userId) {
            dispatch(getUser());
        }

        useEffect(() => {
            if(userPermissionLevel < ComponentPermission) {
                Router.replace(`/login?r=${getRedirectTo().pathname + encodeURIComponent(getRedirectTo().search)}`, '/login', { shallow: true });
            }
        },[userPermissionLevel]);


        return <WrappedComponent {...props} />
    }

    return Wrapper
}
