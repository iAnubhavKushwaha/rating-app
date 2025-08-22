import { useState } from 'react';
import { resetPassword } from '../api/auth';
import { useAuth } from '../context/authContext'; 
import { Link } from 'react-router-dom'; // Import Link for navigation

const ResetPassword = () => {
    const { user } = useAuth(); // Get the authenticated user if available
    const [email, setEmail] = useState(user ? user.email : '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate new passwords match
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const response = await resetPassword(email, currentPassword, newPassword);
            setSuccess(response.message); 
            alert(response.message); // Show success message
        } catch (err) {
            setError(err.response?.data?.message || err.message); // Handle errors
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border p-2 w-full"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Current Password:
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="border p-2 w-full"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="border p-2 w-full"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="border p-2 w-full"
                        />
                    </label>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Reset Password
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
            <div className="mt-4">
                <Link to="/login" className="text-blue-600 hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;