import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        navigate("/");
    };
    return (
        <div className="w-full px-4 h-16 flex justify-between items-center border-gray-300 bg-blue-600 text-white shadow-md z-40">
            <Link to="/" className="flex items-center text-lg font-bold space-x-2">
                <FaHome size={20} />
                <span>Trang chính</span>
            </Link>

            <div className="flex items-center space-x-4">
                <button onClick={handleLogout} className="flex items-center space-x-2 text-lg">
                    <FaSignOutAlt />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;