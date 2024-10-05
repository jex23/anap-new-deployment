import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the import based on your file structure
import { collection, getDocs } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(Tooltip, Legend, ArcElement);

const ApplicantStatistics: React.FC = () => {
    // State to hold applicant statistics and loading state
    const [applicantStats, setApplicantStats] = useState({ accepted: 0, underReview: 0, declined: 0 });
    const [loading, setLoading] = useState(true);

    // Function to fetch applicant statistics from Firestore
    const fetchApplicantStats = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Job_Applicants'));
            let acceptedCount = 0;
            let underReviewCount = 0;
            let declinedCount = 0; // New variable for declined applicants

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Check the application status and update counts
                if (data.applicationStatus === 'Accepted') {
                    acceptedCount++;
                } else if (data.applicationStatus === 'Under Review') {
                    underReviewCount++;
                } else if (data.applicationStatus === 'Declined') { // Check for declined status
                    declinedCount++;
                }
            });

            // Update state with the fetched counts
            setApplicantStats({ accepted: acceptedCount, underReview: underReviewCount, declined: declinedCount });
        } catch (error) {
            console.error("Error fetching applicant statistics: ", error);
        } finally {
            setLoading(false); // Set loading to false in finally to ensure it runs after try/catch
        }
    };

    useEffect(() => {
        fetchApplicantStats(); // Fetch statistics when the component mounts
    }, []);

    // Data for the pie chart
    const data = {
        labels: ['Accepted', 'Under Review', 'Declined'], // Added Declined to labels
        datasets: [
            {
                data: [applicantStats.accepted, applicantStats.underReview, applicantStats.declined], // Include declined count
                backgroundColor: ['#4caf50', '#2196f3', '#f44336'], // Added red color for Declined
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md mt-6">
            <h3 className="text-2xl font-semibold mb-4">Applicant Status Statistics</h3>
            {loading ? (
                <div>Loading...</div> // Display loading state while fetching data
            ) : (
                <div style={{ height: '300px', width: '100%' }}> {/* Adjust height and width here */}
                    <Pie data={data} options={{ maintainAspectRatio: false }} /> {/* Set maintainAspectRatio to false */}
                </div>
            )}
        </div>
    );
};

export default ApplicantStatistics;
