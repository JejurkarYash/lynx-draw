"use client";
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useInView } from "motion/react";

const Benefits = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className=' flex flex-row items-center justify-center gap-6  min-h-screen px-4 '>
            {/* container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.3 }}
                className="max-w-4xl flex flex-row items-center  justify-between gap-6 ">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className=' flex flex-col items-left text-left  gap-4 '>

                    <motion.h2
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className=' text-4xl font-bold '>
                        Brainstorm Visually, Collaborate Seamlessly
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className=' text-stone-400 max-w-2xl text-base '>
                        LynxDraw makes it simple to turn rough ideas into clear visuals. Collaborate in real time, sketch freely, and organize thoughts together on a shared canvas—no matter where your team is.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className=' bg-gradient-to-r  from-accent  via-blue-400 to-fuchsia-500 text-white p-2   cursor-pointer rounded-md  w-32 hover:shadow-md hover:scale-105 transition-all duration-300  '>
                        Get Started
                    </motion.button>
                </motion.div>

                {/* benefit section image  */}
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative">

                    {/* Add glow effect behind image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-fuchsia-500/20 blur-2xl rounded-2xl transform scale-110"></div>

                    <Image
                        src="/brainstrom.png"
                        alt="brainstorm image "
                        width={600}
                        height={800}
                        className="relative z-10 rounded-xl shadow-2xl"
                    />
                </motion.div>

            </motion.div>
        </section>
    )
}

export default Benefits