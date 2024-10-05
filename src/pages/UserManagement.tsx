// src/UserManagement.tsx
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebaseConfig'; // Adjust the import based on your structure
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'employers' | 'applicants'>('employers');
    const [applicants, setApplicants] = useState<any[]>([]);
    const [employers, setEmployers] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [newPhoto, setNewPhoto] = useState<File | null>(null);

    // Fetch applicants from Firestore
    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const applicantsCollection = collection(db, 'Applicants');
                const applicantsSnapshot = await getDocs(applicantsCollection);
                const applicantsList = applicantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplicants(applicantsList);
            } catch (error) {
                console.error("Error fetching applicants: ", error);
            }
        };

        fetchApplicants();
    }, []);

    // Fetch employers from Firestore
    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                const employersCollection = collection(db, 'Employer');
                const employersSnapshot = await getDocs(employersCollection);
                const employersList = employersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEmployers(employersList);
            } catch (error) {
                console.error("Error fetching employers: ", error);
            }
        };

        fetchEmployers();
    }, []);

    // Function to delete an applicant
    const deleteApplicant = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'Applicants', id));
            setApplicants(applicants.filter(applicant => applicant.id !== id));
        } catch (error) {
            console.error("Error deleting applicant: ", error);
        }
    };

    // Function to delete an employer
    const deleteEmployer = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'Employer', id));
            setEmployers(employers.filter(employer => employer.id !== id));
        } catch (error) {
            console.error("Error deleting employer: ", error);
        }
    };

    // Function to handle edit button click
    const handleEdit = (data: any) => {
        setEditData(data);
        setIsEditing(true);
    };

    // Function to handle form submission for editing
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            let photoUrl = editData.photoUrl; // Default to current photo URL
            
            // If a new photo is selected, upload it
            if (newPhoto) {
                const photoRef = ref(storage, `user_photos/${newPhoto.name}`);
                await uploadBytes(photoRef, newPhoto);
                photoUrl = await getDownloadURL(photoRef);
            }

            // Update Firestore document
            await updateDoc(doc(db, activeTab === 'employers' ? 'Employer' : 'Applicants', editData.id), {
                ...editData,
                photoUrl,
            });

            // Update local state
            if (activeTab === 'employers') {
                setEmployers(employers.map(employer => employer.id === editData.id ? { ...employer, photoUrl } : employer));
            } else {
                setApplicants(applicants.map(applicant => applicant.id === editData.id ? { ...applicant, photoUrl } : applicant));
            }
            setIsEditing(false);
            setEditData(null);
            setNewPhoto(null);
        } catch (error) {
            console.error("Error updating data: ", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="flex space-x-4 my-4">
                <button 
                    className={`px-4 py-2 rounded ${activeTab === 'employers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                    onClick={() => setActiveTab('employers')}
                >
                    Employers
                </button>
                <button 
                    className={`px-4 py-2 rounded ${activeTab === 'applicants' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} 
                    onClick={() => setActiveTab('applicants')}
                >
                    Applicants
                </button>
            </div>
            <div>
                {activeTab === 'employers' ? (
                    <div>
                        <h3 className="text-xl font-semibold">Employers List</h3>
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">First Name</th>
                                    <th className="border border-gray-300 p-2">Last Name</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Phone Number</th>
                                    <th className="border border-gray-300 p-2">Photo</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employers.map(employer => (
                                    <tr key={employer.id}>
                                        <td className="border border-gray-300 p-2">{employer.firstName}</td>
                                        <td className="border border-gray-300 p-2">{employer.lastName}</td>
                                        <td className="border border-gray-300 p-2">{employer.email}</td>
                                        <td className="border border-gray-300 p-2">{employer.phoneNumber}</td>
                                        <td className="border border-gray-300 p-2">
                                            <img 
                                                src={employer.photoUrl} 
                                                alt={`${employer.firstName} ${employer.lastName}`} 
                                                className="h-10 w-10 rounded-full" 
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2 flex space-x-2">
                                            <button 
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleEdit(employer)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => deleteEmployer(employer.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-xl font-semibold">Applicants List</h3>
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">First Name</th>
                                    <th className="border border-gray-300 p-2">Last Name</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Phone Number</th>
                                    <th className="border border-gray-300 p-2">Photo</th>
                                    <th className="border border-gray-300 p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map(applicant => (
                                    <tr key={applicant.id}>
                                        <td className="border border-gray-300 p-2">{applicant.firstName}</td>
                                        <td className="border border-gray-300 p-2">{applicant.lastName}</td>
                                        <td className="border border-gray-300 p-2">{applicant.email}</td>
                                        <td className="border border-gray-300 p-2">{applicant.phoneNumber}</td>
                                        <td className="border border-gray-300 p-2">
                                            <img 
                                                src={applicant.photoUrl} 
                                                alt={`${applicant.firstName} ${applicant.lastName}`} 
                                                className="h-10 w-10 rounded-full" 
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2 flex space-x-2">
                                            <button 
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => handleEdit(applicant)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => deleteApplicant(applicant.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal/Form */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Edit Details</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name</label>
                                <input 
                                    type="text" 
                                    value={editData.firstName} 
                                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} 
                                    className="border p-2 w-full" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name</label>
                                <input 
                                    type="text" 
                                    value={editData.lastName} 
                                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} 
                                    className="border p-2 w-full" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    value={editData.email} 
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                                    className="border p-2 w-full" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Phone Number</label>
                                <input 
                                    type="text" 
                                    value={editData.phoneNumber} 
                                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} 
                                    className="border p-2 w-full" 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Upload New Photo</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => e.target.files && setNewPhoto(e.target.files[0])} 
                                    className="border p-2 w-full" 
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
