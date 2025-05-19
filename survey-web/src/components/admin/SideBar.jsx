import React, { useState } from 'react';
import { FaAtlas, FaBars, FaBitbucket, FaBook, FaBookReader, FaDatabase, FaHome, FaList, FaMoneyBill, FaPinterest, FaPlus, FaPlusCircle, FaQuestionCircle, FaSubscript, FaTimes, FaUsers, FaUsersCog } from 'react-icons/fa';
import { FaCircleMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <div>
            <div className="md:hidden h-16 p-5 bg-gray-800 text-white flex justify-between items-center">
                <h1 className="text-xl font-bold hidden sm:block">Menu</h1>
                <button onClick={toggleSidebar} aria-label="Toggle Menu">
                    <FaBars size={24} />
                </button>
            </div>

            <div
                className={`fixed top-0 left-0 h-screen bg-gray-800 text-white w-full transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 md:relative md:translate-x-0 md:w-48 lg:w-64 z-50 md:z-0`}
            >
                <div className="p-4 relative">
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 text-white md:hidden"
                    >
                        <FaTimes size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Menu</h2>
                    <ul>
                        <li className="mb-2">
                            <Link
                                to="/dashboard"
                                className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <FaHome /> <span>Trang chủ</span>
                            </Link>
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('topic')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaBook />
                                <span>Chủ đề</span>
                            </div>
                            <span>{openMenus['topic'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['topic'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-topic"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('topic');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-topic"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('topic');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('question')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaQuestionCircle />
                                <span>Câu hỏi</span>
                            </div>
                            <span>{openMenus['question'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['question'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-question"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('question');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-question"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('question');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('answer')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaBookReader />
                                <span>Trả lời</span>
                            </div>
                            <span>{openMenus['answer'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['answer'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-answer"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('answer');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-answer"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('answer');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('interest')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaPinterest />
                                <span>Sở thích</span>
                            </div>
                            <span>{openMenus['interest'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['interest'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-interest"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('interest');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-interest"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('interest');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('job')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaAtlas />
                                <span>Nghề nghiệp</span>
                            </div>
                            <span>{openMenus['job'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['job'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-job"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('job');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-job"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('job');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('education')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaSubscript />
                                <span>Học vấn</span>
                            </div>
                            <span>{openMenus['education'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['education'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-education"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('education');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-education"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('education');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('income')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaMoneyBill />
                                <span>Thu nhập</span>
                            </div>
                            <span>{openMenus['income'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['income'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/add-income"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('income');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/list-income"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('income');
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('training')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaBitbucket />
                                <span>Huấn luyện</span>
                            </div>
                            <span>{openMenus['training'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['training'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/training-data"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('training');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaDatabase /> <span>Dữ liệu</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('account')}
                            >
                            <div className="flex items-center space-x-2">
                                <FaUsers />
                                <span>Tài khoản</span>
                            </div>
                            <span>{openMenus['account'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['account'] && (
                                <ul className="ml-4 mt-2">
                                    <li>
                                        <Link
                                            to="/dashboard/account"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                toggleMenu('account');
                                                setIsOpen(false);
                                            }}
                                        >
                                             <FaUsersCog /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div> 
        </div>
    );
};

export default SideBar;