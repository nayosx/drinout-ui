import './App.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Me from './pages/profile/Me';
import routes from './routes';

const isAuthenticated = () => !!sessionStorage.getItem('authToken');

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path={routes.home} element={<Login />} />
        <Route path={routes.me} element={<ProtectedRoute element={<Me />} />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
