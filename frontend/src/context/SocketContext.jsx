import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            // Note: Backend server URL. Assuming localhost:8000 based on proxy.
            // But for socket.io-client, usually we need the full URL or relative path if proxied properly.
            // To be safe and since proxy handles http, but socket might need explicit url if different port.
            // However, proxy rewrites /api, but socket usually connects to /socket.io
            // If vite proxy only handles /api, we need to add /socket.io proxy too or just use full URL.
            // Let's use full URL for now to be safe: http://localhost:8000
            const newSocket = io('http://localhost:8000', {
                query: {
                    // If backend auth middleware for socket exists, pass token.
                    // Looking at chat.socket.js: socket.on("join", (userId) => { ... })
                    // It seems it relies on client sending "join" event with userId.
                }
            });

            setSocket(newSocket);

            // Join the user's room
            newSocket.on('connect', () => {
                newSocket.emit('join', user._id);
            });

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
