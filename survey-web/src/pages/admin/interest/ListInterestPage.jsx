import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../../common/alert/Modal";
import ConfirmModal from "../../../common/alert/ConfirmModal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";
import { useNavigate } from "react-router-dom";

const ListInterestPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [interestIdToDelete, setInterestIdToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");

  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchInterests(currentPage, pageSize);
  }, [interestIdToDelete, currentPage, pageSize]);

  const fetchInterests = async (page = 0, size = pageSize) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const skip = page * size;
      const response = await fetch(`${apiUrl}/interests?skip=${skip}&limit=${size}`, {
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

      if (data && Array.isArray(data.content)) {
        setInterests(data.content);

        if (data.totalCount) {
          const totalPages = Math.ceil(data.totalCount / size);
          setTotalPages(totalPages);
        }
      } else {
        setInterests([]);
      }

      setCurrentPage(page);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (id) => {
    navigate(`/dashboard/update-interest/${id}`);
  };

  const handleDelete = (id) => {
    setInterestIdToDelete(id);
    setIsOpenConfirm(true);
  };

  const confirmDelete = async () => {
    setIsOpenConfirm(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/interests/${interestIdToDelete}`, {
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
        openModal('Thành công', 'Xóa thành công!', false);
      } else {
        openModal('Lỗi', 'Xóa không thành công.', true);
      }
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi xóa.', true);
    } finally {
      setIsLoading(false);
      setInterestIdToDelete(null);
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <SpinnerLoad />
        </div>
      )}

      <div className="container mx-auto p-1">
        <div className="bg-white p-1 rounded shadow-md w-full">
            <h2 className="text-2xl mb-4 text-gray-800">Danh Sách Sở Thích</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b whitespace-nowrap">NetSoc Code</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Title</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Element ID</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Element Name</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Scale ID</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Scale Name</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Data Value</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Sửa</th>
                    <th className="py-2 px-4 border-b whitespace-nowrap">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {interests.map((interest) => (
                    <tr key={interest.id}>
                      <td className="py-2 px-4 border-b">{interest.netSocCode}</td>
                      <td className="py-2 px-4 border-b">{interest.title}</td>
                      <td className="py-2 px-4 border-b">{interest.elementId}</td>
                      <td className="py-2 px-4 border-b">{interest.elementName}</td>
                      <td className="py-2 px-4 border-b">{interest.scaleId}</td>
                      <td className="py-2 px-4 border-b">{interest.scaleName}</td>
                      <td className="py-2 px-4 border-b">{interest.dataValue}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleEdit(interest.id)}
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                          <FaEdit />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleDelete(interest.id)}
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
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 0}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-4 py-2">{`Trang ${currentPage + 1} / ${totalPages}`}</span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa sở thích này không?"
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

export default ListInterestPage;
