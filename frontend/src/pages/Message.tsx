import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useUser } from "../context/UseProvider";
import { useSocket } from "../customHooks/SocketProvider";
import OnGoingFeature from "../modals/OnGoingFeature";
import { ManagerNavbar } from "../components/ManagerNavbar";
import { EngineerNavbar } from "../components/EngineerNavbar";
import { FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
}

interface Conversation {
    _id: string; // user._id of the other participant
    name: string;
    email: string;
    lastMessage?: string;
    timestamp?: string;
}

function Message() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState("");
    const [showUserList, setShowUserList] = useState(false);

    const { user } = useUser()
    const socket = useSocket();

    useEffect(() => {
        const fetchConversations = async () => {
            if (!user?._id) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include", // 👈 still keeping cookies
                    body: JSON.stringify({ userId: user?._id }) // 👈 pass userId dynamically
                });

                const data = await res.json();
                setConversations(data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchConversations();
    }, [user?._id]);

    // Socket listener
    useEffect(() => {
        console.log("socket listening");

        if (!user?._id || !socket?.connected) return;

        console.log("socket listening");

        socket.emit("join", user._id);

        const handleReceive = (newMsg: Message) => {
            console.log("📩 message received:", newMsg);
            if (
                selectedUser &&
                (newMsg.senderId === selectedUser._id || newMsg.receiverId === selectedUser._id)
            ) {
                setMessages(prev => [...prev, newMsg]);
            }

            setConversations(prev =>
                prev.map(conv =>
                    conv._id === newMsg.senderId || conv._id === newMsg.receiverId
                        ? {
                            ...conv,
                            lastMessage: newMsg.content,
                            timestamp: newMsg.timestamp,
                        }
                        : conv
                )
            );
        };

        socket.on("receive-message", handleReceive);

        return () => {
            socket.off("receive-message", handleReceive);
        };
    }, []);

    useEffect(() => {
        if (!socket) return

        const handleReceive = (msg: Message) => {
            console.log("Receiving message:", msg);
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("receive-message", handleReceive);

        return () => {
            socket.off("receive-message", handleReceive); // cleanup when unmounting
        };
    }, [socket]);


    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log("🔌 Reconnected:", socket.id);
            socket.emit("join", user?._id); // ✅ Re-register user after refresh
        };

        socket.on("connect", handleConnect);

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [socket, user?._id]);


    // ✅ Fetch all users for "start new chat"
    const handleShowAllUsers = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            credentials: "include", // ✅ sends the cookie automatically
        })
            .then(res => res.json())
            .then(data => {
                setAllUsers(data.users)
            });
    };


    // ✅ Select user and fetch messages
    const handleSelectUser = async (otherUser: User) => {
        setSelectedUser(otherUser);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/user-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                currentUserId: user?._id,
                otherUserId: otherUser._id
            })
        });

        const data = await res.json()
        setMessages(data)
    };

    const sendMessage = () => {
        if (!messageText.trim() || !selectedUser || !user?._id || !socket) return;

        const payload = {
            senderId: user._id,
            receiverId: selectedUser._id,
            content: messageText,
            timestamp: new Date().toISOString(),
        };

        socket.emit("send-message", payload); // ✅ no fetch here
        setMessageText(""); // Reset input
    };

    return (
        <div>
            {
                user?.role === "manager" ? <ManagerNavbar /> : <EngineerNavbar />
            }
            <div className="flex h-screen">
                <div className="w-1/4 border-r p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Chats</h2>
                    {conversations.length === 0 ? (
                        <div>
                            <p className="mb-2 text-muted-foreground">No messages yet. Start chatting with someone!</p>
                            <Button onClick={handleShowAllUsers}>Show All Users</Button>
                            <ScrollArea className="mt-4 h-[400px]">
                                {allUsers.map(user => (
                                    <div
                                        key={user._id}
                                        className="p-2 cursor-pointer hover:bg-muted rounded"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        {user.name}
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px]">
                            {conversations.map(user => (
                                <div
                                    key={user._id}
                                    className="p-2 cursor-pointer hover:bg-muted rounded"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    {user.name}
                                </div>
                            ))}
                        </ScrollArea>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between p-4 w-3/4 overflow-y-scroll">
                    {selectedUser ? (
                        <>
                            <div className="mb-4">
                                <div className="flex items-center gap-x-4 sticky top-0 z-10 bg-white">
                                    <FaArrowLeftLong onClick={() => setSelectedUser(null)} />
                                    <h2 className="text-lg font-medium">Chat with {selectedUser.name}</h2>
                                </div>
                                <ScrollArea className="h-[100%] rounded p-2 mt-2">
                                    {messages.length === 0 ? (
                                        <Skeleton className="h-6 w-full mt-4" />
                                    ) : (
                                        messages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`mb-2 p-2 rounded ${msg.senderId === user?._id ? "bg-slate-700 text-white text-right" : "bg-muted"
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <p className="text-xs text-gray-300">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </ScrollArea>
                            </div>

                            <div className="flex justify-center items-center">
                                <div className="flex items-center gap-2 fixed bottom-1 w-2/3">
                                    <Input
                                        className="bg-gray-700 text-gray-50"
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        placeholder="Type a message..."
                                    />
                                    <Button onClick={sendMessage}>Send</Button>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-muted-foreground">Select a user to start chatting</div>
                            <div className="fixed bottom-3 right-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleShowAllUsers()
                                        setShowUserList(true)
                                        console.log("all users: ", allUsers);
                                    }}
                                    className="p-3 bg-muted rounded-full shadow hover:bg-muted/70"
                                    title="Start New Chat"
                                >
                                    <FaPlus className="h-6 w-6 text-black dark:text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <OnGoingFeature />

                {showUserList && (
                    <div onClick={(e) => e.stopPropagation()} className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <div className="relative bg-white dark:bg-slate-900 p-6 rounded-lg w-[300px] max-h-[400px] overflow-y-auto shadow-xl">

                            <button
                                onClick={() => setShowUserList(false)}
                                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-red-500"
                                title="Close"
                            >
                                <span className="text-xl font-bold">×</span>
                            </button>

                            <h3 className="text-lg font-semibold mb-4">Start New Chat</h3>
                            {allUsers.map(u => (
                                <div
                                    key={u._id}
                                    className="p-2 rounded cursor-pointer hover:bg-muted"
                                    onClick={() => {
                                        handleSelectUser(u);
                                        setShowUserList(false);
                                    }}
                                >
                                    {u.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div >
    );
}

export default Message;
