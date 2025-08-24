import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useUser } from "../context/UseProvider";
import { useSocket } from "../customHooks/SocketProvider";
import OnGoingFeature from "../modals/OnGoingFeature";
import { ManagerNavbar } from "../components/ManagerNavbar";
import { EngineerNavbar } from "../components/EngineerNavbar";
import { FaPlus } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { checkCookies } from "../apiCall/checkCookies";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import { useRef } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface Message {
    senderId: string;
    receiverId: string;
    content?: string;
    fileUrl?: string;
    timestamp: string;
}


interface Conversation {
    _id: string;
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
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { user } = useUser()
    const socket = useSocket();
    const navigate = useNavigate()

    useEffect(() => {
        checkCookies()
            .then((res) => {
                if (!res.success) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.log("error in home: ", error);
                navigate("/login")
            })
    }, [])

    useEffect(() => {
        const fetchConversations = async () => {
            if (!user?._id) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ userId: user?._id })
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
            socket.off("receive-message", handleReceive);
        };
    }, [socket]);


    useEffect(() => {
        if (!socket) return;

        const handleConnect = () => {
            console.log("🔌 Reconnected:", socket.id);
            socket.emit("join", user?._id); // Re-register user after refresh
        };

        socket.on("connect", handleConnect);

        return () => {
            socket.off("connect", handleConnect);
        };
    }, [socket, user?._id]);


    const handleShowAllUsers = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            credentials: "include", // sends the cookie automatically
        })
            .then(res => res.json())
            .then(data => {
                setAllUsers(data.users)
            });
    };


    const handleSelectUser = async (otherUser: User) => {
        setSelectedUser(otherUser);
        setSelectedImage(null)
        setPreviewUrl(null)

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

        socket.emit("send-message", payload);
        setMessageText("");
    };

    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSendImage = async () => {
        if (!socket || !selectedImage || !(selectedImage instanceof File)) return;

        try {
            const reader = new FileReader();

            reader.onload = () => {
                const base64Image = reader.result;

                const payload = {
                    senderId: user?._id,
                    receiverId: selectedUser?._id,
                    fileUrl: base64Image,
                    fileType: selectedImage.type,
                    fileName: selectedImage.name,
                    timestamp: new Date().toISOString(),
                };

                socket.emit("send-message", payload);

                // Clear inputs
                setSelectedImage(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
            };

            reader.readAsDataURL(selectedImage);
        } catch (error) {
            console.error("Error sending image:", error);
        }
    };

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <div>
            {
                user?.role === "manager" ? <ManagerNavbar /> : <EngineerNavbar />
            }
            <div className="flex h-screen">
                <div className="w-1/4 border-r p-2 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div>
                            {
                                allUsers.length > 0 ?
                                    <ScrollArea className="mt-4 h-[400px]">
                                        {allUsers.map((user, index) => (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className={`cursor-pointer px-1 py-2 sm:px-4 sm:py-3 flex items-center gap-1 sm:gap-3 hover:bg-slate-100 transition-colors duration-200 ${index !== conversations.length - 1 ? "border-b border-gray-200" : ""}`}
                                            >
                                                {/* Avatar Circle */}
                                                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>

                                                {/* User Name */}
                                                <span className="text-xs sm:text-sm font-medium text-gray-800">
                                                    {user.name}
                                                </span>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                    :
                                    <>
                                        <p className="mb-2 text-muted-foreground">No messages yet. Start chatting with someone!</p>
                                        <Button onClick={handleShowAllUsers}>Show All Users</Button>
                                    </>
                            }
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px]">
                            {conversations.map((user, index) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleSelectUser(user)}
                                    className={`cursor-pointer px-1 py-2 sm:px-4 sm:py-3 flex items-center gap-1 sm:gap-3 hover:bg-slate-100 transition-colors duration-200 ${index !== conversations.length - 1 ? "border-b border-gray-200" : ""}`}
                                >
                                    {/* Avatar Circle */}
                                    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-slate-300 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* User Name */}
                                    <span className="text-xs sm:text-sm font-medium text-gray-800">
                                        {user.name}
                                    </span>
                                </div>
                            ))}
                        </ScrollArea>

                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between w-3/4 overflow-y-scroll">
                    {selectedUser ? (
                        <>
                            {previewUrl ?
                                <div className="flex justify-center items-center relative">
                                    <div onClick={() => {
                                        setSelectedImage(null)
                                        setPreviewUrl(null)
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = "";
                                        }
                                    }} className="absolute right-4 top-4 bg-gray-700 rounded-full text-white p-2">
                                        <RxCross2 className="text-2xl" />
                                    </div>
                                    <img src={previewUrl} alt="Preview" className="w-full rounded shadow" />
                                </div>
                                :
                                <div className="mb-4">
                                    <div className="flex items-center gap-x-4 sticky top-0 z-10 bg-white p-4">
                                        <FaArrowLeftLong onClick={() => setSelectedUser(null)} />
                                        <h2 className="text-lg font-medium">
                                            Chat with {selectedUser.name}
                                        </h2>
                                    </div>

                                    <ScrollArea className="h-[100%] rounded p-2 mt-2">
                                        {messages.length === 0 ? (
                                            <Skeleton className="h-6 w-full mt-4" />
                                        ) : (
                                            messages.map((msg, idx) => {
                                                const isSender = msg.senderId === user?._id;
                                                const isImage = Boolean(msg.fileUrl);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}
                                                    >
                                                        <div
                                                            className={`p-2 rounded break-words max-w-[80%] max-[380px]:max-w-[90%] ${isImage
                                                                ? ""
                                                                : isSender
                                                                    ? "bg-slate-700 text-white text-right"
                                                                    : "bg-gray-100"
                                                                }`}
                                                        >
                                                            {msg.content ? (
                                                                <p>{msg.content}</p>
                                                            ) : isImage ? (
                                                                <img
                                                                    src={msg.fileUrl}
                                                                    alt="sent"
                                                                    className="max-w-full h-auto sm:max-w-xs sm:max-h-64 rounded shadow"
                                                                />
                                                            ) : null}

                                                            <p
                                                                className={`text-xs mt-1 ${isSender
                                                                    ? "text-gray-300 text-right"
                                                                    : "text-gray-500"
                                                                    }`}
                                                            >
                                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </ScrollArea>
                                </div>
                            }

                            {
                                previewUrl ?
                                    <IoMdSend onClick={handleSendImage} className="fixed bottom-8 right-10 text-green-700 text-2xl" />
                                    :
                                    <div className="flex justify-center items-center">
                                        <div className="flex items-center justify-between gap-2 fixed bottom-1 w-2/3">
                                            <div className="bg-slate-950 flex justify-between items-center rounded-sm px-2">
                                                <input
                                                    className="text-gray-50 outline-none h-9 sm:h-12 w-[40vw] sm:w-[50vw]"
                                                    value={messageText}
                                                    onChange={e => setMessageText(e.target.value)}
                                                    placeholder="Type a message..."
                                                />
                                                <FaCamera onClick={handleClick} className="text-xl text-gray-300" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </div>
                                            <Button onClick={sendMessage}>Send</Button>
                                        </div>
                                    </div>
                            }
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