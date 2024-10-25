import React from 'react';
import AuthPage from './pages/AuthPage';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import { AuthProvider, useAuth } from './context/AuthContext';
import History from './pages/History';

// PrivateRoute component to protect the Home page
const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/auth" />;
};

// PrivateRoute for Signup (allows access only if not authenticated)
const SignupRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? element : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route path="/history" element={<PrivateRoute element={<History/>} />} />

          <Route path="/auth" element={<SignupRoute element={<AuthPage />} />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
