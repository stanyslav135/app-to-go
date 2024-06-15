import {withUser} from '../lib/hocs/withUser';
import {useEffect, useState} from "react";
import Router, {useRouter} from "next/router";
import {DashboardLayout} from "../layouts/DashboardLayout";
import {Col, Container, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import {
    getAuthErrors,
    getAuthMessages,
    getAuthStatus,
    sendVerificationCode,
    signUp,
    verifyPhone
} from "../redux/reducers/auth";
import FormGroup from "../components/form-group/form-group";
import Button from "../components/button/button";
import store from "../redux/store";
import Link from "next/link";

const Signup = (props) => {
    const router = useRouter();

    const [email, setEmail] = useState('root@apptogo.com');
    const [phone, setPhone] = useState('+49017622112211');
    const [phoneVerificationCode, setPhoneVerificationCode] = useState();
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Gult');
    const [password, setPassword] = useState('p0olko');
    const [passwordRepeat, setPasswordRepeat] = useState('p0olko');

    const isLoggedIn = useSelector(getAuthStatus);
    const errors = useSelector(getAuthErrors);
    const messages = useSelector(getAuthMessages);

    useEffect(() => {
        if(isLoggedIn) {
            Router.push(router.query.r ? router.query.r : '/profile');
        }
    },[isLoggedIn])

    return (
        <DashboardLayout>
            <Container className={'my-5'}>
                <h1>Registration</h1>
                <p className="text-secondary">Sign up to add App<b>ToGo</b> for your business</p>
                <Row>
                    <Col md={8} className={`col-left px-4 py-4`} style={{background: '#f2f2f7', border: '1px solid #c7c7cc', marginBottom: '2rem'}}>

                        <h2 className={`mb-4`}>Your credentials</h2>
                        <div className={`alert alert-secondary br-0`} style={errors.form ? {display: 'block'} : {display: 'none'}}>{errors.form && errors.form}</div>
                        <FormGroup
                            input={{ type: 'input', placeholder: 'Email', value: email, onChange: (e) => { setEmail(e.target.value) } } }
                            label={{text:'Email', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:errors.email && errors.email}}
                        />
                        <FormGroup
                            input={{ type: 'password', placeholder: '********', value: password, onChange: (e) => { setPassword(e.target.value) } } }
                            label={{text:'Password', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:false}}
                        />
                        <FormGroup
                            input={{ type: 'password', placeholder: '********', value: passwordRepeat, onChange: (e) => { setPasswordRepeat(e.target.value) } } }
                            label={{text:'Password again', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:errors.password && errors.password}}
                        />
                        <hr/>

                        <h2 className={`mb-4`}>Your credentials</h2>
                        <p className="text-secondary">Sign up to App<b>ToGo</b> for your business</p>
                        <FormGroup
                            input={{ type: 'input', placeholder: '', value: firstName, onChange: (e) => { setFirstName(e.target.value) } } }
                            label={{text:'First name', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:errors.firstName && errors.firstName}}
                        />
                        <FormGroup
                            input={{ type: 'input', placeholder: '', value: lastName, onChange: (e) => { setLastName(e.target.value) } } }
                            label={{ text:'Last name', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:errors.lastName && errors.lastName}}
                        />
                        <FormGroup
                            input={{ type: 'input', placeholder: '+49017622112211', value: phone, onChange: (e) => { setPhone(e.target.value) } } }
                            label={{ text:'Phone number', className: 'h5 text-main-2'}}
                            hint={false}
                            success={{}}
                            error={{text:errors.phone && errors.phone}}
                        />
                        <FormGroup
                            className={'float-left col-12 px-0'}
                            input={{ type: 'input', placeholder: 'Code', value: phoneVerificationCode, className: 'form-control col-6 text-center float-right', onChange: (e) => { setPhoneVerificationCode(e.target.value); } }}
                            label={{ text:'Phone verification', className: 'h5 float-left px-0 col-12 text-main-2'}}
                            button={{ text: 'Send code', className: 'col-5 float-left', onClick:() => { store.dispatch(sendVerificationCode({phone:phone})); } }}
                            hint={false}
                            error={{text:errors.code && errors.code, className: 'col-6 float-right'}}
                            success={{text:messages.code && messages.code, className: 'col-6 float-right'}}
                        />
                        <button onClick={ () => {store.dispatch(verifyPhone({phone:phone, code:phoneVerificationCode}));} }>Verify Code</button>
                        <hr/>
                        <p className="text-secondary mb-4">By clicking the "Register" button below, you accept the <a href="">site's terms of use</a> and <a href="">privacy policy.</a></p>
                        <Col xs={12} sm={8} md={2} lg={2} className={`px-0`}>
                            <Button
                                text={'Register'}
                                onClick={() => {
                                    store.dispatch(signUp({email: email, phone:phone, firstName:firstName, lastName:lastName, password: password, passwordRepeat: passwordRepeat}));
                                }}
                            />
                        </Col>
                    </Col>

                    <Col md={4} className={`col-right`}>
                        <h5 className={`text-main pl-4`}>Already registered?</h5>
                        <ul className={`text-blue pl-4 list-unstyled`}>
                            <li>
                                <i className={`fad fa-circle mr-2`}></i>
                                <Link href={'/register'}>Sign in</Link>
                            </li>
                        </ul>
                    </Col>

                </Row>
            </Container>
        </DashboardLayout>
    );

}

export default withUser(Signup, 0)
