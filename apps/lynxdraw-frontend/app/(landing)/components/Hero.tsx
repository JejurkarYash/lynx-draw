"use client";
import { BackgroundLines } from '@/components/ui/background-lines';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import React from 'react'
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Elsie_Swash_Caps } from 'next/font/google';


const Hero = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleGetStarted = () => {
        if (status === "authenticated") {
            router.push('/dashboard');
        } else {
            router.push('/api/auth/signin');
        }
    }

    return (
        <section className='min-h-screen relative overflow-hidden '>
            <BackgroundLines className="min-h-screen w-full flex items-center justify-center">
                {/* Hero Text */}
                <div className='flex flex-col  text-center items-center justify-center h-full w-full gap-2 '>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}>

                        <motion.h1
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-6xl md:text-7xl font-bold bg-gradient-to-b from-stone-100 via-gray-300 to-slate-600 bg-clip-text text-transparent">
                            Sketch It.
                        </motion.h1>

                        <motion.h1
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-6xl md:text-7xl font-bold bg-gradient-to-b from-stone-100 via-gray-300 to-slate-600 bg-clip-text text-transparent">
                            Share It.
                        </motion.h1>

                        <motion.h1
                            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-6xl md:text-7xl font-bold bg-gradient-to-b from-stone-100 via-gray-300 to-slate-600 bg-clip-text text-transparent">
                            Shape It.
                        </motion.h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className='text-lg text-stone-400 max-w-xl leading-relaxed mt-4'>
                        Turn ideas into visuals instantly. Collaborate in real time,
                        bring concepts to life, and make creativity a shared experience.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        className='mt-8 gap-6 items-center flex justify-center'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGetStarted}
                            className="rainbow-btn relative w-[160px] h-12 flex items-center justify-center gap-2.5 px-6 bg-black rounded-xl border-none text-white cursor-pointer font-semibold transition-all duration-200">
                            Give it a shot
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: "white", color: "black" }}
                            whileTap={{ scale: 0.95 }}
                            className="h-12 w-[160px] text-white border border-white transition-all duration-300 cursor-pointer px-6 rounded-xl">
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>
            </BackgroundLines>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className='flex items-center justify-center -mt-20 px-4 md:px-8 overflow-hidden'>
                <div className='relative w-full max-w-4xl'>
                    {/* Purple glow effect background - contained within bounds */}
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-violet-600/30 to-purple-600/20 blur-2xl rounded-3xl'></div>
                    <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/15 to-violet-500/10 blur-3xl rounded-3xl'></div>

                    {/* Image container with purple border glow */}
                    <div className='relative p-1 bg-gradient-to-br from-purple-500/50 via-violet-500/50 to-pink-500/50 rounded-2xl'>
                        <div className='bg-black/20 backdrop-blur-sm rounded-2xl p-2'>
                            <Image
                                src="/heroImage.jpeg"
                                alt='LynxDraw App Preview'
                                width={1200}
                                height={800}
                                className='w-full h-auto object-contain rounded-xl shadow-2xl shadow-purple-500/25'
                                priority
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

        </section>
    )
}

export default Hero;
