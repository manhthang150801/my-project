import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../../common/alert/Modal";
import ConfirmModal from "../../../common/alert/ConfirmModal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";
import { useNavigate } from "react-router-dom";

const ListQuestionPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [questionIdToDelete, setQuestionIdToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 401) {
        const message = await response.json();
        setResponseText(message.detail);
        openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/update-question/${id}`);
  };

  const handleDelete = (id) => {
    setQuestionIdToDelete(id);
    setIsOpenConfirm(true);
  };

  const confirmDelete = async () => {
    setIsOpenConfirm(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/questions/${questionIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 401) {
        const message = await response.json();
        setResponseText(message.detail);
        openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        setQuestions(questions.filter(question => question.id !== questionIdToDelete));
        openModal('Thành công', 'Xóa thành công!', false);
      } else {
        openModal('Lỗi', 'Xóa không thành công.', true);
      }
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi xóa.', true);
    } finally {
      setIsLoading(false);
      setQuestionIdToDelete(null);
    }
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

      <div className="container mx-auto p-1">
        <div className="bg-white p-1 rounded shadow-md w-full">
            <h2 className="text-2xl mb-4 text-gray-800">Danh Sách Câu Hỏi</h2>
            <div className="overflow-x-auto">
            <table className="w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Tên Câu Hỏi</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Loại</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Chủ Đề</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Sửa</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question.id}>
                      <td className="py-2 px-4 border-b">{question.question}</td>
                      <td className="py-2 px-4 border-b">{question.type}</td>
                      <td className="py-2 px-4 border-b">{question.topicName}</td>
                      <td className="py-2 px-4 border-b">
                      <button
                          onClick={() => handleEdit(question.id)}
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <FaEdit />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleDelete(question.id)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FaTrash />
                          <span className="hidden sm:inline">Xóa</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa câu hỏi này không?"
      />

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

export default ListQuestionPage;