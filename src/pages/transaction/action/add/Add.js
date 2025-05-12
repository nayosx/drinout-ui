import React, { useEffect, useState } from 'react';
import TransactionForm from '../TransactionForm';
import { getPaymentTypes } from '../../../../api/paymentType';
import { createTransaction } from '../../../../api/transaction';
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
    category_id: '',
  };
  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        user_id: values.user_id,
        transaction_type: values.transactionType,
        payment_type_id: parseInt(values.paymentType, 10),
        category_id: values.category_id ? parseInt(values.category_id, 10) : null,
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
  

  if (isLoading) {
    return (
      <div className="container u-mt-4 u-mb-8">
        <div className='row'>
          <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container u-mt-4 u-mb-8">
      <div className='row'>
        <div className='col-12'>
          <h1 className="form-title u-mb-4">Agregar Transacción</h1>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <TransactionForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            paymentTypes={paymentTypes}
            submitLabel="Guardar"
          />
        </div>
      </div>
      
    </div>
  );
};

export default AddTransaction;
