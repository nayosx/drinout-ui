import React, { useState } from 'react';
import logo from '../../assets/images/logo.jpeg';
import './Login.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import loginSchema from './Login.validate';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey } from 'react-icons/fa';
import routes from '../../routes';
import { getRoleMenus } from '../../api/menu';
import { Status } from '../../utils/status.util';
import { STORAGE_KEYS } from '../../utils/storageKeys';

const Login = () => {
    const navigate = useNavigate();
    const [msgError, setMsgError] = useState('');
    const [status, setStatus] = useState(Status.INITIAL);

    const handleSubmit = async (values, { setSubmitting }) => {
        setMsgError('');
        setStatus(Status.LOADING);
        try {
            await login(values);
            handleMenus();
        } catch (error) {

            if(error.code === 'ERR_NETWORK') {
                setMsgError('Error de conexión. Verifique su conexión a internet.');
            } else {
                setMsgError('Usuario o contraseña incorrectos. Intente nuevamente.');
            }
            setStatus(Status.ERROR);
        } finally {
            setSubmitting(false);
        }
    };

    const handleMenus = async () => {
        try {
            const menus = await getRoleMenus();
            sessionStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menus));

            setStatus(Status.SUCCESS);
            navigate(routes.task.home.path);

        } catch (error) {

            if(error.code === 'ERR_NETWORK') {
                setMsgError('Error de conexión. Verifique su conexión a internet.');
            } else {
                setMsgError('No es posible obtener los menús. Intente nuevamente.');
            }
            setStatus(Status.ERROR);
        }
    };

    return (
        <div className='container-login u-bg-white'>

            <div className='container-form'>
                <div className='u-d-flex u-d-flex-column u-d-flex-gap-3 u-card u-card--shadow u-bg-white-pure'>
                    <div className='u-card__content'>
                    <div className='u-text-center u-mt-3 u-text-muted'>
                        <small>Versión {process.env.REACT_APP_VERSION}</small>
                    </div>
                        <h1 className='u-text-center'>DrClin</h1>
                        <div className='u-text-center'>
                            <img src={logo} alt="DrClin Logo" className='logo' />
                        </div>

                        <div className='u-mb-2'>
                            {status === Status.ERROR && (
                                <div className="error-text u-mt-1">
                                    {msgError}
                                </div>
                            )}
                        </div>

                        <Formik
                            initialValues={{
                                username: '',
                                password: '',
                            }}
                            validationSchema={loginSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, isValid, dirty }) => (
                                
                                <Form className='form' autoComplete="off">
                                    <div>
                                        <div className='u-d-flex u-d-flex-gap-2 u-d-flex-align-center u-d-flex-justify-flex-start u-mb-1'>
                                            <FaUser className="u-icon-x16" /> <label htmlFor="username">Usuario</label>
                                        </div>
                                        <Field
                                            className="form-control"
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                        />
                                        <ErrorMessage
                                            className="form-control error-text"
                                            name="username"
                                            component="div"
                                        />
                                    </div>
                                    <div>
                                        <div className='u-d-flex u-d-flex-gap-2 u-d-flex-align-center u-d-flex-justify-flex-start u-mb-1'>
                                            <FaKey className="u-icon-x16" /> <label htmlFor="password">Contraseña</label>
                                        </div>
                                        
                                        <Field
                                            className="form-control"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                        />
                                        <ErrorMessage
                                            className="form-control error-text"
                                            name="password"
                                            component="div"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || status === 'loading' || !isValid || !dirty}
                                            className='u-btn u-btn--large u-btn-primary '
                                        >
                                            {status === 'loading' ? 'Iniciando...' : 'Iniciar'}
                                        </button>
                                    </div>

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
