import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../common/alert/Modal';

  const DashboardPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [countInfo, setCountInfo] = useState(0);
    const [countJobRecommend, setCountJobRecommend] = useState(0);
    const [countUser, setCountUser] = useState(0);
    const [countJob, setCountJob] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
      fetchDashboard();
    }, []);
  
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/dashboard`, {
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
        setCountInfo(data.information);
        setCountJobRecommend(data.jobRecommend);
        setCountUser(data.user);
        setCountJob(data.job);
      } catch (error) {
        openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
      } finally {
        setIsLoading(false);
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
  
      if (responseText === "invalid_token" || responseText === "jwt_error") {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        navigate("/");
      }
    };

    const formatNumber = (number) => {
      return new Intl.NumberFormat('en-US').format(number);
    }

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Chào mừng bạn trở lại 👋</h1>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Tổng người khảo sát</p>
            <p className="text-2xl font-bold">{formatNumber(countInfo)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Kết quả đã gợi ý</p>
            <p className="text-2xl font-bold">{formatNumber(countJobRecommend)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Tổng tài khoản</p>
            <p className="text-2xl font-bold">{formatNumber(countUser)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            <p className="text-sm text-gray-500">Tổng nghề nghiệp</p>
            <p className="text-2xl font-bold">{formatNumber(countJob)}</p>
          </div>
        </div>
  
        {/* Recent Users
        <div>
          <h2 className="text-lg font-medium mb-2">Người dùng vừa hoàn thành khảo sát</h2>
          <div className="space-y-2">
            {recentUsers.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white shadow rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">Nghề gợi ý: {user.result}</p>
                </div>
                <p className="text-sm text-gray-400">{user.date}</p>
              </div>
            ))}
          </div>
        </div> */}
  
        <div className="flex flex-wrap gap-4 mt-6">
          <button onClick={() => navigate('/survey-page')} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            Tạo khảo sát mới
          </button>
          <button onClick={() => navigate('training-data')} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
            Xem tất cả kết quả
          </button>
          <button onClick={() => navigate('list-question')} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
            Quản lý câu hỏi
          </button>
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
  
  export default DashboardPage;
  