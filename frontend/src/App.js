import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; 
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage'; 
import DashboardPage from './components/DashboardPage';
import CreatePasswordEntryPage from './components/CreatePasswordEntryPage';
import IncomingShareRequests from './components/IncomingShareRequests';
import RequireAuth from './components/RequireAuth';
import MyPasswordEntries from './components/MyPasswordEntries';
import SearchPage from './components/SearchPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 

        {/* Protected routes */}
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/create" element={<RequireAuth><CreatePasswordEntryPage /></RequireAuth>} />
        <Route path="/share-requests" element={<RequireAuth><IncomingShareRequests /></RequireAuth>} />
        <Route path="/mypasswords" element={<RequireAuth><MyPasswordEntries /></RequireAuth>} />
        <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />


      </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;