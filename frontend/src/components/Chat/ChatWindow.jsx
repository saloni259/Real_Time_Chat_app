import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { FaPaperPlane, FaImage, FaPhoneAlt, FaVideo } from 'react-icons/fa';

const ChatWindow = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { socket } = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/user/chat_history/${selectedUser._id}`);
                setMessages(response.data.data);
            } catch (error) {
                console.error("Error fetching chat history", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedUser) {
            fetchMessages();
            setMessages([]); // Clear previous messages while loading
        }
    }, [selectedUser]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (message) => {
                // Check if the message belongs to the current chat
                if (
                    (message.sender === selectedUser._id && message.receiver === user._id) ||
                    (message.sender === user._id && message.receiver === selectedUser._id)
                ) {
                    setMessages((prev) => [...prev, message]);
                }
            });
        }
        return () => {
            if (socket) socket.off('receiveMessage');
        };
    }, [socket, selectedUser, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (socket) {
            const messageData = {
                sender: user._id,
                receiver: selectedUser._id,
                message: newMessage,
            };
            socket.emit('sendMessage', messageData);
            setNewMessage('');
            // Optimistically add message or wait for 'receiveMessage' from server?
            // Backend `chat.socket.js` emits `receiveMessage` to sender as well using `socket.emit("receiveMessage", chat)`.
            // So we can just wait for the event.
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-900 border-l border-gray-800 h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm z-10">
                <div className="flex items-center space-x-4">
                    {selectedUser.profilePicture ? (
                        <img src={selectedUser.profilePicture} alt={selectedUser.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                            {selectedUser.fullname.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-white text-lg">{selectedUser.fullname}</h3>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                    <button className="hover:text-white transition-colors"><FaPhoneAlt /></button>
                    <button className="hover:text-white transition-colors"><FaVideo /></button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-900">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">Loading messages...</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMyMessage = msg.sender === user._id;
                        return (
                            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl p-4 shadow-md ${isMyMessage
                                        ? 'bg-teal-600 text-white rounded-br-none'
                                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                                    }`}>
                                    <p className="break-words">{msg.message}</p>
                                    <span className={`text-[10px] block mt-1 ${isMyMessage ? 'text-teal-200' : 'text-gray-500'} text-right`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-900 z-10">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <FaImage className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-teal-500 border border-gray-700 placeholder-gray-500 transition-shadow"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="p-3 bg-teal-600 rounded-xl text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
