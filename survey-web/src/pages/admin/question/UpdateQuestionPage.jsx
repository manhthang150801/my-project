import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../../../common/alert/Modal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";

const UpdateQuestionPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: "", type: "", topicId: "" });
  const [errors, setErrors] = useState({ question: "", type: "", topicId: "" });
  const [topics, setTopics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/questions/${id}`, {
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
          setFormData({ question: data.question, type: data.type, topicId: data.topicId });
        } else {
          openModal("Lỗi", "Không tìm thấy câu hỏi.", true);
        }
      } catch (error) {
        openModal("Lỗi", "Có lỗi xảy ra khi tải dữ liệu.", true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/topics`, {
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
        setTopics(data);
      } catch (error) {
        openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
    fetchTopics();
  }, [id, apiUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { question: "", type: "", topicId: "" };

    if (!formData.question.trim()) {
      newErrors.question = "Câu hỏi không được để trống.";
      isValid = false;
    }
    if (!formData.type.trim()) {
      newErrors.type = "Loại câu hỏi không được để trống.";
      isValid = false;
    }
    if (!formData.topicId) {
      newErrors.topicId = "Vui lòng chọn chủ đề.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/questions`, {
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Cập Nhật Câu Hỏi</h2>
        <div>
          <div className="mb-4">
            <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
              Câu Hỏi
            </label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập câu hỏi"
            />
            {errors.question && <p className="text-red-500 text-sm mt-2">{errors.question}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Loại Câu Hỏi
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="Nhập loại câu hỏi"
            />
            {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="topicId" className="block text-gray-700 font-medium mb-2">
              Chủ Đề
            </label>
            <select
              id="topicId"
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            >
              <option value="">Chọn chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicName}
                </option>
              ))}
            </select>
            {errors.topicId && <p className="text-red-500 text-sm mt-2">{errors.topicId}</p>}
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

export default UpdateQuestionPage;