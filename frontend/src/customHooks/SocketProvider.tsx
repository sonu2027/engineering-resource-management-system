import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// 🧠 Create context
const SocketContext = createContext<Socket | null>(null);

// ✅ Fix 1: Proper typing for props
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {

    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
        });

        console.log("socketInstance: ", socketInstance);
        

        setSocket(socketInstance); // if using useState
        // OR socketRef.current = socketInstance;

        return () => {
            socketInstance.disconnect(); // ✅ Proper cleanup
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// ⚡ Hook to consume socket
export const useSocket = () => useContext(SocketContext);
