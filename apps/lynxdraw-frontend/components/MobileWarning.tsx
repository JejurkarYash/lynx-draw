/* filepath: e:\projects\NextJs-Projects\lynx-draw\apps\lynxdraw-frontend\components\MobileWarning.tsx */
"use client"
import { motion } from "motion/react";
import Image from "next/image";

export default function MobileWarning() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center p-6 lg:hidden"
        >
            <div className="text-center max-w-md">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mb-8"
                >
                    <Image
                        src="/logo.svg"
                        alt="LynxDraw Logo"
                        width={120}
                        height={120}
                        className="mx-auto"
                    />
                </motion.div>

                {/* Icon */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <svg
                        className="w-16 h-16 mx-auto text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Better Experience on Desktop
                    </h2>
                    <p className="text-neutral-400 mb-6 leading-relaxed">
                        LynxDraw is designed for collaborative drawing and works best on larger screens.
                        Please open this app on a laptop or desktop for the optimal experience.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-3 text-sm text-neutral-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Precise drawing tools</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Real-time collaboration</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span>Advanced canvas controls</span>
                    </div>
                </motion.div>

                {/* Continue anyway button (optional) */}
                {/* <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const warning = document.getElementById('mobile-warning');
                        if (warning) warning.style.display = 'none';
                    }}
                    className="mt-8 px-4 py-2 border border-neutral-600 rounded-md text-neutral-400 hover:text-foreground hover:border-accent transition-colors"
                >
                    Continue anyway
                </motion.button> */}
            </div>
        </motion.div>
    );
}