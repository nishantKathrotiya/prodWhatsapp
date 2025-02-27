import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import AuthenticationLayout from './pages/AuthenticationLayout';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OneTimePassword from './pages/OneTimePassword/OneTimePassword';

function App() {


  return (
    <div className='mainRoot'>
      <Routes>
        
        <Route path="/" element={<AuthenticationLayout />}> 
          <Route path="/" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/validate" element={<OneTimePassword />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
        </Route>
        {/* <Route /> */}
        {/* <Route /> */}
        {/* <Route /> */}
      </Routes>
      
    </div>
  )
}

export default App
