import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../../common/alert/Modal";
import ConfirmModal from "../../../common/alert/ConfirmModal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";
import { useNavigate } from "react-router-dom";

const ListAnswerPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [answerIdToDelete, setAnswerIdToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/answers`, {
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
      setAnswers(data);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/update-answer/${id}`);
  };

  const handleDelete = (id) => {
    setAnswerIdToDelete(id);
    setIsOpenConfirm(true);
  };

  const confirmDelete = async () => {
    setIsOpenConfirm(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/answers/${answerIdToDelete}`, {
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
        setAnswers(answers.filter(answer => answer.id !== answerIdToDelete));
        openModal('Thành công', 'Xóa thành công!', false);
      } else {
        openModal('Lỗi', 'Xóa không thành công.', true);
      }
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi xóa.', true);
    } finally {
      setIsLoading(false);
      setAnswerIdToDelete(null);
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
            <h2 className="text-2xl mb-4 text-gray-800">Danh Sách Câu Trả Lời</h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Tên Câu Trả Lời</th>
                    <th className="py-2 px-4 border-b">Giá Trị</th>
                    <th className="py-2 px-4 border-b">Sửa</th>
                    <th className="py-2 px-4 border-b">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer) => (
                    <tr key={answer.id}>
                      <td className="py-2 px-4 border-b">{answer.answerName}</td>
                      <td className="py-2 px-4 border-b">{answer.answerValue}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(answer.id)}
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <FaEdit />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleDelete(answer.id)}
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
        message="Bạn có chắc chắn muốn xóa câu trả lời này không?"
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

export default ListAnswerPage;