    import React, { useEffect, useState } from 'react';
    import { Link, Outlet } from 'react-router-dom';
    import { FaBriefcase, FaUsers, FaComments, FaUserTie, FaUser } from 'react-icons/fa';
    import { db } from '../firebaseConfig';
    import { collection, getDocs } from 'firebase/firestore';
    import ApplicantStatistics from './ApplicantStatistics';
    import UserPostFrequencyChart from './UserPostFrequencyChart';
    import html2canvas from 'html2canvas';
    import { jsPDF } from 'jspdf';

    const Dashboard: React.FC = () => {
        const [jobPostsCount, setJobPostsCount] = useState(0);
        const [communityPostsCount, setCommunityPostsCount] = useState(0);
        const [jobApplicantsCount, setJobApplicantsCount] = useState(0);
        const [employersCount, setEmployersCount] = useState(0);
        const [applicantsCount, setApplicantsCount] = useState(0);

        const fetchCounts = async () => {
            try {
                const jobPostsSnapshot = await getDocs(collection(db, 'EmployerJobPost'));
                setJobPostsCount(jobPostsSnapshot.size);

                const communityPostsSnapshot = await getDocs(collection(db, 'posts'));
                setCommunityPostsCount(communityPostsSnapshot.size);

                const jobApplicantsSnapshot = await getDocs(collection(db, 'Job_Applicants'));
                setJobApplicantsCount(jobApplicantsSnapshot.size);

                const employersSnapshot = await getDocs(collection(db, 'Employer'));
                setEmployersCount(employersSnapshot.size);

                const applicantsSnapshot = await getDocs(collection(db, 'Applicants'));
                setApplicantsCount(applicantsSnapshot.size);
            } catch (error) {
                console.error('Error fetching counts: ', error);
            }
        };

        const generatePDF = async () => {
            const doc = new jsPDF();
            const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        });

            // Add statistics
            doc.setFontSize(16);
        doc.text(`ANAP Report Statistic - ${formattedDate}`, 10, 10); // Fixed template literal usage
            doc.setFontSize(12);
            doc.text(`Job Posts Count: ${jobPostsCount}`, 10, 30);
            doc.text(`Community Posts Count: ${communityPostsCount}`, 10, 40);
            doc.text(`Job Applicants Count: ${jobApplicantsCount}`, 10, 50);
            doc.text(`Employers Count: ${employersCount}`, 10, 60);
            doc.text(`Applicants Count: ${applicantsCount}`, 10, 70);

            // Capture charts
            const charts = document.getElementsByClassName('chart-container');
            let yOffset = 80; // Start below the statistics

            for (let i = 0; i < charts.length; i++) {
                const chart = charts[i] as HTMLElement;
                const canvas = await html2canvas(chart);
                const chartImage = canvas.toDataURL('image/png');
                doc.addImage(chartImage, 'PNG', 10, yOffset, 190, 90); // Adjust position and size
                yOffset += 100; // Adjust yOffset for the next chart
            }

              // Save the PDF with formatted date
        doc.save(`ANAP_Report_${formattedDate.replace(/ /g, '_')}.pdf`); 
        };

        useEffect(() => {
            fetchCounts();
        }, []);

        return (
            <div className="flex-grow p-5 bg-gray-100">
                <h2 className="text-3xl font-bold mb-5">Dashboard Overview</h2>
                <button
                    onClick={generatePDF}
                    className="mb-5 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                >
                    Download PDF
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cards for statistics */}
                    <div className="bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center mb-4">
                            <FaBriefcase className="text-indigo-600 text-4xl mr-4" />
                            <h3 className="font-semibold text-xl">Job Posts</h3>
                        </div>
                        <p className="text-gray-600 mb-3">Count: {jobPostsCount}</p>
                        <Link to="/job-post" className="text-blue-500 font-semibold">
                            View Details
                        </Link>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center mb-4">
                            <FaComments className="text-indigo-600 text-4xl mr-4" />
                            <h3 className="font-semibold text-xl">Community Posts</h3>
                        </div>
                        <p className="text-gray-600 mb-3">Count: {communityPostsCount}</p>
                        <Link to="/community-post" className="text-blue-500 font-semibold">
                            View Details
                        </Link>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center mb-4">
                            <FaUserTie className="text-indigo-600 text-4xl mr-4" />
                            <h3 className="font-semibold text-xl">Job Applicants</h3>
                        </div>
                        <p className="text-gray-600 mb-3">Count: {jobApplicantsCount}</p>
                        <Link to="/job-applicants" className="text-blue-500 font-semibold">
                            View Details
                        </Link>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center mb-4">
                            <FaUsers className="text-indigo-600 text-4xl mr-4" />
                            <h3 className="font-semibold text-xl">Employers</h3>
                        </div>
                        <p className="text-gray-600 mb-3">Count: {employersCount}</p>
                        <Link to="/user-management" className="text-blue-500 font-semibold">
                            View Details
                        </Link>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-5">
                        <div className="flex items-center mb-4">
                            <FaUser className="text-indigo-600 text-4xl mr-4" />
                            <h3 className="font-semibold text-xl">Applicants</h3>
                        </div>
                        <p className="text-gray-600 mb-3">Count: {applicantsCount}</p>
                        <Link to="/user-management" className="text-blue-500 font-semibold">
                            View Details
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="chart-container">
                        <ApplicantStatistics />
                    </div>
                    <div className="chart-container">
                        <UserPostFrequencyChart />
                    </div>
                </div>
                <Outlet />
            </div>
        );
    };

    export default Dashboard;
