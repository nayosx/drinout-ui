import React, { useState } from 'react';
import logo from '../../assets/images/logo.jpeg';
import './Login.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import loginSchema from './Login.validate';
import { login } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey } from 'react-icons/fa';
import routes from '../../routes';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        try {
            await login(values);
            navigate(routes.task.home.path);
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
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
                                            disabled={isSubmitting || isLoading || !isValid || !dirty}
                                            className='u-btn u-btn--large u-btn-primary '
                                        >
                                            {isLoading ? 'Iniciando...' : 'Iniciar'}
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
