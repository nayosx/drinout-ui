import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions } from '../../../api/transaction';
import DOMPurify from 'dompurify';
import './Home.scss';
import Loader from '../../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { BsPiggyBank } from 'react-icons/bs';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { RiBankCardLine } from 'react-icons/ri';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { TbCameraSelfie } from "react-icons/tb";
import { FaCalendar } from "react-icons/fa";
import { MdClear } from "react-icons/md";



export const HomeTransaction = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    user_id: '',
    start_date: '',
    end_date: '',
    transaction_type: '',
  });
  const [expandedDetails, setExpandedDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (userData) setCurrentUser(JSON.parse(userData));
  }, []);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const transactions = await getTransactions({
        user_id: filters.user_id,
        start_date: filters.start_date,
        end_date: filters.end_date
      });
      setAllTransactions(transactions);
      setFilteredTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters.user_id, filters.start_date, filters.end_date]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const applyLocalFilters = useCallback(() => {
    if (filters.transaction_type) {
      setFilteredTransactions(
        allTransactions.filter(t => t.transaction_type === filters.transaction_type)
      );
    } else {
      setFilteredTransactions(allTransactions);
    }
  }, [allTransactions, filters.transaction_type]);

  useEffect(() => {
    applyLocalFilters();
  }, [applyLocalFilters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({ user_id: '', start_date: '', end_date: '', transaction_type: '' });
    setFilteredTransactions(allTransactions);
  };

  const handleSetUserFilter = () => {
    if (currentUser) setFilters(prev => ({ ...prev, user_id: currentUser.id }));
  };

  const handleSetTransactionType = (type) => {
    setFilters(prev => ({ ...prev, transaction_type: type }));
  };

  const truncateHTML = (html, maxLength) => {
    const cleanText = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return cleanText.length <= maxLength ? cleanText : `${cleanText.slice(0, maxLength)}...`;
  };

  const toggleDetail = (id) => {
    setExpandedDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEdit = (id) => {
    navigate(`/transactions/edit/${id}`);
  };

  const renderPaymentIcon = (paymentTypeName) => {
    const lowerType = paymentTypeName?.trim().toLowerCase();
    if (lowerType === 'transferencia') return <BsPiggyBank size={14} />;
    if (lowerType === 'efectivo') return <HiOutlineBanknotes size={14} />;
    if (lowerType === 'tarjeta de credito') return <RiBankCardLine size={14} />;
    return null;
  };

  return (
    <div className='container u-mt-4 u-mb-8'>
      <div className='row'>
        <div className='col-12 col-md-8'>
          <h1 className='home-title'>Transacciones</h1>
          <p>¡Bienvenido a la página de transacciones!</p>
          <form className='' onSubmit={handleFilterSubmit}>
            <div>
              <label htmlFor='start_date'>Fecha de Inicio:</label>
              <input type='date' id='start_date' name='start_date' value={filters.start_date} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor='end_date'>Fecha de Fin:</label>
              <input type='date' id='end_date' name='end_date' value={filters.end_date} onChange={handleInputChange} />
            </div>
            <div className='u-d-flex'>
              <button type='submit' className='u-btn u-btn-secondary u-p-1-all'><FaCalendar /></button>
              <button type='button' className='u-btn u-btn-secondary u-p-1-all' onClick={handleSetUserFilter}><TbCameraSelfie /></button>
              <button type='button' className='u-btn u-btn-secondary-green-20 u-p-1-all' onClick={() => handleSetTransactionType('IN')}><FaPlus /></button>
              <button type='button' className='u-btn u-btn-secondary-red-20 u-p-1-all' onClick={() => handleSetTransactionType('OUT')}><FaMinus /></button>
            </div>
            <div className='u-mt-1'>
              <button type='button' className='u-btn u-btn-red-20 u-p-1-all u-btn--large' onClick={handleClearFilters}>
                <MdClear /> Limpiar Filtros
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
                  <th>Detalle</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={transaction.id}>
                      <td>{filteredTransactions.length - index}</td>
                      <td>{transaction.user_name}</td>
                      <td>
                        {expandedDetails[transaction.id] ? (
                          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(transaction.detail) }} />
                        ) : (
                          <div>{truncateHTML(transaction.detail, 30)}</div>
                        )}
                        <button onClick={() => toggleDetail(transaction.id)} className='btn-view-more'>
                          {expandedDetails[transaction.id] ? 'Ver menos' : 'Ver más'}
                        </button>
                      </td>
                      <td>
                        <div>
                          <div>
                            <span className={transaction.transaction_type === 'OUT' ? 'u-text-red-30' : 'u-text-green-30'}>
                              {transaction.transaction_type === 'OUT' ? '-' : ''}${transaction.amount}
                            </span>
                          </div>
                          <div className='u-d-flex-inline u-d-flex-row u-d-flex-gap-2'>
                            {renderPaymentIcon(transaction.payment_type_name)}
                            <span className={transaction.transaction_type === 'IN'
                              ? 'u-bg-green-20 u-text-white u-pl-2 u-pr-2'
                              : 'u-bg-red-20 u-text-white u-pl-1 u-pr-1'}>
                              {transaction.transaction_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className='btn btn-secondary' onClick={() => handleEdit(transaction.id)}>Editar</button>
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

export default HomeTransaction;
