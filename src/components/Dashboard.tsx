import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaComments, FaUserTie, FaUser } from 'react-icons/fa'; // Importing icons from react-icons
import { db } from '../firebaseConfig'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';
import ApplicantStatistics from './ApplicantStatistics'; // Import the ApplicantStatistics component
import UserPostFrequencyChart from './UserPostFrequencyChart'; // Import the UserPostFrequencyChart component

const Dashboard: React.FC = () => {
    // State variables to hold counts for various entities
    const [jobPostsCount, setJobPostsCount] = useState(0);
    const [communityPostsCount, setCommunityPostsCount] = useState(0);
    const [jobApplicantsCount, setJobApplicantsCount] = useState(0);
    const [employersCount, setEmployersCount] = useState(0);
    const [applicantsCount, setApplicantsCount] = useState(0);

    // Function to fetch counts from Firestore
    const fetchCounts = async () => {
        try {
            const jobPostsSnapshot = await getDocs(collection(db, 'EmployerJobPost'));
            setJobPostsCount(jobPostsSnapshot.size);

            const communityPostsSnapshot = await getDocs(collection(db, 'posts')); // Updated collection name
            setCommunityPostsCount(communityPostsSnapshot.size);

            const jobApplicantsSnapshot = await getDocs(collection(db, 'Job_Applicants')); // Updated collection name
            setJobApplicantsCount(jobApplicantsSnapshot.size);

            const employersSnapshot = await getDocs(collection(db, 'Employer'));
            setEmployersCount(employersSnapshot.size);

            const applicantsSnapshot = await getDocs(collection(db, 'Applicants'));
            setApplicantsCount(applicantsSnapshot.size);
        } catch (error) {
            console.error("Error fetching counts: ", error);
        }
    };

    useEffect(() => {
        fetchCounts(); // Fetch counts when the component mounts
    }, []);

    return (
        <div className="flex-grow p-5 bg-gray-100">
            <h2 className="text-3xl font-bold mb-5">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card for Job Posts */}
                <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                        <FaBriefcase className="text-indigo-600 text-4xl mr-4" />
                        <h3 className="font-semibold text-xl">Job Posts</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Count: {jobPostsCount}</p>
                    <Link to="/job-post" className="mt-auto text-blue-500 font-semibold">View Details</Link>
                </div>

                {/* Card for Community Posts */}
                <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                        <FaComments className="text-indigo-600 text-4xl mr-4" />
                        <h3 className="font-semibold text-xl">Community Posts</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Count: {communityPostsCount}</p>
                    <Link to="/community-post" className="mt-auto text-blue-500 font-semibold">View Details</Link>
                </div>

                {/* Card for Job Applicants */}
                <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                        <FaUserTie className="text-indigo-600 text-4xl mr-4" />
                        <h3 className="font-semibold text-xl">Job Applicants</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Count: {jobApplicantsCount}</p>
                    <Link to="/job-applicants" className="mt-auto text-blue-500 font-semibold">View Details</Link>
                </div>

                {/* Card for Employers */}
                <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                        <FaUsers className="text-indigo-600 text-4xl mr-4" />
                        <h3 className="font-semibold text-xl">Employers</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Count: {employersCount}</p>
                    <Link to="/user-management" className="mt-auto text-blue-500 font-semibold">View Details</Link>
                </div>

                {/* Card for Applicants */}
                <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col justify-between transition-transform duration-300 hover:shadow-xl">
                    <div className="flex items-center mb-4">
                        <FaUser className="text-indigo-600 text-4xl mr-4" />
                        <h3 className="font-semibold text-xl">Applicants</h3>
                    </div>
                    <p className="text-gray-600 mb-3">Count: {applicantsCount}</p>
                    <Link to="/user-management" className="mt-auto text-blue-500 font-semibold">View Details</Link>
                </div>
            </div>

            {/* Container for Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <ApplicantStatistics /> {/* Include the ApplicantStatistics chart */}
                <UserPostFrequencyChart /> {/* Include the UserPostFrequencyChart */}
            </div>

            <Outlet /> {/* This will render the content for each section */}
        </div>
    );
};

export default Dashboard;
