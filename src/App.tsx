import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import CommunityPost from './pages/CommunityPost';
import JobPost from './pages/JobPost';
import JobApplicants from './pages/JobApplicants';
import Login from './pages/Login';
import Signup from './pages/Signup';
import JobPostDetail from './pages/JobPostDetail'; // Adjust the path
import PostDetails from './pages/PostDetails'; // Adjust the path for PostDetails

const App: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768); // Collapse on small screens
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Initialize as false
    const [loading, setLoading] = useState(true); // Loading state

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsCollapsed(prevState => !prevState);
    };

    // Effect to handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to check local storage for authentication on initial load
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Check for an auth token
        if (token) {
            setIsAuthenticated(true); // User is authenticated if token exists
        }
        setLoading(false); // Stop loading regardless
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove the token from local storage
        setIsAuthenticated(false); // Update local state
    };

    // If loading, show a loading indicator (optional)
    if (loading) {
        return <div>Loading...</div>; // Or some loading spinner
    }

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <div className="flex flex-1">
                    {isAuthenticated ? (
                        <>
                            <Sidebar isCollapsed={isCollapsed} />
                            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                                <Navbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} /> {/* Pass the logout function */}
                                <div className="flex-1">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/user-management" element={<UserManagement />} />
                                        <Route path="/job-post" element={<JobPost />} />
                                        <Route path="/community-post" element={<CommunityPost />} />
                                        <Route path="/job-applicants" element={<JobApplicants />} />
                                        <Route path="/post-details/:id" element={<PostDetails />} /> {/* Add PostDetails route */}
                                        <Route path="*" element={<Navigate to="/" />} />
                                        <Route path="/job-post/:id" element={<JobPostDetail />} />
                                    </Routes>
                                </div>
                                <Footer isCollapsed={isCollapsed} />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1">
                            <Routes>
                                <Route path="/login" element={<Login onLogin={() => {
                                    localStorage.setItem('authToken', 'yourAuthToken'); // Set a token in local storage on login
                                    setIsAuthenticated(true);
                                }} />} /> {/* Pass a function to set authenticated state */}
                                <Route path="/signup" element={<Signup />} />
                                <Route path="*" element={<Navigate to="/login" />} />
                            </Routes>
                        </div>
                    )}
                </div>
            </div>
        </Router>
    );
};

export default App;
