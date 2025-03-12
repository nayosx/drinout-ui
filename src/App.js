import './App.scss';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Me from './pages/profile/Me';
import routes from './routes';
import Home from './pages/home/Home';
import { HomeTransaction } from './pages/transaction/list/Home';
import AddTransaction from './pages/transaction/action/add/Add';
import NotFound from './pages/NotFound';
import SimpleLayout from './layouts/Simple.layout';
import MainLayout from './layouts/Main.layout';
import useNavbarStore from './store/useNavbarStore';

const isAuthenticated = () => !!sessionStorage.getItem('authToken');

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to={routes.login} />;
};

function App() {
  const setTitle = useNavbarStore((state) => state.setTitle);

  return (
    <Router>
      <Routes>

        <Route path={routes.login} element={<SimpleLayout><Login /></SimpleLayout>} />
        <Route path={routes.notFound} element={<SimpleLayout><NotFound /></SimpleLayout>} />

        <Route 
          path={routes.home} 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home setTitle={setTitle} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={routes.me} 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Me setTitle={setTitle} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={routes.transaction.list} 
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomeTransaction setTitle={setTitle} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path={routes.transaction.add} 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddTransaction setTitle={setTitle} />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
