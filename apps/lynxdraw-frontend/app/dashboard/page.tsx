"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [roomId, setRoomId] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [recentRooms, setRecentRooms] = useState<string[]>([]);
    const [roomName, setRoomName] = useState<string>("")

    // Redirect to login if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/api/auth/signup");
        }
    }, [status, router]);

    // Load recent rooms from localStorage
    useEffect(() => {
        const recent = localStorage.getItem("recentRooms");
        if (recent) {
            setRecentRooms(JSON.parse(recent));
        }
    }, []);

    // Create a new room
    const handleCreateRoom = async (e: FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const newRoom = await axios.post(`${process.env.NEXT_PUBLIC_HTTP_BAKCKEND_URL}/room`, {
            roomName: roomName
        })

        console.log(newRoom.data);


        // Save to recent rooms
        // const updatedRooms = [newRoomId, ...recentRooms.slice(0, 4)];
        // localStorage.setItem("recentRooms", JSON.stringify(updatedRooms));

        // Navigate to canvas
        // router.push(`/canvas/${newRoomId}`);
    };

    // Join existing room
    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId.trim()) return;

        // Save to recent rooms
        const updatedRooms = [roomId, ...recentRooms.filter(r => r !== roomId).slice(0, 4)];
        localStorage.setItem("recentRooms", JSON.stringify(updatedRooms));

        router.push(`/canvas/${roomId}`);
    };

    // Quick join recent room
    const handleQuickJoin = (id: string) => {
        router.push(`/canvas/${id}`);
    };

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/">
                        <Image src="/logo.svg" alt="LynxDraw" width={100} height={100} className="cursor-pointer" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-neutral-400">
                            Welcome, {session.user?.name}
                        </span>
                        {session.user?.image && (
                            <Image
                                src={session.user.image}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-accent"
                            />
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Your Drawing Dashboard</h1>
                    <p className="text-neutral-400">Create a new canvas or join an existing room</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Create New Room */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 hover:border-accent/50 transition-colors"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-accent"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>
                            <p className="text-neutral-400 mb-6">
                                Start a fresh canvas and invite others to collaborate
                            </p>

                            <form onSubmit={handleCreateRoom} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter Unique Room Name "
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCreateRoom}
                                    disabled={isCreating}
                                    className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition disabled:opacity-50"
                                >
                                    {isCreating ? "Creating..." : "Create Room"}
                                </motion.button>

                            </form>


                        </div>
                    </motion.div>

                    {/* Join Existing Room */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 hover:border-accent/50 transition-colors"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-accent"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-semibold mb-4">Join Room</h2>
                            <p className="text-neutral-400 mb-6">
                                Enter a room ID to join an existing canvas
                            </p>

                            <form onSubmit={handleJoinRoom} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Enter Room ID"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                                />

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-neutral-700 text-white py-3 rounded-lg font-medium hover:bg-neutral-600 transition"
                                >
                                    Join Room
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Rooms */}
                {recentRooms.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-5xl mx-auto mt-12"
                    >
                        <h3 className="text-xl font-semibold mb-4">Recent Rooms</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {recentRooms.map((id, index) => (
                                <motion.button
                                    key={id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuickJoin(id)}
                                    className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 hover:border-accent/50 transition-colors text-left"
                                >
                                    <div className="text-xs text-neutral-500 mb-1">Room ID</div>
                                    <div className="text-sm font-mono text-accent">{id}</div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
