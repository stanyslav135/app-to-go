import {withUser} from '../lib/hocs/withUser';
import {useSelector} from "react-redux";
import {getUserData} from "../redux/reducers/user";
import store from "../redux/store";
import {logOut} from "../redux/reducers/auth";
import Router from "next/router";

const Profile = (props) => {

    const user = useSelector(getUserData);

    return (
        <>
            <h1>Hello, { user.firstName } { user.lastName }</h1>
            <button onClick={() => {
                store.dispatch(logOut());
            }}>Log out</button>
            <button onClick={() => { Router.push('/login') }}>to login page</button>
        </>
    );
}

export default withUser(Profile, 1024)
