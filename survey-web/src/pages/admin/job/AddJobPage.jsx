import React, { useState } from "react";
import Modal from "../../../common/alert/Modal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";

const AddJobPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({ jobCode: "", jobName: "" });
  const [errors, setErrors] = useState({ jobCode: "", jobName: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { jobCode: "", jobName: "" };

    if (!formData.jobCode.trim()) {
      newErrors.jobCode = "Mã nghề nghiệp không được để trống.";
      valid = false;
    } else if (formData.jobCode.length > 50) {
      newErrors.jobCode = "Mã nghề nghiệp không được dài quá 50 ký tự.";
      valid = false;
    }

    if (!formData.jobName.trim()) {
      newErrors.jobName = "Tên nghề nghiệp không được để trống.";
      valid = false;
    } else if (formData.jobName.length > 100) {
      newErrors.jobName = "Tên nghề nghiệp không được dài quá 100 ký tự.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/jobs`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });

        if (response.status === 401) {
          const message = await response.json();
          setResponseText(message.detail);
          openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
          setIsLoading(false);
          return;
        }

        const responseData = await response.json();

        if (responseData && responseData.message === "saved") {
          openModal("Thành công", "Lưu thành công!", false);
        } else {
          openModal("Lỗi", "Lưu không thành công.", true);
        }
      } catch (error) {
        openModal("Lỗi", "Có lỗi xảy ra.", true);
      } finally {
        handleCancel();
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ jobCode: "", jobName: "" });
    setErrors({ jobCode: "", jobName: "" });
  };

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);

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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Thêm Nghề Nghiệp
        </h2>
        <div>
          <div className="mb-4">
            <label htmlFor="jobCode" className="block text-gray-700 font-medium mb-2">
              Mã Nghề Nghiệp
            </label>
            <input
              type="text"
              id="jobCode"
              name="jobCode"
              value={formData.jobCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập mã nghề nghiệp"
            />
            {errors.jobCode && <p className="text-red-500 text-sm mt-2">{errors.jobCode}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="jobName" className="block text-gray-700 font-medium mb-2">
              Tên Nghề Nghệp
            </label>
            <input
              type="text"
              id="jobName"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập tên nghề nghiệp"
            />
            {errors.jobName && <p className="text-red-500 text-sm mt-2">{errors.jobName}</p>}
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Lưu
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

export default AddJobPage;
