import React, { useEffect, useState } from "react";
import { FaDownload, FaTrash } from "react-icons/fa";
import Modal from "../../../common/alert/Modal";
import ConfirmModal from "../../../common/alert/ConfirmModal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";
// import * as XLSX from "xlsx"; 
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

const TrainingDataPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [datatrains, setDataTrain] = useState([]);
  const [dataFile, setDataFile] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [dataTrainIdToDelete, setDataTrainIdToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");

  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchDataTrain(currentPage, pageSize);
  }, [dataTrainIdToDelete, currentPage, pageSize]);

  const fetchDataTrain = async (page = 0, size = pageSize) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const skip = page * size;
      const response = await fetch(`${apiUrl}/get-data-train?skip=${skip}&limit=${size}`, {
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
        setDataTrain(data.content);

        if (data.totalCount) {
          const totalPages = Math.ceil(data.totalCount / size);
          setTotalPages(totalPages);
        }
      } else {
        setDataTrain([]);
      }

      setCurrentPage(page);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDataTrainIdToDelete(id);
    setIsOpenConfirm(true);
  };

  const confirmDelete = async () => {
    setIsOpenConfirm(false);
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/informations/${dataTrainIdToDelete}`, {
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
      setDataTrainIdToDelete(null);
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

  const transformDataForCSV = (data) => {
    return data.map((item) => {
      let transformed = {
        GUID: item.id,
        age: item.age,
        gender: item.gender,
        education: item.education,
        income: item.income,
        employed: item.employed,
        jobCode: item.jobCode,
        profession: item.profession,
      };

      item.listAnswer.forEach((answer, index) => {
        transformed[`question${index + 1}`] = answer.selected_answer;
      });

      item.listJobcomment.forEach((job, index) => {
        transformed[`suggested_code${index + 1}`] = job.jobrecommendCode;
        transformed[`suggested_job${index + 1}`] = job.jobrecommendValue;
      });

      return transformed;
    });
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/get-file`, {
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
      setDataFile(data);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataFile && dataFile.length > 0) {
      handleDownloadFile();
    }
  }, [dataFile]);

  const handleDownloadFile = () => {
    const formattedData = transformDataForCSV(dataFile);
    const csvContent = '\uFEFF' + Papa.unparse(formattedData);
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // const handleDownloadFile = () => {
  //   const formattedData = transformDataForCSV(dataFile);
  
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Training Data");
  
  //   XLSX.writeFile(workbook, "training_data.xlsx");
  // }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <SpinnerLoad />
        </div>
      )}

      <div className="container mx-auto p-1">
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4 flex items-center gap-2"
      >
        <FaDownload /> Tải dữ liệu
      </button>
        <div className="bg-white p-1 rounded shadow-md w-full">
            <h2 className="text-2xl mb-4 text-gray-800">Dữ liệu huấn luyện</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Giới tính</th>
                    <th className="py-2 px-4 border-b">Tuổi</th>
                    <th className="py-2 px-4 border-b">Học vấn</th>
                    <th className="py-2 px-4 border-b">Thu nhập</th>
                    <th className="py-2 px-4 border-b">Việc làm</th>
                    <th className="py-2 px-4 border-b">Mã nghề</th>
                    <th className="py-2 px-4 border-b">Nghề nghiệp</th>

                    {datatrains.length > 0 && 
                      datatrains[0].listAnswer.map((_, index) => (
                        <th key={`question-${index}`} className="py-2 px-4 border-b">
                          Câu {index + 1}
                        </th>
                      ))
                    }
                    {datatrains.length > 0 && 
                      datatrains[0].listJobcomment.map((_, index) => (
                        <React.Fragment key={`job-header-${index}`}>
                          <th className="py-2 px-4 border-b">Mã nghề {index + 1}</th>
                          <th className="py-2 px-4 border-b">Nghề nghiệp {index + 1}</th>
                        </React.Fragment>
                      ))
                    }
                    <th className="py-2 px-4 border-b">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {datatrains.map((data) => (
                    <tr key={data.id}>
                      <td className="py-2 px-4 border-b">{data.id}</td>
                      <td className="py-2 px-4 border-b">{data.gender}</td>
                      <td className="py-2 px-4 border-b">{data.age}</td>
                      <td className="py-2 px-4 border-b">{data.education}</td>
                      <td className="py-2 px-4 border-b">{data.income}</td>
                      <td className="py-2 px-4 border-b">{data.employed}</td>
                      <td className="py-2 px-4 border-b">{data.jobCode}</td>
                      <td className="py-2 px-4 border-b">{data.profession}</td>

                      {data.listAnswer.map((answer, index) => (
                        <td key={`answer-${data.id}-${index}`} className="py-2 px-4 border-b">
                          {answer.selected_answer}
                        </td>
                      ))}

                      {data.listJobcomment.map((job, index) => (
                        <React.Fragment key={`job-data-${data.id}-${index}`}>
                          <td className="py-2 px-4 border-b">{job.jobrecommendCode}</td>
                          <td className="py-2 px-4 border-b">{job.jobrecommendValue}</td>
                        </React.Fragment>
                      ))}

                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleDelete(data.id)}
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

export default TrainingDataPage;
