import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getPaymentTypes } from '../../../../api/paymentType';
import './Add.scss';

const AddTransaction = () => {
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const types = await getPaymentTypes();
        setPaymentTypes(types);
      } catch (error) {
        console.error('Error fetching payment types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentTypes();
  }, []);

  const initialValues = {
    description: '',
    amount: '',
    paymentType: '',
  };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria.'),
    amount: Yup.number()
      .required('El monto es obligatorio.')
      .positive('El monto debe ser mayor a 0.')
      .max(9999999, 'El monto no puede exceder 9,999,999.')
      .test(
        'max-decimals',
        'El monto solo puede tener hasta 2 decimales.',
        (value) => /^\d+(\.\d{1,2})?$/.test(value)
      ),
    paymentType: Yup.string().required('Debe seleccionar un tipo de pago.'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    console.log('Valores del formulario:', values);
    resetForm();
  };

  return (
    <div className="add-transaction-container">
      <h1 className="form-title">Agregar Transacción</h1>

      {isLoading ? (
        <p>Cargando tipos de pago...</p>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <div className="form-group">
                <label htmlFor="description">Descripción:</label>
                <Field
                  id="description"
                  name="description"
                  type="text"
                  className="form-control"
                  placeholder="Descripción de la transacción"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error-text"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Monto:</label>
                <Field
                  id="amount"
                  name="amount"
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                />
                <ErrorMessage name="amount" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="paymentType">Tipo de pago:</label>
                <Field
                  id="paymentType"
                  name="paymentType"
                  as="select"
                  className="form-control"
                >
                  <option value="">Seleccione un tipo de pago</option>
                  {paymentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="paymentType"
                  component="div"
                  className="error-text"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddTransaction;
