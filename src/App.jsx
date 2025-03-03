import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import AuthenticationLayout from './pages/AuthenticationLayout';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OneTimePassword from './pages/OneTimePassword/OneTimePassword';
import OpenRoute from './components/OpenRoute';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

function App() {


  return (
    <div className='mainRoot'>
      <Routes>
        
        <Route path="/" element={<AuthenticationLayout />}> 
          <Route path="/" element={<OpenRoute><Login /></OpenRoute>}/>
          <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>}/>
          <Route path="/verify-email" element={<OpenRoute><OneTimePassword /></OpenRoute>}/>
          <Route path="/forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>}/>
        </Route>
        <Route path="/admin" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}/>
        {/* <Route /> */}
        {/* <Route /> */}
        {/* <Route /> */}
      </Routes>
      
    </div>
  )
}

export default App
