import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WMS from './pages/WMS';
import ShipperPortal from './pages/ShipperPortal';
import Analytics from './pages/Analytics';
import AlertSettings from './pages/AlertSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'driver']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wms"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <WMS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alert-settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AlertSettings />
                </ProtectedRoute>
              }
            />
            <Route path="/shipper-portal" element={<ShipperPortal />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
