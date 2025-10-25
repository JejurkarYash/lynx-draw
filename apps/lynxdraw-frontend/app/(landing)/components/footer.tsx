"use client";
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useInView } from "motion/react"

const footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className=' flex flex-col items-center justify-center text-center m-10 '>
            {/* container  */}

            <motion.div
                className=' flex flex-col items-center justify-center max-w-4xl w-full h-full gap-8 text-center '
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >

                {/* container 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className=' flex flex-col items-center justify-center gap-4 '>

                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                        transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}>
                        <Image src="/logo.svg" alt="logo " width={200} height={100} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ staggerChildren: 0.1, delayChildren: 0.8 }}
                        className='flex flex-row items-center justify-between '>
                        <ul className=' flex flex-row items-center justify-between gap-6 text-neutral-400 '>
                            <motion.li
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 0.9 }}
                                whileHover={{ y: -2, color: "#ffffff" }}
                                className=' hover:cursor-pointer transition-colors duration-200'>
                                Home
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 1.0 }}
                                whileHover={{ y: -2, color: "#ffffff" }}
                                className=' hover:cursor-pointer transition-colors duration-200'>
                                Features
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 1.1 }}
                                whileHover={{ y: -2, color: "#ffffff" }}
                                className=' hover:cursor-pointer transition-colors duration-200'>
                                How It Works
                            </motion.li>
                            <motion.li
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 1.2 }}
                                whileHover={{ y: -2, color: "#ffffff" }}
                                className=' hover:cursor-pointer transition-colors duration-200'>
                                Benefits
                            </motion.li>
                        </ul>
                    </motion.div>
                </motion.div>
                {/* Line  */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    className=' w-full h-[1px] bg-neutral-700 origin-center '>
                </motion.div>

                {/* container 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                    className=' flex flex-col md:flex-row items-center justify-center  w-full gap-4 text-center '>
                    <motion.p
                        whileHover={{ scale: 1.02 }}
                        className=' text-neutral-500  text-center ' >
                        © 2024 LynxDraw. All rights reserved.
                    </motion.p>
                </motion.div>
            </motion.div>
        </section >
    )
}

export default footer;