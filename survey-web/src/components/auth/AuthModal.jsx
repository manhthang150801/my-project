import React, { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import Login from './Login';
import Signin from './Signin';

const AuthModal = ({ isOpen, toggle, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSuccess = (username) => {
    localStorage.setItem("username", username);
    onLoginSuccess(username);
    toggle();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-gray-200 p-6 rounded-lg w-96 relative">
        <button 
          onClick={toggle} 
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700">
          <FaWindowClose />
        </button>

        {isLogin ? (
          <Login  
            toggleForm={toggleForm}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Signin  
            toggleForm={toggleForm}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
