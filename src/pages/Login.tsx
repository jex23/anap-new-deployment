import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface LoginProps {
    onLogin: () => void; // Callback to set authentication state
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Static credentials
        const staticEmail = 'admin@gmail.com';
        const staticPassword = 'password';

        // Check for static credentials
        if (email === staticEmail && password === staticPassword) {
            onLogin(); // Call the onLogin function to update auth state
            navigate('/'); // Redirect to home after successful login
        } else {
            setError('Failed to log in. Please check your credentials.'); // Set error message
            setOpenSnackbar(true); // Open Snackbar
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div
            className="flex items-center justify-center h-screen"
            style={{
                backgroundImage: "url('https://i.ibb.co/hRn0xd9/Ultimate-Albay-Full-Day-Tourwith-Mayon-Skyline.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',


                
            }}
        >
            <div
                className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
                style={{
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0.9,
                }}
            >   <h6 className="text-2xl mb-4 text-white text-center">Anap Dashboard</h6>
                <h2 className="text-2xl mb-4 text-white text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-300">Email</label>
                        <input
                            type="email" // Kept as email for proper validation
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-400 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" aria-live="assertive">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;
