import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Adjust the path based on your file structure
import { doc, getDoc } from 'firebase/firestore';

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
    postedAt: any; // This will hold Firestore timestamp
    requirements: string;
    salaryRange: string;
    skills: string;
    status: string;
    yearExperience: string;
}

const JobPostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the job post ID from the URL
    const [jobPost, setJobPost] = useState<JobPostData | null>(null); // State to store job post
    const [loading, setLoading] = useState(true); // Loading state

    const fetchJobPost = async () => {
        if (!id) {
            console.error("Job post ID is undefined.");
            setLoading(false);
            return;
        }

        try {
            const docRef = doc(db, 'EmployerJobPost', id); // Reference to the specific job post
            const docSnap = await getDoc(docRef); // Get the document snapshot

            if (docSnap.exists()) {
                const data = docSnap.data() as Omit<JobPostData, 'id'>; // Type assertion excluding 'id'
                setJobPost({ id: docSnap.id, ...data }); // Set job post state
            } else {
                console.error("No such document!");
            }
            setLoading(false); // Set loading to false after fetching
        } catch (error) {
            console.error("Error fetching job post: ", error);
            setLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
        fetchJobPost(); // Fetch job post when the component mounts
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>; // Optional loading state
    }

    if (!jobPost) {
        return <div>No job post found.</div>; // Handle case where job post is not found
    }

    // Convert Firestore timestamp to readable date
    const postedAtDate = jobPost.postedAt?.toDate().toLocaleString(); // Ensure postedAt is converted properly

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
                <img src={jobPost.companyLogoUrl} alt={`${jobPost.company} logo`} className="w-16 h-16 mr-4 rounded-full" />
                <h2 className="text-2xl font-bold">{jobPost.jobTitle}</h2>
            </div>
            <div className="mb-4">
                <p className="text-gray-600"><strong>Company:</strong> {jobPost.company}</p>
                <p className="text-gray-600"><strong>Location:</strong> {jobPost.address}</p>
                <p className="text-gray-600"><strong>Category:</strong> {jobPost.category}</p>
                <p className="text-gray-600"><strong>Job Type:</strong> {jobPost.jobType}</p>
                <p className="text-gray-600"><strong>Posted At:</strong> {postedAtDate}</p>
                <p className="text-gray-600"><strong>Salary Range:</strong> {jobPost.salaryRange}</p>
                <p className="text-gray-600"><strong>Job Schedule:</strong> {jobPost.jobSchedule}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">About the Role</h3>
                <p className="text-gray-600">{jobPost.aboutRole}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Requirements</h3>
                <p className="text-gray-600">{jobPost.requirements}</p>
            </div>
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <p className="text-gray-600">{jobPost.skills}</p>
            </div>
            <div className="mb-4">
                <p className="text-gray-600"><strong>Status:</strong> {jobPost.status}</p>
                <p className="text-gray-600"><strong>Years of Experience:</strong> {jobPost.yearExperience}</p>
            </div>
        </div>
    );
};

export default JobPostDetail;
