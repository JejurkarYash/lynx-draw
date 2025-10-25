"use client";
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useInView } from "motion/react";

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className='min-h-screen flex flex-col items-center  gap-6  '>
            {/* container */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
                className='max-w-4xl mt-28 mb-20 items-center flex flex-col gap-4 px-4 text-center'>
                {/* heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 50, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='text-4xl font-bold '>From Sketch to Shared <br /> Vision</motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className='text-center  text-stone-400 max-w-2xl leading-relaxed'>
                    LynxDraw makes it simple to turn rough ideas into clear visuals. Collaborate in real time, sketch freely, and organize thoughts together on a shared canvas—no matter where your team is.
                </motion.p>

                {/* features card */}
                {/* container  */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ staggerChildren: 0.2, delayChildren: 0.6 }}
                    className=' flex flex-row max-w-4xl gap-3 h-[24rem] '>
                    {/* feature 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className='relative flex items-center  flex-col border border-white rounded-2xl p-6 flex-1 transition-transform duration-300 h-full overflow-hidden'>
                        {/* Purple gradient effect at bottom right */}
                        <div className='absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/30 via-violet-500/20 to-transparent rounded-tl-full blur-xl'></div>
                        <div className='absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-tl from-purple-400/40 via-pink-400/25 to-transparent rounded-tl-full blur-lg'></div>
                        {/* Additional softer blur layer */}
                        <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600/20 via-violet-600/15 to-transparent rounded-tl-full blur-2xl'></div>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                            transition={{ duration: 0.6, delay: 1.0, type: "spring", stiffness: 100 }}>
                            <Image src="/first.png" alt="Feature 1" width={50} height={50} className=' m-4 ' />
                        </motion.div>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            className='text-2xl font-semibold mb-2 relative z-10 '>Real-Time Collaboration</motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className='text-stone-400 text-xs  leading-relaxed relative z-10'>
                            Work together seamlessly on a shared canvas. See edits live, chat with teammates, and build ideas collectively, no matter where you are.
                        </motion.p>
                    </motion.div>
                    {/* feature 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className='relative flex flex-col border border-white rounded-2xl p-6 flex-1 transition-transform duration-300 items-center  h-full overflow-hidden'>
                        {/* Purple gradient effect at bottom right */}
                        <div className='absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/30 via-violet-500/20 to-transparent rounded-tl-full blur-xl'></div>
                        <div className='absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-tl from-purple-400/40 via-pink-400/25 to-transparent rounded-tl-full blur-lg'></div>
                        {/* Additional softer blur layer */}
                        <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600/20 via-violet-600/15 to-transparent rounded-tl-full blur-2xl'></div>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                            transition={{ duration: 0.6, delay: 1.2, type: "spring", stiffness: 100 }}>
                            <Image src="/second.png" alt="Feature 2" width={50} height={50} className=' m-4 ' />
                        </motion.div>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            className='text-2xl font-semibold mb-2 relative z-10'>Intuitive Drawing Tools</motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className='text-stone-400 text-xs leading-relaxed relative z-10'>
                            From freehand sketches to shapes and connectors, LynxDraw gives you the tools to create diagrams, brainstorm maps, or quick doodles with ease.
                        </motion.p>
                    </motion.div>
                    {/* feature 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className='relative flex flex-col border border-white rounded-2xl p-6 flex-1 transition-transform duration-300 items-center  h-full overflow-hidden'>
                        {/* Purple gradient effect at bottom right */}
                        <div className='absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/30 via-violet-500/20 to-transparent rounded-tl-full blur-xl'></div>
                        <div className='absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-tl from-purple-400/40 via-pink-400/25 to-transparent rounded-tl-full blur-lg'></div>
                        {/* Additional softer blur layer */}
                        <div className='absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600/20 via-violet-600/15 to-transparent rounded-tl-full blur-2xl'></div>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                            transition={{ duration: 0.6, delay: 1.4, type: "spring", stiffness: 100 }}>
                            <Image src="/third.png" alt="Feature 3" width={50} height={50} className=' m-4 ' />
                        </motion.div>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.6 }}
                            className='text-2xl font-semibold mb-2 relative z-10'>Share & Export Seamlessly</motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 1.8 }}
                            className='text-stone-400 text-xs leading-relaxed relative z-10'>
                            Invite teammates, share links, or export your canvas in one click—making collaboration smooth inside and outside your workspace.
                        </motion.p>
                    </motion.div>


                </motion.div>
            </motion.div>
        </section >
    )
}

export default Features