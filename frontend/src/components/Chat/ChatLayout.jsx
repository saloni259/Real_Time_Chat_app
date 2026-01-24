import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const ChatLayout = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            <Sidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
            {selectedUser ? (
                <ChatWindow selectedUser={selectedUser} />
            ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-900 bg-opacity-95">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-200">Welcome to Chat App</h2>
                        <p className="text-gray-400 mt-2">Select a contact to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatLayout;
