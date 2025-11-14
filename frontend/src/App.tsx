import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/shared/layout/MainLayout';
import PrimaryDashboardPage from './pages/primary/PrimaryDashboardPage';
import SecondaryDashboardPage from './pages/secondary/SecondaryDashboardPage';
import LoginPage from './pages/shared/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PrimaryDashboardPage />} />
          <Route path="primary" element={<PrimaryDashboardPage />} />
          <Route path="secondary" element={<SecondaryDashboardPage />} />
          <Route path="threats" element={<div>Threat Monitor - Coming Soon</div>} />
          <Route path="audit" element={<div>Audit Trail - Coming Soon</div>} />
          <Route path="settings" element={<div>Settings - Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;