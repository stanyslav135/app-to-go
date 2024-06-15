import {withUser} from '../lib/hocs/withUser';
import {useEffect, useState} from "react";
import Router, {useRouter} from "next/router";
import {Col, Container, Row} from "react-bootstrap";
import {DashboardLayout} from "../layouts/DashboardLayout";
import store from "../redux/store";
import {useSelector} from "react-redux";
import {getAuthErrors, getAuthStatus, logIn} from "../redux/reducers/auth";
import FormGroup from "../components/form-group/form-group";
import Button from "../components/button/button";
import Link from 'next/link';


const Login = (props) => {

    const router = useRouter();

    const [email, setEmail] = useState('root@apptogo.com');
    const [password, setPassword] = useState('p0olko');

    const isLoggedIn = useSelector(getAuthStatus);
    const errors = useSelector(getAuthErrors);

    useEffect(() => {
        if(isLoggedIn) {
            Router.push(router.query.r ? router.query.r : '/profile');
        }
    },[isLoggedIn])


    return (
            <DashboardLayout>
                <Container className={'my-5'}>
                    <h1>Authorization</h1>
                    <p className="text-secondary">Authorize and manage your <b>To Go</b> business</p>
                    <Row>
                        <Col md={8} className={`col-left px-4 py-4`} style={{background: '#f2f2f7', border: '1px solid #c7c7cc', marginBottom: '2rem'}}>

                            <h2 className={`mb-4`}>Your login details</h2>
                            <div className={`alert alert-secondary br-0`} style={errors.form ? {display: 'block'} : {display: 'none'}}>{errors.form && errors.form}</div>
                            <FormGroup
                                input={{ type: 'input', placeholder: 'Email', value: email, onChange: (e) => { setEmail(e.target.value) } } }
                                label={{text:'Email', className: 'h5 text-main-2'}}
                                hint={false}
                                error={{text: errors.email && errors.email}}
                                success={{}}
                            />
                            <FormGroup
                                input={{ type: 'password', placeholder: '********', value: password, onChange: (e) => { setPassword(e.target.value) } } }
                                label={{text:'Password', className: 'h5 text-main-2'}}
                                hint={false}
                                error={{text: errors.password && errors.password}}
                                success={{}}
                            />
                            <Col xs={12} sm={8} md={2} lg={2} className={`px-0`}>
                                <Button
                                    text={'Log In'}
                                    onClick={() => {
                                        store.dispatch(logIn({email: email, password: password}));
                                    }}
                                />
                            </Col>
                        </Col>

                        <Col md={4} className={`col-right`}>
                            <h5 className={`text-main pl-4`}>Forgot your password?</h5>
                            <ul className={`text-blue pl-4 list-unstyled`}>
                                <li>
                                    <i className={`fad fa-circle mr-2`}></i>
                                    <Link href={'/restore-password'}>Restore password</Link>
                                </li>
                            </ul>
                            <h5 className={`text-main pl-4`}>Still not a member?</h5>
                            <ul className={`text-blue pl-4 list-unstyled`}>
                                <li>
                                    <i className={`fad fa-circle mr-2`}></i>
                                    <Link href={'/signup'}>Register</Link>
                                </li>
                            </ul>
                        </Col>

                    </Row>
                </Container>
            </DashboardLayout>
    );

}

export default withUser(Login, 0)
