import './App.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Me from './pages/profile/Me';
import routes from './routes';
import Home  from './pages/home/Home';
import { HomeTransaction } from './pages/transaction/list/Home';
import AddTransaction from './pages/transaction/action/add/Add';
import NotFound from './pages/NotFound';

const isAuthenticated = () => !!sessionStorage.getItem('authToken');

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.home} element={<ProtectedRoute element={<Home />} />} />
        <Route path={routes.me} element={<ProtectedRoute element={<Me />} />} />
        <Route path={routes.transaction.list} element={<ProtectedRoute element={<HomeTransaction />} />} />
        <Route path={routes.transaction.add} element={<ProtectedRoute element={<AddTransaction />} />} />
        <Route path={routes.notFound} element={ <NotFound /> } />
      </Routes>
    </Router>
  );
}

export default App;
