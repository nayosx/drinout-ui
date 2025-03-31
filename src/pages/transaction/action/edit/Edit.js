import React, { useEffect, useState } from 'react';
import TransactionForm from '../TransactionForm';
import { getPaymentTypes } from '../../../../api/paymentType';
import { getTransaction, updateTransaction } from '../../../../api/transaction';
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
          <h1 className="form-title u-mb-4">Editar Transacción</h1>
        </div>
        <div className='col-12 col-md-6 col-lg-4'>
          <TransactionForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            paymentTypes={paymentTypes}
            submitLabel="Actualizar"
          />
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
