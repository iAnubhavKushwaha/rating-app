// src/components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Store Rating App</h1>
      <button 
        onClick={handleLoginClick} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default HomePage;