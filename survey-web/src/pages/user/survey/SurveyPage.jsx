import React, { useState, useEffect } from "react";
import Modal from "../../../common/alert/Modal";
import SpinnerLoad from "../../../common/loading/SpinnerLoad";
import { FaCheckCircle, FaHandPointRight } from "react-icons/fa";

const SurveyPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showSurvey, setShowSurvey] = useState(false);
  const [userInfo, setUserInfo] = useState({
    gender: "",
    age: "",
    education: "",
    income: "",
    employed: "",
    profession: "",
    vernacular: ""
  });
  const [educationOptions, setEducationOptions] = useState([]);
  const [incomeOptions, setIncomeOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]);
  const [surveyResult, setSurveyResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfessionOptions, setFilteredProfessionOptions] = useState(professionOptions);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchQuestions(currentPage, pageSize);
    }, [currentPage, pageSize]);

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchAnswers();
      fetchEducationOptions();
      fetchIncomeOptions();
      fetchProfessionOptions();
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu.', true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchQuestions = async (page = 0, size = pageSize) => {
    setIsLoading(true);
    try {
      const skip = page * size;
      const response = await fetch(`${apiUrl}/guest/questions?skip=${skip}&limit=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data && Array.isArray(data.content)) {
        setQuestions(data.content);

        if (data.totalCount) {
          const totalPages = Math.ceil(data.totalCount / size);
          setTotalPages(totalPages);
        }
      } else {
        setQuestions([]);
      }

      setCurrentPage(page);
    } catch (error) {
      openModal('Lỗi', 'Có lỗi xảy ra khi tải dữ liệu câu hỏi.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnswers = async () => {
    const response = await fetch(`${apiUrl}/guest/answers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setAnswers(data || []);
  };

  const fetchEducationOptions = async () => {
    const response = await fetch(`${apiUrl}/guest/educations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setEducationOptions(data || []);
  };

  const fetchIncomeOptions = async () => {
    const response = await fetch(`${apiUrl}/guest/incomes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setIncomeOptions(data || []);
  };

  const fetchProfessionOptions = async () => {
    const response = await fetch(`${apiUrl}/guest/jobs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setProfessionOptions(data || []);
    setFilteredProfessionOptions(data || []); 
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });

    setValidationErrors({
      ...validationErrors,
      [name]: '',
    });
  };

  const handleAnswerChange = (questionId, answerId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerId });

    setValidationErrors({
      ...validationErrors,
      [questionId]: '',
    });
  };

  const handleNext = () => {
    if (validateUserInfo()) {
      setShowSurvey(true);
    }
  };

  const handleBack = () => {
    setShowSurvey(false);
  };

  const handleSubmit = async () => {
    if (validateUserInfo() && validateSurvey()) {
      setIsLoading(true);

      const surveyData = {
        user_info: userInfo,
        selected_answers: selectedAnswers,
      };

      try {
        const response = await fetch(`${apiUrl}/survey-res`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(surveyData),
        });

        const responseData = await response.json();

        if (response.ok && responseData.averageScores && responseData.predictedRiasecType && responseData.jobRecommendations) {
          setSurveyResult(responseData);
        } else {
          openModal('Lỗi', responseData.message || 'Gửi khảo sát không thành công.', true);
        }
      } catch (error) {
        openModal('Lỗi', 'Có lỗi xảy ra khi gửi khảo sát.', true);
      } finally {
        setIsLoading(false);
        handleCancel();
      }
    }
  };

  const validateUserInfo = () => {
    const errors = {};
    if (!userInfo.gender) errors.gender = 'Vui lòng chọn giới tính.';
    if (!userInfo.age) {
      errors.age = 'Vui lòng nhập tuổi.';
    } else if (userInfo.age < 1 || userInfo.age > 100) {
      errors.age = 'Tuổi phải từ 1 đến 100.';
    }
    if (!userInfo.education) errors.education = 'Vui lòng chọn trình độ học vấn.';
    if (!userInfo.income) errors.income = 'Vui lòng chọn mức thu nhập.';
    if (!userInfo.employed) errors.employed = 'Vui lòng chọn tình trạng đi làm.';
    if (!userInfo.profession) errors.profession = 'Vui lòng chọn nghề nghiệp.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSurvey = () => {
    const errors = {};
    questions.forEach((question) => {
      if (!selectedAnswers[question.id]) {
        errors[question.id] = 'Vui lòng chọn một câu trả lời.';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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

  const handleCancel = () => {
    setUserInfo({
      gender: "",
      age: "",
      education: "",
      income: "",
      employed: "",
      profession: "",
      vernacular: "",
    });

    setSearchQuery("");
    setFilteredProfessionOptions(professionOptions);

    setSelectedAnswers({});
    setValidationErrors({});
    setShowSurvey(false);
    setCurrentPage(0);
    setTotalPages(0);
  };
  
  const handleBackSurvey = () => {
    setShowSurvey(false); 
    setSurveyResult(null); 
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = professionOptions.filter(option =>
      option.jobName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProfessionOptions(filtered);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <SpinnerLoad />
        </div>
      )}
      {!surveyResult ? (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-md md:max-w-2xl">
          {!showSurvey ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Thông tin cá nhân</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Giới tính:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="0" onChange={handleUserInfoChange} className="accent-indigo-500" checked={userInfo.gender === "0"} /> Nam
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gender" value="1" onChange={handleUserInfoChange} className="accent-indigo-500" checked={userInfo.gender === "1"} /> Nữ
                  </label>
                </div>
                {validationErrors.gender && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.gender}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Tuổi:</label>
                <input type="number" name="age" onChange={handleUserInfoChange} className="border rounded-lg p-3 w-full" placeholder="Vui lòng nhập tuổi của bạn" value={userInfo.age} />
                {validationErrors.age && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.age}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Trình độ học vấn:</label>
                <select name="education" onChange={handleUserInfoChange} className="border rounded-lg p-3 w-full" value={userInfo.education}>
                  <option value="" disabled>Chọn trình độ học vấn</option>
                  {educationOptions.map((option) => (
                    <option key={option.id} value={option.educationCode}>{option.educationName}</option>
                  ))}
                </select>
                {validationErrors.education && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.education}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Thu nhập hiện tại hoặc mong muốn:</label>
                <select name="income" onChange={handleUserInfoChange} className="border rounded-lg p-3 w-full" value={userInfo.income}>
                  <option value="" disabled>Chọn mức thu nhập</option>
                  {incomeOptions.map((option) => (
                    <option key={option.id} value={option.incomeCode}>{option.incomeName}</option>
                  ))}
                </select>
                {validationErrors.income && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.income}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Bạn có đang đi làm không?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="employed" value="yes" onChange={handleUserInfoChange} className="accent-indigo-500" checked={userInfo.employed === "yes"} /> Có
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="employed" value="no" onChange={handleUserInfoChange} className="accent-indigo-500" checked={userInfo.employed === "no"} /> Không
                  </label>
                </div>
                {validationErrors.employed && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.employed}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">{userInfo.employed === "yes" ? "Nghề nghiệp của bạn?" : "Nghề nghiệp mơ ước của bạn?"}</label>
                <input
                  type="text"
                  placeholder="Tìm kiếm nghề nghiệp..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border rounded-lg p-3 w-full mb-2"
                />
                <select name="profession" onChange={handleUserInfoChange} className="border rounded-lg p-3 w-full" value={userInfo.profession}>
                  <option value="" disabled>Chọn nghề nghiệp</option>
                  {filteredProfessionOptions.map((option) => (
                    <option key={option.id} value={option.jobCode}>{option.jobName}</option>
                  ))}
                </select>
                {validationErrors.profession && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.profession}</p>
                )}
              </div>
              <div className="flex justify-center">
                <button onClick={handleNext} className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition">Tiếp theo</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Khảo sát</h2>
              <div className="text-center text-gray-700 mb-6 font-medium">
                <p>Hãy xem danh sách các hoạt động sau đây và đánh giá mức độ bạn <strong className="font-bold">MUỐN</strong> thực hiện từng hoạt động.</p>
                <p className="mt-2">1 = Rất không thích; 4 = Trung lập; 7 = Rất thích</p>
              </div>
              {questions.map((question, index) => (
                <div key={question.id} className="mb-5">
                  <h3 className="block text-gray-700 font-medium mb-2">
                    {`${index + 1}. ${question.question}`}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {answers.map((answer) => (
                      <div key={answer.id} className="flex items-center">
                        <input
                          type="radio"
                          id={`question-${question.id}-answer-${answer.id}`}
                          name={`question-${question.id}`}
                          value={answer.id}
                          checked={selectedAnswers[question.id] === answer.id}
                          onChange={() => handleAnswerChange(question.id, answer.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`question-${question.id}-answer-${answer.id}`} className="text-gray-600">
                          {answer.answerName}
                        </label>
                      </div>
                    ))}
                  </div>
                  {validationErrors[question.id] && (
                    <p className="text-red-500 text-sm mt-2">{validationErrors[question.id]}</p>
                  )}
                </div>
              ))}
              
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
                  onClick={() => {if (validateSurvey()) { setCurrentPage(currentPage + 1);}}}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-400 disabled:cursor-not-allowed "
                >
                  Sau
                </button>
              </div>
              <>
                {
                  currentPage + 1 === totalPages && (
                    <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
                >
                  Gửi
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"  
                >
                  Hủy
                </button>
              </div>
                )}
                </>
              
            </>
          )}
        </div>
      ): (
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-full sm:max-w-md md:max-w-2xl">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <FaCheckCircle className="text-green-500 text-3xl" />
            <h2 className="text-xl font-semibold text-gray-800">Kết quả khảo sát hồ sơ sở thích!</h2>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaHandPointRight className="text-indigo-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-700">Điểm trung bình đã khảo sát theo đặc tính nghề:</h3>
            </div>
          
            <ul className="list-inside list-disc pl-5">
              {surveyResult.averageScores.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.topicName}: {item.score}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <FaHandPointRight className="text-indigo-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-700">Nghề nghiệp bạn đã chọn:</h3>
            </div>
            <p className="text-gray-700 pl-5">
              {surveyResult.professionSelected} với đặc tính <span className="font-bold">{surveyResult.topicSelected}</span>
            </p>
          </div>


          <div className="mb-6 flex items-center space-x-2">
            <FaHandPointRight className="text-indigo-500 text-xl" />
            <h3 className="text-lg font-semibold text-gray-700">Đặc tính nghề phù hợp:</h3>
            <p className="text-gray-700">{surveyResult.predictedRiasecType.topicName}</p>
          </div>

          <div className="mb-6 flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <FaHandPointRight className="text-indigo-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-700">Đánh giá:</h3>
            </div>
            <p className={`pl-5 ${surveyResult.topicSelected === surveyResult.predictedRiasecType.topicName 
                ? "text-green-700" 
                : "text-red-700"}`}>
              {surveyResult.topicSelected === surveyResult.predictedRiasecType.topicName
                ? "Nghề đã chọn phù hợp với bạn. Bạn có thể tham khảo thêm một số ngành nghề đề xuất liên quan!"
                : "Nghề đã chọn có thể chưa phù hợp với bạn. Bạn có thể tham khảo thêm một số ngành nghề đề xuất liên quan!"
              }
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaHandPointRight className="text-indigo-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-700">Nghề gợi ý theo đặc tính nghề phù hợp cho bạn:</h3>
            </div>
            
            <ul className="list-inside list-disc pl-5">
              {surveyResult.jobRecommendations.map((job, index) => (
                <li key={index} className="text-gray-700">
                  {job.jobrecommendValue}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleBackSurvey}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
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

export default SurveyPage;