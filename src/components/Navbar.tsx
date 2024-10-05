import React, { useState } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa'; // Importing the logout icon
import { auth } from '../firebaseConfig'; // Import your Firebase config
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

interface NavbarProps {
    onToggleSidebar: () => void;
    onLogout: () => void; // Add onLogout to the props
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate(); // Initialize the navigate function

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
            onLogout(); // Call the onLogout function
            navigate('/login'); // Navigate to the login page
        } catch (error) {
            console.error("Logout error: ", error);
        }
    };

    return (
        <header className="bg-gray-900 text-white flex items-center justify-between p-4 z-50 relative">
            <button onClick={onToggleSidebar} className="text-white focus:outline-none">
                <FaBars className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold md:text-2xl">ANAP Dashboard</h1>
            <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
                    {/* Use a logout icon instead of user info */}
                    <FaSignOutAlt className="text-2xl" />
                    <span className="ml-2">Logout</span> {/* Optional: Add text for clarity */}
                </button>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                        <ul className="py-2">
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
