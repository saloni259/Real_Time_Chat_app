import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Create form data as expected by backend (upload.none() supports formData)
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
            const response = await api.post('/user/login', formData);
            // Backend returns { success: true, message: "...", data: { User: {...}, refreshToken: "...", accessToken: "..." } }
            login(response.data.data.User);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-900 bg-opacity-95 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-blend-overlay">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-2xl border border-white/20">
                <h2 className="mb-6 text-center text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                {error && <div className="mb-4 rounded bg-red-500/10 p-3 text-center text-sm text-red-500 border border-red-500/20">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-lg bg-gray-800/50 border border-gray-700 p-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 p-3 font-semibold text-white shadow-lg hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-[1.02]"
                    >
                        Sign In
                    </button>
                    <div className="text-right">
                        <Link to="/forgot-password" size="sm" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-teal-400 hover:text-teal-300 hover:underline transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
