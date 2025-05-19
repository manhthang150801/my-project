import { FaBriefcase, FaPaintBrush, FaMicroscope, FaUsers, FaTools, FaBalanceScale } from "react-icons/fa";
import riasec from '../../../assets/riasec.jpg';
import { useNavigate } from "react-router-dom";

const categories = [
    { id: "R", title: "Nhóm Người Kỹ Thuật", color: "text-red-600", icon: <FaTools />, description: "Thích làm với những vật cụ thể, máy móc, dụng cụ, cây cối, con vật hoặc các hoạt động ngoài trời." },
    { id: "I", title: "Nhóm Người Nghiên Cứu", color: "text-orange-500", icon: <FaMicroscope />, description: "Thích quan sát, tìm tòi, điều tra, phân tích, đánh giá hoặc giải quyết vấn đề." },
    { id: "A", title: "Nhóm Người Nghệ Thuật", color: "text-red-500", icon: <FaPaintBrush />, description: "Có khả năng nghệ thuật, sáng tạo, trực giác và thích làm việc trong các tình huống không có kế hoạch trước nhưng đề cao tư tưởng tượng và sáng tạo." },
    { id: "S", title: "Nhóm Người Xã Hội", color: "text-green-500", icon: <FaUsers />, description: "Thích làm việc cung cấp hoặc làm sáng tỏ thông tin, thích giúp đỡ, huấn luyện, chữa trị hoặc chăm sóc sức khỏe cho người khác, có khả năng về ngôn ngữ." },
    { id: "E", title: "Nhóm Người Quản Lý", color: "text-blue-500", icon: <FaBalanceScale />, description: "Thích làm việc với những người khác, có khả năng tác động, thuyết phục, thể hiện, lãnh đạo người khác để đạt các mục tiêu của tổ chức, các lợi ích kinh tế." },
    { id: "C", title: "Nhóm Người Nghiệp Vụ", color: "text-purple-500", icon: <FaBriefcase />, description: "Thích làm việc với dữ liệu, con số, có khả năng làm việc văn phòng, thông tin, các công việc chi tiết, có hệ thống, lặp đi lặp lại, chặt chẽ hoặc làm theo hướng dẫn của người khác." },
];

const HomePages = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-4 px-4">
            <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg p-6 md:p-10">
                <h2 className="text-center text-gray-700 font-semibold text-lg md:text-xl uppercase">
                    Trắc Nghiệm Định Hướng Nghề Nghiệp Holland Code Test (RIASEC)
                </h2>

                <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h3 className="text-blue-600 font-bold text-lg md:text-xl">
                            Trắc Nghiệm Định Hướng Nghề Nghiệp Holland Code Test (RIASEC)
                        </h3>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Trắc nghiệm Holland giúp bạn xác định sở thích, năng lực tự nhiên 
                            và tìm ra nhóm ngành phù hợp nhất với mình.
                        </p>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                            Kết quả giúp bạn xác định <b>3 mật mã Holland</b>, từ đó tìm được công việc 
                            phù hợp nhất với cá tính và khả năng của bạn.
                        </p>
                    </div>


                    <div className="md:w-1/2 flex justify-center">
                        <img src={riasec} alt="RIASEC Model" 
                             className="w-4/5 max-w-xs md:max-w-sm rounded-lg shadow-md"/>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button onClick={() => navigate('survey-page')} className="bg-blue-500 text-white font-semibold text-sm md:text-base px-6 py-2 rounded-full hover:bg-blue-600 transition">
                        Bắt đầu
                    </button>
                </div>
            </div>

            <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg mt-8 p-6 md:p-10">
                <h3 className="text-center text-gray-700 font-semibold text-lg md:text-xl">
                    Các nhóm ngành trong Mật Mã Holland
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {categories.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b pb-3">
                            <div className={`text-3xl ${item.color}`}>{item.icon}</div>
                            <div>
                                <h4 className={`font-semibold ${item.color} text-lg`}>{item.title}</h4>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white max-w-6xl w-full rounded-xl shadow-lg mt-8 p-6 md:p-10">
                <h3 className="text-center text-gray-700 font-semibold text-lg md:text-xl">
                    Giải Thích Về Mật Mã Holland (RIASEC)
                </h3>
                <p className="text-gray-600 mt-3 text-sm md:text-base">
                    Mô hình RIASEC của John Holland chia con người thành 6 nhóm chính dựa trên sở thích nghề nghiệp. 
                    Mỗi người thường thuộc từ 1 đến 3 nhóm, tạo thành mật mã Holland cá nhân.
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-3 text-sm md:text-base">
                    <li><b>R - Realistic (Kỹ thuật):</b> Yêu thích công việc thực tế, liên quan đến máy móc, xây dựng, thể thao.</li>
                    <li><b>I - Investigative (Nghiên cứu):</b> Đam mê khám phá, phân tích và giải quyết vấn đề.</li>
                    <li><b>A - Artistic (Nghệ thuật):</b> Sáng tạo, thích nghệ thuật, âm nhạc, diễn xuất.</li>
                    <li><b>S - Social (Xã hội):</b> Giúp đỡ, dạy học, tư vấn hoặc làm việc với con người.</li>
                    <li><b>E - Enterprising (Quản lý):</b> Lãnh đạo, thuyết phục, kinh doanh.</li>
                    <li><b>C - Conventional (Nghiệp vụ):</b> Tổ chức, làm việc với dữ liệu, kế toán, văn phòng.</li>
                </ul>
            </div>
        </div>
    );
}

export default HomePages;
