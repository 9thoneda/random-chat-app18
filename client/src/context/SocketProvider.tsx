import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

interface ISocketContext {
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}

export const SocketProvider = ({children} : {children: ReactNode}) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!socket) {
            // Determine socket URL based on environment
            let socketUrl: string;
            
            if (import.meta.env.VITE_API_SERVER_URL) {
                socketUrl = import.meta.env.VITE_API_SERVER_URL;
            } else if (window.location.hostname === 'localhost') {
                socketUrl = 'http://localhost:8000';
            } else {
                // For production or other environments
                socketUrl = `http://${window.location.hostname}:8000`;
            }
            
            const newSocket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                secure: false,
                timeout: 20000,
                forceNew: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            newSocket.on('reconnect', (attemptNumber) => {
                console.log('Socket reconnected after', attemptNumber, 'attempts');
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('Socket reconnection error:', error);
            });

            setSocket(newSocket);

            return () => {
                console.log('Cleaning up socket connection');
                newSocket.close();
            };
        }
    }, [socket]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                console.log('Component unmounting, closing socket');
                socket.close();
                setSocket(null);
            }
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {children}
        </SocketContext.Provider>
    )
}