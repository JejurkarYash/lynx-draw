/* filepath: e:\projects\NextJs-Projects\lynx-draw\apps\lynxdraw-frontend\components\SignOutDialog.tsx */
"use client"
import { motion, AnimatePresence } from "motion/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

interface SignOutDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SignOutDialog({ isOpen, onClose }: SignOutDialogProps) {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-neutral-600 rounded-lg p-6 z-50 min-w-[300px] shadow-xl"
                    >
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Sign Out
                            </h3>
                            <p className="text-neutral-400 mb-6">
                                Are you sure you want to sign out, {session?.user?.name}?
                            </p>

                            <div className="flex gap-3 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="px-4 py-2 border border-neutral-600 rounded-md text-foreground hover:bg-neutral-800 transition"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSignOut}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                >
                                    Sign Out
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}