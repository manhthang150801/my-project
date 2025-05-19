import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../../common/alert/Modal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";

const UpdateInterestPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    netSocCode: "",
    title: "",
    elementId: "",
    elementName: "",
    scaleId: "",
    scaleName: "",
    dataValue: ""
  });
  const [errors, setErrors] = useState({
    netSocCode: "",
    title: "",
    elementId: "",
    elementName: "",
    scaleId: "",
    scaleName: "",
    dataValue: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const fetchInterest = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/interests/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
          const message = await response.json();
          setResponseText(message.detail);
          openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data) {
          setFormData({
            netSocCode: data.netSocCode,
            title: data.title,
            elementId: data.elementId,
            elementName: data.elementName,
            scaleId: data.scaleId,
            scaleName: data.scaleName,
            dataValue: data.dataValue
          });
        } else {
          openModal("Lỗi", "Không tìm thấy sở thích.", true);
        }
      } catch (error) {
        openModal("Lỗi", "Có lỗi xảy ra khi tải dữ liệu.", true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterest();
  }, [id, apiUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.netSocCode.trim()) {
      newErrors.netSocCode = "NetSoc Code không được để trống.";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title không được để trống.";
    }
    if (!formData.elementId.trim()) {
      newErrors.elementId = "Element ID không được để trống.";
    }
    if (!formData.elementName.trim()) {
      newErrors.elementName = "Element Name không được để trống.";
    }
    if (!formData.scaleId.trim()) {
      newErrors.scaleId = "Scale ID không được để trống.";
    }
    if (!formData.scaleName.trim()) {
      newErrors.scaleName = "Scale Name không được để trống.";
    }
    if (!formData.dataValue.trim()) {
      newErrors.dataValue = "Data Value không được để trống.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/interests`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, ...formData }),
        });

        if (response.status === 401) {
          const message = await response.json();
          setResponseText(message.detail);
          openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
          setIsLoading(false);
          return;
        }

        const responseData = await response.json();
        if (responseData && responseData.message === "updated") {
          openModal("Thành công", "Cập nhật thành công!", false);
        } else {
          openModal("Lỗi", "Cập nhật không thành công.", true);
        }
      } catch (error) {
        openModal("Lỗi", "Có lỗi xảy ra khi cập nhật.", true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!isError) navigate(-1);

    if (responseText == "invalid_token" || responseText == "jwt_error") {
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Cập Nhật Sở Thích</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="netSocCode" className="block text-gray-700 font-medium mb-2">
              NetSoc Code
            </label>
            <input
              type="text"
              id="netSocCode"
              name="netSocCode"
              value={formData.netSocCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập NetSoc Code"
            />
            {errors.netSocCode && <p className="text-red-500 text-sm mt-2">{errors.netSocCode}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="elementId" className="block text-gray-700 font-medium mb-2">
              Element ID
            </label>
            <input
              type="text"
              id="elementId"
              name="elementId"
              value={formData.elementId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập Element ID"
            />
            {errors.elementId && <p className="text-red-500 text-sm mt-2">{errors.elementId}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="elementName" className="block text-gray-700 font-medium mb-2">
              Element Name
            </label>
            <input
              type="text"
              id="elementName"
              name="elementName"
              value={formData.elementName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập Element Name"
            />
            {errors.elementName && <p className="text-red-500 text-sm mt-2">{errors.elementName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="scaleId" className="block text-gray-700 font-medium mb-2">
              Scale ID
            </label>
            <input
              type="text"
              id="scaleId"
              name="scaleId"
              value={formData.scaleId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập Scale ID"
            />
            {errors.scaleId && <p className="text-red-500 text-sm mt-2">{errors.scaleId}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="scaleName" className="block text-gray-700 font-medium mb-2">
              Scale Name
            </label>
            <input
              type="text"
              id="scaleName"
              name="scaleName"
              value={formData.scaleName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập Scale Name"
            />
            {errors.scaleName && <p className="text-red-500 text-sm mt-2">{errors.scaleName}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="dataValue" className="block text-gray-700 font-medium mb-2">
              Data Value
            </label>
            <input
              type="text"
              id="dataValue"
              name="dataValue"
              value={formData.dataValue}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập Data Value"
            />
            {errors.dataValue && <p className="text-red-500 text-sm mt-2">{errors.dataValue}</p>}
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleUpdate}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Cập Nhật
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200"
            >
              Hủy
            </button>
          </div>
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

export default UpdateInterestPage;