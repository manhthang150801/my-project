import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../../common/alert/Modal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";

const UpdateAccountPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    roles: []
  });

  const [rolesList, setRolesList] = useState([]);
  const [errors, setErrors] = useState({ username: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const fetchAccountAndRoles = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');

        const [userRes, rolesRes] = await Promise.all([
          fetch(`${apiUrl}/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${apiUrl}/roles`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (userRes.status === 401 || rolesRes.status === 401) {
          setResponseText("jwt_error");
          openModal("Thông báo", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", true);
          setIsLoading(false);
          return;
        }

        const userData = await userRes.json();
        const rolesData = await rolesRes.json();

        setFormData({
          username: userData.username,
          email: userData.email,
          roles: userData.roles.map(role => role.id)
        });
        setRolesList(rolesData);
      } catch (err) {
        openModal("Lỗi", "Có lỗi xảy ra khi tải dữ liệu.", true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountAndRoles();
  }, [apiUrl, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (roleId) => {
    setFormData(prev => {
      const isSelected = prev.roles.includes(roleId);
      return {
        ...prev,
        roles: isSelected
          ? prev.roles.filter(id => id !== roleId)
          : [...prev.roles, roleId]
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username không được để trống.";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/users`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
          id,
          username: formData.username,
          email: formData.email,
          roles: formData.roles
        })
      });

      const result = await response.json();

      if (response.status === 401) {
        setResponseText(result.detail);
        openModal("Thông báo", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.", true);
        return;
      }

      if (formData.username == localStorage.getItem('username')) {
        setResponseText("invalid_token");
      }

      if (result.message === "user_existed") {
        openModal("Thông báo", "Tên đăng nhập đã được sử dụng.", true);
      } else if (result.message === "email_existed") {
          openModal("Thông báo", "Email đã được sử dụng.", true);
      }else if (result.message === "updated") {
        openModal("Thành công", "Cập nhật tài khoản thành công!", false);
      } else {
        openModal("Lỗi", "Cập nhật không thành công.", true);
      }
    } catch (err) {
      openModal("Lỗi", "Có lỗi xảy ra khi cập nhật.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate(-1);

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!isError) navigate(-1);

    if (responseText === "invalid_token" || responseText === "jwt_error") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("roles");
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <SpinnerLoad />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Cập Nhật Tài Khoản</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nhập username"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nhập email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Phân quyền</label>
          {rolesList.map(role => (
            <div key={role.id} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={`role-${role.id}`}
                checked={formData.roles.includes(role.id)}
                onChange={() => handleCheckboxChange(role.id)}
                className="mr-2"
              />
              <label htmlFor={`role-${role.id}`}>{role.name}</label>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Cập nhật
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Hủy
          </button>
        </div>
      </div>

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

export default UpdateAccountPage;
