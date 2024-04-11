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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/CreatePasswordEntry" element={<CreatePasswordEntryPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;