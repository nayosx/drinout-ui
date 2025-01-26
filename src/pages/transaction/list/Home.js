import React, { useEffect, useState, useCallback } from 'react';
import { getTransactions } from '../../../api/transaction';
import './Home.scss';

export const HomeTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    user_id: '',
    start_date: '',
    end_date: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Obtener usuario actual desde sessionStorage
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

  return (
    <div className="home-container">
      <h1 className="home-title">Transacciones</h1>
      <p>¡Bienvenido a la página de transacciones!</p>

      {/* Formulario para filtros */}
      <form className="filter-form" onSubmit={handleFilterSubmit}>
        <div>
          <label htmlFor="start_date">Fecha de Inicio:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={filters.start_date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="end_date">Fecha de Fin:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={filters.end_date}
            onChange={handleInputChange}
          />
        </div>
        <div className="filter-buttons">
          <button type="submit">Filtrar</button>
          <button type="button" onClick={handleClearFilters}>
            Limpiar filtros
          </button>
          <button
            type="button"
            onClick={handleSetUserFilter}
            className="btn-user-filter"
          >Mis movimientos</button>
        </div>
      </form>

      {/* Tabla de transacciones */}
      {isLoading ? (
        <p>Cargando transacciones...</p>
      ) : (
        <table className="transactions-table">
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
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.user_id}</td>
                  <td>{transaction.transaction_type}</td>
                  <td>{transaction.payment_type_id}</td>
                  <td>{transaction.detail}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No se encontraron transacciones.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
