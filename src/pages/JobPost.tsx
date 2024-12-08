    import React, { useEffect, useState } from 'react';
    import { db } from '../firebaseConfig'; // Adjust the path based on your file structure
    import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
    import { useNavigate } from 'react-router-dom';

    interface JobPostData {
        id: string; // To store the document ID
        aboutRole: string;
        address: string;
        category: string;
        company: string;
        companyLogoUrl: string;
        employerId: string;
        jobSchedule: string;
        jobTitle: string;
        jobType: string;
        postedAt: any; // You might want to specify a more precise type
        requirements: string;
        salaryRange: string;
        skills: string;
        status: string;
        yearExperience: string;
    }

    const JobPost: React.FC = () => {
        const [jobPosts, setJobPosts] = useState<JobPostData[]>([]); // State to store job posts
        const [loading, setLoading] = useState(true); // State to manage loading
        const navigate = useNavigate(); // Hook to programmatically navigate

        const fetchJobPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'EmployerJobPost'));
                const posts: JobPostData[] = []; // Array to hold the fetched job posts
                querySnapshot.forEach((doc) => {
                    posts.push({ id: doc.id, ...doc.data() } as JobPostData); // Push each document data into the array
                });
                setJobPosts(posts); // Update state with fetched posts
                setLoading(false); // Set loading to false after fetching
            } catch (error) {
                console.error("Error fetching job posts: ", error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        useEffect(() => {
            fetchJobPosts(); // Fetch job posts when the component mounts
        }, []);

        if (loading) {
            return <div>Loading...</div>; // Optional loading state
        }

        const handleRowClick = (jobPost: JobPostData) => {
            navigate(`/job-post/${jobPost.id}`, { state: jobPost }); // Navigate to JobPostDetail with state
        };

        const handleDelete = async (id: string) => {
            const confirmDelete = window.confirm("Are you sure you want to delete this job post?");
            if (confirmDelete) {
                try {
                    await deleteDoc(doc(db, 'EmployerJobPost', id)); // Delete the document by ID
                    setJobPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Update the state after deletion
                } catch (error) {
                    console.error("Error deleting document: ", error);
                }
            }
        };

        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold">Job Post</h2>
                {jobPosts.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-300 mt-4">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">Job Title</th>
                                <th className="border px-4 py-2">Company</th>
                                <th className="border px-4 py-2">Location</th>
                                <th className="border px-4 py-2">Job Type</th>
                                <th className="border px-4 py-2">Posted At</th>
                                <th className="border px-4 py-2">Salary Range</th>
                                <th className="border px-4 py-2">Actions</th> {/* Added Actions column */}
                            </tr>
                        </thead>
                        <tbody>
                            {jobPosts.map((post) => (
                                <tr key={post.id} className="cursor-pointer hover:bg-gray-100">
                                    <td className="border px-4 py-2" onClick={() => handleRowClick(post)}>{post.jobTitle}</td>
                                    <td className="border px-4 py-2">{post.company}</td>
                                    <td className="border px-4 py-2">{post.address}</td>
                                    <td className="border px-4 py-2">{post.jobType}</td>
                                    <td className="border px-4 py-2">{post.postedAt.toDate().toLocaleString()}</td>
                                    <td className="border px-4 py-2">{post.salaryRange}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No job posts available.</div>
                )}
            </div>
        );
    };

    export default JobPost;
