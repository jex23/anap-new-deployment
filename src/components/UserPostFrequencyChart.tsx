import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const UserPostFrequencyChart: React.FC = () => {
    const [postCountsByDate, setPostCountsByDate] = useState<{ date: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPostCounts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const postCounts: { [key: string]: number } = {};

            querySnapshot.forEach(doc => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate(); // Assuming createdAt is a Firestore timestamp
                const dateString = createdAt ? createdAt.toISOString().split('T')[0] : null;

                if (dateString) {
                    postCounts[dateString] = (postCounts[dateString] || 0) + 1;
                }
            });

            // Convert the object into an array of objects with date and count
            const sortedPostCounts = Object.entries(postCounts)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            setPostCountsByDate(sortedPostCounts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching post counts: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostCounts(); // Fetch data when the component mounts
    }, []);

    // Prepare data for the line chart
    const data = {
        labels: postCountsByDate.map(item => item.date), // Get dates for labels
        datasets: [
            {
                label: 'Number of Posts',
                data: postCountsByDate.map(item => item.count), // Get counts for data
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="p-5 bg-white rounded-lg shadow-md mt-6">
            <h3 className="text-2xl font-semibold mb-4">User Post Frequency by Day</h3>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ height: '300px', width: '100%' }}>
                    <Line data={data} options={{ maintainAspectRatio: false }} />
                </div>
            )}
        </div>
    );
};

export default UserPostFrequencyChart;
