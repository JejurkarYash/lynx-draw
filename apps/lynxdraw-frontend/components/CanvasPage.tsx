"use client";

import React, { ReactElement, useEffect, useRef, useState } from 'react'
import Canva from "../components/Canva";
import { Tool } from "../types/index";
import { motion } from "motion/react";

// Tool configuration with icons and labels
const tools: { id: Tool; icon: ReactElement; label: string }[] = [
    {
        id: "MOUSE_SELECTION",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 3l7 14 2-6 6-2L3 3z" strokeWidth="1.5"></path>
            </svg>
        ),
        label: "Select"
    },
    {
        id: "RECTANGLE",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="4" y="4" width="12" height="12" strokeWidth="1.5"></rect>
            </svg>
        ),
        label: "Rectangle"
    },
    {
        id: "CIRCLE",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="10" cy="10" r="6" strokeWidth="1.5"></circle>
            </svg>
        ),
        label: "Circle"
    },
    {
        id: "LINE",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4.167 10h11.666" strokeWidth="1.5"></path>
            </svg>
        ),
        label: "Line"
    },
    {
        id: "PENCIL",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M13.5 3.5l3 3L8 15H5v-3l8.5-8.5z" strokeWidth="1.5"></path>
                <path d="M12 5l3 3" strokeWidth="1.5"></path>
            </svg>
        ),
        label: "Pencil"
    },
    {
        id: "ERASER",
        icon: (
            <svg
                aria-hidden="true"
                focusable="false"
                role="img"
                viewBox="0 0 20 20"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M8.5 3L3 8.5 11.5 17 17 11.5 8.5 3z" strokeWidth="1.5"></path>
                <path d="M7 13h10" strokeWidth="1.5"></path>
            </svg>
        ),
        label: "Eraser"
    },
];


const Canvas = ({ roomId }: { roomId: number }) => {
    const socketRef = useRef<WebSocket>(undefined);
    const [selectedTool, setSelectedTool] = useState<Tool>("PENCIL");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Calculate scale for each icon based on distance from hovered icon
    const getScale = (index: number) => {
        if (hoveredIndex === null) return 1;

        const distance = Math.abs(index - hoveredIndex);
        if (distance === 0) return 1.5; // Hovered icon (reduced from 1.6)
        if (distance === 1) return 1.25; // Adjacent icons
        if (distance === 2) return 1.1; // Next adjacent
        return 1; // Rest
    };

    // Calculate Y offset (float upward effect)
    const getYOffset = (index: number) => {
        if (hoveredIndex === null) return 0;

        const distance = Math.abs(index - hoveredIndex);
        if (distance === 0) return -20; // Hovered icon floats up
        if (distance === 1) return -10; // Adjacent float slightly
        if (distance === 2) return -5;  // Subtle float
        return 0;
    };

    return (
        <div className='fixed inset-0 w-screen h-screen'>
            <Canva roomId={roomId} selectedTool={selectedTool} />

            {/* Toolbar - Center Bottom with macOS Dock Effect */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.div
                    className="bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-2xl shadow-2xl p-4"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <div
                        className="flex items-center gap-3"
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {tools.map((tool, index) => (
                            <motion.button
                                key={tool.id}
                                onClick={() => setSelectedTool(tool.id)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                className={`
                                    relative flex items-center justify-center
                                    w-12 h-12 rounded-xl flex-shrink-0
                                    transition-colors duration-200
                                    ${selectedTool === tool.id
                                        ? 'bg-accent text-white shadow-lg shadow-accent/50'
                                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                                    }
                                `}
                                animate={{
                                    scale: getScale(index),
                                    y: getYOffset(index),
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                                whileTap={{ scale: 0.9 }}
                                title={tool.label}
                            >
                                {tool.icon}

                                {/* Active indicator dot */}
                                {/* {selectedTool === tool.id && (
                                    <motion.div
                                        className="absolute -bottom-1.5 left-1/2 w-1.5 h-1.5 bg-white rounded-full"
                                        layoutId="activeIndicator"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        style={{ x: '-50%' }}
                                    />
                                )} */}
                            </motion.button>
                        ))}
                    </div>

                    {/* Tooltip on hover */}
                    {hoveredIndex !== null && (
                        <motion.div
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                        >
                            {tools[hoveredIndex].label}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45" />
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default Canvas;  