import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/admin/SideBar';
import Navbar from '../components/admin/Navbar';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <div className="hidden md:block md:w-48 lg:w-64 bg-gray-800 text-white flex-shrink-0">
                <SideBar />
            </div>
            <div className="flex-1 flex flex-col">
                <div className="md:hidden flex">
                    <SideBar className="w-48 bg-gray-800 text-white flex-shrink-0" />
                    <Navbar />
                </div>
                <div className="hidden md:block">
                    <Navbar />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;