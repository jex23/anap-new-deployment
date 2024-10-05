import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path based on your file structure
import { collection, getDocs } from 'firebase/firestore';

interface ApplicantData {
    applicantsId: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    age: string;
    gender: string;
    jobTitle: string;
    company: string;
    applicationStatus: string;
    appliedAt: any; // This will hold Firestore timestamp
    coverLetter: string;
    resumeLink: string;
    companyLogoUrl: string;
    employerId: string;
    username: string;
}

const JobApplicants: React.FC = () => {
    const [applicants, setApplicants] = useState<ApplicantData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'Job_Applicants'));
            const applicantsData: ApplicantData[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Omit<ApplicantData, 'applicantsId'>; // Type assertion excluding 'applicantsId'
                applicantsData.push({ applicantsId: doc.id, ...data }); // Add the document ID to the data
            });
            setApplicants(applicantsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching applicants: ", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants(); // Fetch applicants when the component mounts
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Optional loading state
    }

    if (applicants.length === 0) {
        return <div>No applicants found.</div>; // Handle case where no applicants are found
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Job Applicants</h2>
            <table className="min-w-full bg-white border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Phone Number</th>
                        <th className="border px-4 py-2">Address</th>
                        <th className="border px-4 py-2">Age</th>
                        <th className="border px-4 py-2">Gender</th>
                        <th className="border px-4 py-2">Job Title</th>
                        <th className="border px-4 py-2">Company</th>
                        <th className="border px-4 py-2">Application Status</th>
                        <th className="border px-4 py-2">Applied At</th>
                        <th className="border px-4 py-2">Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map((applicant) => (
                        <tr key={applicant.applicantsId} className="cursor-pointer hover:bg-gray-100">
                            <td className="border px-4 py-2">{applicant.name}</td>
                            <td className="border px-4 py-2">{applicant.email}</td>
                            <td className="border px-4 py-2">{applicant.phoneNumber}</td>
                            <td className="border px-4 py-2">{applicant.address}</td>
                            <td className="border px-4 py-2">{applicant.age}</td>
                            <td className="border px-4 py-2">{applicant.gender}</td>
                            <td className="border px-4 py-2">{applicant.jobTitle}</td>
                            <td className="border px-4 py-2">{applicant.company}</td>
                            <td className="border px-4 py-2">{applicant.applicationStatus}</td>
                            <td className="border px-4 py-2">{applicant.appliedAt?.toDate().toLocaleString()}</td>
                            <td className="border px-4 py-2">
                                <a href={applicant.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    View Resume
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobApplicants;
