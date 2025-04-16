import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import validationSchema from './AddEdit.validate';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './TransactionForm.scss';

const TransactionForm = ({ initialValues, onSubmit, paymentTypes, submitLabel }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="form">
          <div className="form-group">
            <label htmlFor="detail">Descripción:</label>
            <ReactQuill
              theme="snow"
              value={values.detail}
              onChange={(value) => setFieldValue('detail', value)}
              className="react-quill"
            />
            <ErrorMessage name="detail" component="div" className="error-text" />
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
            <Field id="paymentType" name="paymentType" as="select" className="form-control">
              <option value="">Seleccione un tipo de pago</option>
              {paymentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="paymentType" component="div" className="error-text" />
          </div>

          <div className="form-group">
            <label>Tipo de transacción:</label>
            <div role="group" className="radio-group">
              <label className='u-pr-3 u-d-flex-inline u-d-flex-align-center '>
                <Field type="radio" name="transactionType" value="IN" className="radio-input" />
                <FaPlusCircle className='u-text-green-20 u-ml-1' /> <span>Pago</span>
              </label>
              <label className='u-d-flex-inline u-d-flex-align-center'>
                <Field type="radio" name="transactionType" value="OUT" className="radio-input" />
                <FaMinusCircle className='u-text-red-20 u-ml-1' /> <span>Gasto</span>
              </label>
            </div>
            <ErrorMessage name="transactionType" component="div" className="error-text" />
          </div>

          <div className="form-group">
            <button type="submit" disabled={isSubmitting} className="u-btn u-btn-primary">
              {isSubmitting ? 'Guardando...' : submitLabel}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TransactionForm;
