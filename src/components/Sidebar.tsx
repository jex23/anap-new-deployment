import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserCog, FaClipboardList, FaUsers, FaComments } from 'react-icons/fa';

interface SidebarProps {
    isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Home', icon: <FaHome className="text-blue-400" /> },
        { path: '/user-management', label: 'User Management', icon: <FaUserCog className="text-green-400" /> },
        { path: '/job-post', label: 'Job Post', icon: <FaClipboardList className="text-yellow-400" /> },
        { path: '/job-applicants', label: 'Job Applicants', icon: <FaUsers className="text-purple-400" /> }, // Changed to FaUsers
        { path: '/community-post', label: 'Community Posts', icon: <FaComments className="text-red-400" /> }, // Changed to FaComments
    ];

    return (
        <aside className={`bg-gray-800 text-white h-screen shadow-lg rounded-lg transition-all duration-300 fixed top-0 left-0 ${isCollapsed ? 'w-16' : 'w-64'} z-50`}>
            <div className="p-4 border-b border-gray-700 flex flex-col items-center">
                <img
                    src="https://i.ibb.co/w7BYQYQ/appstore-photoaidcom-cropped.png"
                    alt="Anap Logo"
                    className={`transition-all duration-300 ${isCollapsed ? 'h-20 w-auto' : 'h-20 w-auto'}`}
                    style={{
                        objectFit: 'contain',
                    }}
                />
                {!isCollapsed && <h2 className="text-xl font-bold mt-2">Job Finder</h2>}
            </div>
            <nav className="mt-6">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path} className={`transition-all duration-300 rounded-lg ${location.pathname === item.path ? 'bg-gray-700' : ''}`}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-4 text-gray-300 transition duration-200 ${isCollapsed ? 'justify-center' : 'justify-start'} hover:bg-gray-600`}
                            >
                                {item.icon}
                                {!isCollapsed && <span className="ml-3">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
