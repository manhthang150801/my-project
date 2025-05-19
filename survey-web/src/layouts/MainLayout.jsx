import { Outlet } from "react-router-dom";
import Navbar from "../components/user/Navbar";

const MainLayout = () => {
    return (
        <div className="overflow-x-hidden bg-white text-dark relative">
            <div className="relative">
                <Navbar/>
            </div>
            <div className="mt-16">
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;