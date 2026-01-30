import { Outlet } from "react-router-dom";
import ParentHeader from "../components/Header/ParentHeader";
import ParentSidebar from "../components/Sidebar/ParentSidebar";
import './ParentLayout.css';

const ParentLayout = () => {
    return (
        <div className="parent-layout">
            <ParentSidebar />
            <div className="parent-layout-main">
                <ParentHeader />
                <div className="parent-layout-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ParentLayout;
