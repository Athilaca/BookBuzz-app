import React from 'react'
import './Signup.css';
import { useState,useEffect } from 'react';
import axios from 'axios';

const Login = () => {
   const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
   const [error, setError] = useState(null);
   const [csrfToken, setCsrfToken] = useState('');


//    useEffect(() => {
//     fetchCsrfToken();
//   }, []);

//   const fetchCsrfToken = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
//       setCsrfToken(response.data.csrfToken);
//     } catch (error) {
//       console.error('Failed to fetch CSRF token:', error);
//     }
//   };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     try {
      const response = await axios.post('http://127.0.0.1:8000/login/', formData, 
      // {
      //   headers: {
      //     'X-CSRFToken': csrfToken
      //   }}
        );      
      console.log('Login successful:', response.data);
       
      // Handle success (e.g., show success message, redirect user)
    } catch (error) {
      console.error('Login failed:', error.response.data);
       setError(error.response.data);
    }
  };
  return ( 
  <div className="signup-form-container">
    <h4>Login</h4>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
        
  {error && <p style={{ color: 'red' }}>{error.message}</p>}

      </form>
  </div>
  )
}
export default Login
