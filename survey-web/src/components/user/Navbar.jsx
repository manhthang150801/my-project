import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import logo from "../../assets/logo.png";
import AuthModal from "../auth/AuthModal";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    const roles = storedRoles ? JSON.parse(storedRoles) : [];
    setIsAdmin(roles.includes("ADMIN"));
  }, [username]);

  const handleLoginSuccess = (username) => {
    setUsername(username);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAuthPopup = () => {
    setIsAuthModalOpen(!isAuthModalOpen);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");

    setUsername("");
    setIsAdmin(false);
    navigate("/");
  }

  return (
    <nav className="bg-blue-600 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-16 h-16" />
          <Link to="/" className="text-white font-bold text-lg">Hướng Nghiệp</Link>
        </div>

        <div className="md:hidden flex items-center">
          <button type="button" className="text-white hover:text-gray-200 focus:outline-none" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className="text-white hover:text-gray-200 font-medium text-xl">Trang chủ</Link>
          <Link to="/survey-page" className="text-white hover:text-gray-200 font-medium text-xl">Khảo sát</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative group flex items-center">
            {username ? (
              <>
                <FaUser className="text-white w-6 h-6 mr-2" />
                <button className="text-white hover:text-gray-200 font-medium text-xl">{username}</button>
                <div className="absolute left-0 top-full mt-1 w-40 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                {isAdmin && (
                  <Link to="/dashboard" className="block px-4 py-2 text-black hover:bg-gray-200">Quản lý</Link>
                )}
                  {/* <Link to="/settings" className="block px-4 py-2 text-black hover:bg-gray-200">Cài đặt</Link> */}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200">
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <button onClick={toggleAuthPopup} className="text-white hover:text-gray-200 font-medium text-xl">Đăng nhập</button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-500 text-white space-y-4 px-4 py-2 absolute top-16 left-0 w-full shadow-lg z-50">
          <Link to="/" className="block hover:text-gray-200" onClick={toggleMobileMenu}>Trang chủ</Link>
          <Link to="/survey-page" className="block hover:text-gray-200" onClick={toggleMobileMenu}>Khảo sát</Link>
          
          <div>
            {username ? (
              <>
                <button className="block w-full text-left hover:text-gray-200" onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}>{username}</button>
                {isManagementDropdownOpen && (
                  <div className="ml-4">
                  {isAdmin && (  
                    <Link to="/dashboard" className="block px-4 py-2 hover:text-gray-200" onClick={toggleMobileMenu}>Quản lý</Link>
                  )}
                    {/* <Link to="/settings" className="block px-4 py-2 hover:text-gray-200" onClick={toggleMobileMenu}>Cài đặt</Link> */}
                    <button className="block w-full text-left px-4 py-2 hover:text-gray-200" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => { toggleAuthPopup (); toggleMobileMenu() }} className="block w-full text-left hover:text-gray-200">Đăng nhập</button>
            )}
          </div>
        </div>
      )}
      <AuthModal isOpen={isAuthModalOpen} toggle={toggleAuthPopup} onLoginSuccess={handleLoginSuccess} />
    </nav>
  );
};

export default Navbar;