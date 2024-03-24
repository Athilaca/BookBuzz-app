import React, { useState } from 'react';
import './Signup.css'
import axios from 'axios';


const Signup = () => {
     const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
   const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     try {
      const response = await axios.post('http://127.0.0.1:8000/signup/', formData);      
      console.log('Signup successful:', response.data);
      // Handle success (e.g., show success message, redirect user)
    } catch (error) {
      console.error('Signup failed:', error.response.data);
       setError(error.response.data);
    }
  };
  return ( 
  <div className="signup-form-container">
    <h4>Sigup for BookBuzz</h4>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Sign Up</button>
        
  {error && <p style={{ color: 'red' }}>{error.message}</p>}

      </form>
  </div>
  )
}

export default Signup
