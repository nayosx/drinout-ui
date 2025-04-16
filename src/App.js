import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import WorkSessionReport from './pages/workSession/action/report';
import HomeWorkSession from './pages/workSession/Home';
import EditTransaction from './pages/transaction/action/edit/Edit';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomeTask from './pages/task/Home';

function App() {
  const setTitle = useNavbarStore((state) => state.setTitle);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path={routes.login.path} element={<SimpleLayout><Login /></SimpleLayout>} />
          <Route path={routes.notFound.path} element={<SimpleLayout><NotFound /></SimpleLayout>} />

          <Route 
            path={routes.home.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.me.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Me setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.transaction.list.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeTransaction setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.transaction.add.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddTransaction setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.transaction.edit.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditTransaction setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.workSession.home.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeWorkSession setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={routes.workSession.report.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <WorkSessionReport setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />


          <Route 
            path={routes.task.home.path} 
            element={
              <ProtectedRoute>
                <MainLayout>
                  <HomeTask setTitle={setTitle} />
                </MainLayout>
              </ProtectedRoute>
            } 
          />


        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
