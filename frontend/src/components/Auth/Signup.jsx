import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        otp: '',
        profile: null,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'profile') {
            setFormData({ ...formData, profile: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Backend expects JSON for send_registrationotp_viamail based on route definition: upload.none()
            // But let's send FormData to be consistent if it uses multer
            const data = new FormData();
            data.append('email', formData.email);

            await api.post('/user/send_registrationotp_viamail', data);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('fullname', formData.fullname);
        data.append('username', formData.username);
        data.append('email', formData.email); // Must match the one sent for OTP
        data.append('password', formData.password);
        data.append('otp', formData.otp);
        if (formData.profile) {
            data.append('profile', formData.profile);
        }

        try {
            const response = await api.post('/user/verify_registrationotpand_register', data);
            // Backend returns cookie and user object in response.data.data
            login(response.data.data); // Adjust based on actual response structure if needed
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 bg-opacity-95 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-blend-overlay py-12">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-2xl border border-white/20">
                <h2 className="mb-6 text-center text-3xl font-bold text-white tracking-tight">
                    {step === 1 ? 'Get Started' : 'Complete Registration'}
                </h2>
                {error && <div className="mb-4 rounded bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 p-3 font-semibold text-white shadow-lg hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">OTP</label>
                            <input
                                type="text"
                                name="otp"
                                className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                onChange={handleChange}
                                required
                                placeholder="Check your email for OTP"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Profile Picture</label>
                            <input
                                type="file"
                                name="profile"
                                className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-teal-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-teal-400 hover:file:bg-teal-500/30"
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 p-3 font-semibold text-white shadow-lg hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Finish Registration'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
