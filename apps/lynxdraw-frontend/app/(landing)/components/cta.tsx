"use client"
import Image from 'next/image'
import React, { useRef } from 'react'
import { motion, useInView } from "motion/react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const cta = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const handleCtaClick = () => {
        if (status === "authenticated") {
            router.push('/dashboard');
        } else {
            router.push('/api/auth/signin');
        }
    }

    return (
        <section ref={ref} className=" flex items-center min-h-screen justify-center px-4 -mt-20  ">
            {/* container */}
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className=" bg-gradient-to-b from-[#9810FA] to-[#5A0994]  max-w-4xl h-96 w-full   flex flex-row justify-between rounded-md shadow-lg overflow-hidden ">

                {/* contaioner 1  */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className=" p-8 items-center text-center flex flex-col  w-1/2 justify-center z-10 ">

                    <motion.h2
                        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(5px)" }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className=" text-2xl font-bold mb-4 px-2 text-white ">
                        Ideas Don't Wait. Neither Should You.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className=" mb-6 text-neutral-400">
                        Ideas are better when they collide. Jump into the canvas and create together in real time
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}

                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCtaClick}
                        className=" bg-white text-purple-700 py-3 px-6 rounded-lg font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 ">
                        Start A Canvas
                    </motion.button>
                </motion.div>

                {/* container 2 */}
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 50, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className=" w-1/2 items-center justify-center flex rounded-md overflow-hidden relative ">

                    <motion.div
                        className="relative">
                        <Image
                            src="/cta.png"
                            alt="Call to Action"
                            width={320}
                            height={320}
                            className=' max-w-full max-h-full drop-shadow-2xl ml-36 '
                        />
                    </motion.div>
                </motion.div>

            </motion.div>
        </section>
    )
}

export default cta