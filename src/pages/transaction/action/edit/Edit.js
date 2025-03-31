import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill-new';
import validationSchema from '../AddEdit.validate';
import { getPaymentTypes } from '../../../../api/paymentType';
import { getTransaction, updateTransaction } from '../../../../api/transaction';
import 'react-quill-new/dist/quill.snow.css';
import './Edit.scss';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import Loader from '../../../../components/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '../../../../routes';

const EditTransaction = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await getPaymentTypes();
        setPaymentTypes(types);
        const data = await getTransaction(id);
        setTransactionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const initialValues = {
    user_id: transactionData ? transactionData.user_id : '',
    detail: transactionData ? transactionData.detail : '',
    amount: transactionData ? transactionData.amount : '',
    paymentType: transactionData ? transactionData.payment_type_id.toString() : '',
    transactionType: transactionData ? transactionData.transaction_type : '',
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

      await updateTransaction(id, payload);
      resetForm();
      alert('Transacción actualizada exitosamente.');
      navigate(routes.transaction.list.path);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Hubo un error al actualizar la transacción.');
    }
  };

  if (isLoading) {
    return (
      <div className='container u-mt-4 u-mb-8'>
        <div className='row'>
          <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        <div className='col-12 col-md-6 col-lg-4'>
          <h1 className='form-title u-mb-4'>Editar Transacción</h1>
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
                  <ErrorMessage name='detail' component='div' className='error-text' />
                </div>

                <div className='form-group'>
                  <label htmlFor='amount'>Monto:</label>
                  <Field id='amount' name='amount' type='number' className='form-control' placeholder='0.00' />
                  <ErrorMessage name='amount' component='div' className='error-text' />
                </div>

                <div className='form-group'>
                  <label htmlFor='paymentType'>Tipo de pago:</label>
                  <Field id='paymentType' name='paymentType' as='select' className='form-control'>
                    <option value=''>Seleccione un tipo de pago</option>
                    {paymentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name='paymentType' component='div' className='error-text' />
                </div>

                <div className='form-group'>
                  <label>Tipo de transacción:</label>
                  <div role='group' className='radio-group'>
                    <label>
                      <Field type='radio' name='transactionType' value='IN' className='radio-input' />
                      <FaPlusCircle /> Entrada
                    </label>
                    <label>
                      <Field type='radio' name='transactionType' value='OUT' className='radio-input' />
                      <FaMinusCircle /> Salida
                    </label>
                  </div>
                  <ErrorMessage name='transactionType' component='div' className='error-text' />
                </div>

                <div className='form-group'>
                  <button type='submit' disabled={isSubmitting} className='btn btn-primary'>
                    {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
