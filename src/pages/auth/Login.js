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
            navigate(routes.home);
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Usuario o contraseña incorrectos. Intente nuevamente.');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className='container-login'>
            <div className='container-form'>
                <div className='u-d-flex u-d-flex-column u-d-flex-gap-3 u-card u-card--shadow card-login'>
                    <div className='u-card__content'>
                        <h1 className='u-text-center'>Dr KashFlow</h1>
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
                                        <FaUser className="u-icon-x16" /> <label htmlFor="username">Usuario</label>
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
                                        <FaKey className="u-icon-x16" /> <label htmlFor="password">Contraseña</label>
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
                                            className='u-btn u-btn-primary'
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
