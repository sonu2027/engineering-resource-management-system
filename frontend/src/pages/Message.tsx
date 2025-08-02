import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { useUser } from "../context/UseProvider";
import { useSocket } from "../customHooks/SocketProvider";
import OnGoingFeature from "../modals/OnGoingFeature";
import { ManagerNavbar } from "../components/ManagerNavbar";

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
                console.log("conversations data: ", data);

                setConversations(data);

            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };
        fetchConversations();
    }, []);


    // ✅ Fetch all users for "start new chat"
    const handleShowAllUsers = () => {
        console.log("user data is : ", user);

        fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            credentials: "include", // ✅ sends the cookie automatically
        })
            .then(res => res.json())
            .then(data => {
                console.log("users: ", data.users);

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
        console.log("selecetd user data is: ", data);
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

        // socket.on("receive-message", (msg) => {
        //     console.log("💬 Received message:", msg);
        //     setMessages((prev) => [...prev, msg]); // ✅ Add new message to chat list
        // });

    };

    useEffect(() => {
        if (!socket) return

        const handleReceive = (msg: Message) => {
            console.log("💬 Received message:", msg);
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("receive-message", handleReceive);

        return () => {
            socket.off("receive-message", handleReceive); // cleanup when unmounting
        };
    }, [socket]);


    // ✅ Socket listener
    useEffect(() => {
        if (!user?._id || !socket) return;

        console.log("🔥 useEffect triggered");

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
    }, []); // 👈 run only once

    return (
        <div>
            <ManagerNavbar />
            <div className="flex h-screen">
                {/* Sidebar: Conversations */}
                <div className="w-1/4 border-r p-4">
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

                {/* Chat Window */}
                <div className="flex-1 flex flex-col justify-between p-4">
                    {selectedUser ? (
                        <>
                            <div className="mb-4">
                                <h2 className="text-lg font-medium">Chat with {selectedUser.name}</h2>
                                <ScrollArea className="h-[95%] rounded p-2 mt-2">
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
                            <div className="flex items-center gap-2">
                                <Input
                                    value={messageText}
                                    onChange={e => setMessageText(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <Button onClick={sendMessage}>Send</Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-muted-foreground">Select a user to start chatting</div>
                    )}
                </div>
                <OnGoingFeature />
            </div>
        </div>
    );
}

export default Message;
