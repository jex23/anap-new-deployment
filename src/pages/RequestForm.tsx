import React, { useEffect, useState, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { submitFormRequest } from './requestHandler'; // Import Firestore submission handler

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RequestForm: React.FC = () => {
    const [depedForm, setDepedForm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [lrn, setLrn] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [strand, setStrand] = useState('');
    const [yearGraduated, setYearGraduated] = useState('');
    const [track, setTrack] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const formRef = useRef<HTMLDivElement>(null); // Create a ref for the form

    

    const resetForm = () => {
        setDepedForm('');
        setFirstName('');
        setLastName('');
        setLrn('');
        setContactNumber('');
        setEmail('');
        setStrand('');
        setYearGraduated('');
        setTrack('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!depedForm || !firstName || !lastName || !lrn || !contactNumber || !email || !strand || !yearGraduated || !track) {
            setError('Please fill in all fields.');
            setOpenSnackbar(true);
            return;
        }

        const formData = {
            depedForm,
            firstName,
            lastName,
            lrn,
            contactNumber,
            email,
            strand,
            yearGraduated,
            track,
            timestamp: new Date(),
        };

        await submitFormRequest(formData, resetForm, setError, setOpenSnackbar);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const formElement = formRef.current;
            if (formElement) {
                const formRect = formElement.getBoundingClientRect();
                // Check if the mouse is within the vertical range of the form
                if (e.clientY < formRect.top || e.clientY > formRect.bottom) {
                    const scrollAmount = (e.clientY < formRect.top) ? -10 : 10; // Scroll up or down
                    formElement.scrollTop += scrollAmount; // Adjust scroll position
                }
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="flex items-center justify-center h-screen" style={{
            backgroundImage: 'url("https://i.ibb.co/SdYsqpn/382103576-748388327301878-8681280576890683558-n.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
        }}>
            <div ref={formRef} className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full overflow-auto" style={{
                position: 'relative',
                zIndex: 1,
                opacity: 0.9,
                paddingTop: '60px',
                paddingBottom: '20px',
                maxHeight: '90vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
              
                <h2 className="text-2xl mb-4 text-white text-center">Request a Form</h2>
                <form onSubmit={handleSubmit} className="mt-">
                    <div className="mb-4">
                        <label htmlFor="depedForm" className="text-white">Select DepEd Form</label>
                        <select
                            id="depedForm"
                            value={depedForm}
                            onChange={(e) => setDepedForm(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                        >
                            <option value="">-- Select Form --</option>
                            <option value="Form 137">Students Certificate</option>
                            <option value="Form 138">Form 137</option>
                            <option value="Form 138">Form 138</option>
                            <option value="Good Moral">Graduation certificate </option>
                            <option value="Good Moral">Certificate of enrollment</option>
                            <option value="Diploma">Diploma</option>
                        </select>
                    </div>
                    {/* Add other form fields here as before */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="text-white">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="text-white">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lrn" className="text-white">LRN</label>
                        <input
                            id="lrn"
                            type="text"
                            value={lrn}
                            onChange={(e) => setLrn(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactNumber" className="text-white">Contact Number</label>
                        <input
                            id="contactNumber"
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-white">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="strand" className="text-white">Strand</label>
                        <select
                            id="strand"
                            value={strand}
                            onChange={(e) => setStrand(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                        >
                            <option value="">-- Select Strand --</option>
                            <option value="ABM">Accountancy, Business, and Management (ABM)</option>
                            <option value="GAS">General Academic Strand (GAS)</option>
                            <option value="HUMSS">Humanities and Social Sciences (HUMSS)</option>
                            <option value="STEM">Science, Technology, Engineering, and Mathematics (STEM)</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="yearGraduated" className="text-white">Year Graduated</label>
                        <input
                            id="yearGraduated"
                            type="text"
                            value={yearGraduated}
                            onChange={(e) => setYearGraduated(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="track" className="text-white">Track</label>
                        <input
                            id="track"
                            type="text"
                            value={track}
                            onChange={(e) => setTrack(e.target.value)}
                            className="w-full p-2 mt-2 border rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 p-2 text-white rounded hover:bg-blue-600 transition">
                        Submit Request
                    </button>
                </form>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default RequestForm;
