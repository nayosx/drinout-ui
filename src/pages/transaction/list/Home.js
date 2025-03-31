import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions } from '../../../api/transaction';
import DOMPurify from 'dompurify';
import './Home.scss';
import Loader from '../../../components/Loader';

export const HomeTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    user_id: '',
    start_date: '',
    end_date: '',
  });
  const [expandedDetails, setExpandedDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const filteredTransactions = await getTransactions(filters);
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({
      user_id: '',
      start_date: '',
      end_date: '',
    });
    fetchTransactions();
  };

  const handleSetUserFilter = () => {
    if (currentUser) {
      setFilters((prev) => ({ ...prev, user_id: currentUser.id }));
    }
  };

  const truncateHTML = (html, maxLength) => {
    const cleanText = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    return `${cleanText.slice(0, maxLength)}...`;
  };

  const toggleDetail = (id) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        <div className='col-12 col-md-8'>
          <h1 className='home-title'>Transacciones</h1>
          <p>¡Bienvenido a la página de transacciones!</p>

          <form className='filter-form' onSubmit={handleFilterSubmit}>
            <div>
              <label htmlFor='start_date'>Fecha de Inicio:</label>
              <input
                type='date'
                id='start_date'
                name='start_date'
                value={filters.start_date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor='end_date'>Fecha de Fin:</label>
              <input
                type='date'
                id='end_date'
                name='end_date'
                value={filters.end_date}
                onChange={handleInputChange}
              />
            </div>
            <div className='filter-buttons'>
              <button type='button' onClick={handleClearFilters}>
                Limpiar filtros
              </button>
              <button
                type='button'
                onClick={handleSetUserFilter}
                className='btn-user-filter'
              >
                Mis movimientos
              </button>
            </div>
          </form>
        </div>

        {isLoading ? (
          <div className='col-12 u-d-flex u-d-flex-justify-center u-d-flex-align-center'>
            <Loader />
          </div>
        ) : (
          <div className='col-12'>
            <table className='transactions-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Tipo de Transacción</th>
                  <th>Tipo de Pago</th>
                  <th>Detalle</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction.id}>
                      <td>{index + 1}</td>
                      <td>{transaction.user_name}</td>
                      <td>
                        <span
                          className={
                            transaction.transaction_type === 'IN'
                              ? 'u-bg-green-20 u-text-white u-pl-1 u-pr-1'
                              : transaction.transaction_type === 'OUT'
                              ? 'u-bg-red-20 u-text-white u-pl-1 u-pr-1'
                              : ''
                          }
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>
                      <td>{transaction.payment_type_name}</td>
                      <td>
                        {expandedDetails[transaction.id] ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(transaction.detail),
                            }}
                          />
                        ) : (
                          <div>{truncateHTML(transaction.detail, 30)}</div>
                        )}
                        <button
                          onClick={() => toggleDetail(transaction.id)}
                          className='btn-view-more'
                        >
                          {expandedDetails[transaction.id]
                            ? 'Ver menos'
                            : 'Ver más'}
                        </button>
                      </td>
                      <td>${transaction.amount}</td>
                      <td>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='7'>No se encontraron transacciones.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
