import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill-new';
import validationSchema from '../AddEdit.validate';
import { getPaymentTypes } from '../../../../api/paymentType';
import { createTransaction } from '../../../../api/transaction';
import 'react-quill-new/dist/quill.snow.css';
import './Add.scss';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import Loader from '../../../../components/Loader';
import { useNavigate } from 'react-router-dom';
import routes from '../../../../routes';

const AddTransaction = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const types = await getPaymentTypes();
        setPaymentTypes(types);
        const userData = sessionStorage.getItem('user');

        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching payment types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentTypes();
  }, []);

  const initialValues = {
    user_id: user ? user.id : '',
    detail: '',
    amount: '',
    paymentType: '',
    transactionType: '',
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        user_id: values.user_id,
        transaction_type: values.transactionType,
        payment_type_id: parseInt(values.paymentType, 10),
        detail: values.detail,
        amount: parseFloat(values.amount).toFixed(2),
      };

      await createTransaction(payload);
      resetForm();
      alert('Transacción creada exitosamente.');

      navigate(routes.transaction.list.path);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Hubo un error al crear la transacción.');
    }
  };

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        {isLoading ? (
          <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
            <Loader />
          </div>
        ) : (
          <div className='col-12 col-md-6 col-lg-4'>
            <h1 className='form-title u-mb-4'>Agregar Transacción</h1>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className='form'>
                  <div className='form-group'>
                    <label htmlFor='detail'>Descripción:</label>
                    <ReactQuill
                      theme='snow'
                      value={values.detail}
                      onChange={(value) => setFieldValue('detail', value)}
                      className='react-quill'
                    />
                    <ErrorMessage
                      name='detail'
                      component='div'
                      className='error-text'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='amount'>Monto:</label>
                    <Field
                      id='amount'
                      name='amount'
                      type='number'
                      className='form-control'
                      placeholder='0.00'
                    />
                    <ErrorMessage
                      name='amount'
                      component='div'
                      className='error-text'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='paymentType'>Tipo de pago:</label>
                    <Field
                      id='paymentType'
                      name='paymentType'
                      as='select'
                      className='form-control'
                    >
                      <option value=''>Seleccione un tipo de pago</option>
                      {paymentTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name='paymentType'
                      component='div'
                      className='error-text'
                    />
                  </div>

                  <div className='form-group'>
                    <label>Tipo de transacción:</label>
                    <div role='group' className='radio-group'>
                      <label>
                        <Field
                          type='radio'
                          name='transactionType'
                          value='IN'
                          className='radio-input'
                        />
                        <FaPlusCircle /> Entrada
                      </label>
                      <label>
                        <Field
                          type='radio'
                          name='transactionType'
                          value='OUT'
                          className='radio-input'
                        />
                        <FaMinusCircle /> Salida
                      </label>
                    </div>
                    <ErrorMessage
                      name='transactionType'
                      component='div'
                      className='error-text'
                    />
                  </div>

                  <div className='form-group'>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='btn btn-primary'
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;
