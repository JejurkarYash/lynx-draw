"use client";
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useInView } from "motion/react";

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className=" flex flex-col items-center min-h-screen justify-center px-4 ">
            {/* container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.2 }}
                className=" flex items-center  w-full h-screen  text-center  max-w-4xl  flex-col gap-8 mt-20    ">

                {/* heading */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center justify-center gap-4 max-w-3xl  text-center ">

                    <motion.p
                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-base  font-bold text-white ">
                        Simple, Fast, and Collaborative
                    </motion.p>

                    <motion.h2
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className=' text-4xl font-bold text-white '>
                        How LynxDraw Works
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className=' text-stone-400 text-base text-center max-w-2xl '>
                        LynxDraw makes it simple to turn rough ideas into clear visuals. Collaborate in real time, sketch freely, and organize thoughts together on a shared canvas—no matter where your team is.
                    </motion.p>
                </motion.div>

                {/* body */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="flex flex-row justify-between gap-10 mt-20    ">

                    {/* first card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -50, scale: 0.9 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-col gap-8 items-center justify-between">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            className="flex flex-col gap-2 max-w-sm ">
                            <h3 className=" text-2xl font-semibold text-white ">Start Your Canvas</h3>
                            <p className=" text-stone-400 text-xs  ">Open a blank canvas or choose from templates. Begin sketching ideas, diagrams, or quick notes instantly.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 1.6 }}
                            className="flex flex-col gap-2 max-w-sm">
                            <h3 className=" text-2xl font-semibold text-white ">Invite Your Team</h3>
                            <p className=" text-stone-400 text-xs ">Share a link and collaborate in real time—see everyone's cursors, edits, and drawings as they happen.</p>
                        </motion.div>
                    </motion.div>
                    {/* second card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ duration: 0.8, delay: 1.4, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="flex flex-col gap-6 items-center justify-between relative">

                        {/* Add glow effect behind the central image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/20 to-pink-500/30 blur-3xl rounded-3xl transform scale-125"></div>

                        <Image
                            src="/howitworks.png"
                            alt="how it works "
                            width={500}
                            height={300}
                            className="relative z-10 rounded-xl shadow-2xl"
                        />
                    </motion.div>
                    {/* third card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-col gap-6 items-center justify-between">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                            className="flex flex-col gap-2 max-w-sm">
                            <h3 className=" text-2xl font-semibold text-white ">Sketch & Organize</h3>
                            <p className=" text-stone-400  text-xs ">Use freehand tools, shapes, arrows, and sticky notes to structure thoughts and brainstorm visually.</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 1.6 }}
                            className="flex flex-col gap-2 max-w-sm">
                            <h3 className=" text-2xl font-semibold text-white ">Share & Export</h3>
                            <p className=" text-stone-400 text-xs ">When done, export your canvas as an image or PDF, or keep it live to revisit and update later.</p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default HowItWorks