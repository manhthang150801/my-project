import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SpinnerLoad from "../../common/loading/SpinnerLoad";
import Modal from '../../common/alert/Modal';

const Login = ({toggleForm, onLoginSuccess }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
      const newErrors = {};
      if (!formData.username) newErrors.username = "Tên đăng nhập là bắt buộc";
      if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
        ...formData,
        [name]: value,
    });

    setErrors({
        ...errors,
        [name]: '',
    });
  };

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);

      try { 
        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const responseData = await response.json();

          localStorage.setItem("token", responseData.token);
          localStorage.setItem("username", responseData.username);
          localStorage.setItem("roles", JSON.stringify(responseData.roles));

          onLoginSuccess(responseData.username);
        } else {
          openModal("Thông báo", "Tên đăng nhập hoặc mật khẩu không đúng.", true);
        }
      }  catch (error) {
        openModal('Lỗi', 'Có lỗi xảy ra.', true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <SpinnerLoad />
        </div>
      )}
      <h2 className="text-center text-2xl font-semibold mb-4">Đăng nhập</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
        <input type="text" className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-green-500'} rounded-md`} placeholder="Tên đăng nhập" name="username" value={formData.username} onChange={handleChange}/>
        {errors.username && <p className="text-red-500">{errors.username}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-green-500'} rounded-md pr-10`} placeholder="Mật khẩu" name="password" value={formData.password} onChange={handleChange}/>
          {showPassword ? (
            <FaEyeSlash onClick={togglePasswordVisibility} className="text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" />
          ) : (
            <FaEye onClick={togglePasswordVisibility} className="text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" />
          )}
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>

      <button onClick={handleSubmit} type="submit" className="w-full bg-green-500 text-white py-2 rounded-md">Đăng nhập</button>
        <p className="mt-4 text-center text-sm text-gray-600">
        Không có tài khoản? 
        <span onClick={toggleForm} className="text-blue-600 cursor-pointer">Tạo tài khoản ở đây</span>
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isError={isError}
      />
    </div>
  );
};

export default Login;
