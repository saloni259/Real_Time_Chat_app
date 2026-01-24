import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Use default export
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Sidebar = ({ onSelectUser, selectedUser }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/user/all_users');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                        <h3 className="font-semibold text-white">{user?.fullname}</h3>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>

            <div className="p-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        className="w-full bg-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="text-center text-gray-500 mt-4">Loading contacts...</div>
                ) : (
                    filteredUsers.map((u) => (
                        <div
                            key={u._id}
                            onClick={() => onSelectUser(u)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-800 transition-colors ${selectedUser?._id === u._id ? 'bg-gray-800 border-l-4 border-teal-500' : ''}`}
                        >
                            <div className="relative">
                                {u.profilePicture ? (
                                    <img src={u.profilePicture} alt={u.username} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                                        {u.fullname.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Online status indicator placeholder */}
                                {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span> */}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-medium text-white">{u.fullname}</h4>
                                    {/* <span className="text-xs text-gray-500">12:45 PM</span> */}
                                </div>
                                <p className="text-sm text-gray-500 truncate">@{u.username}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Sidebar;
