"use client"
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image';
import Link from 'next/link';
import { motion } from "motion/react"
import { useSession, signIn } from "next-auth/react";
import SignOutDialog from "@/components/SignOutDialog";
import { useRouter } from "next/navigation";

const menuItems = [
    { name: 'Home', link: '#home' },
    { name: "Features", link: "#features" },
    { name: "How It Works", link: "#how-it-works" },
    { name: "Benefits", link: "#benefits" }
]
const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session, status } = useSession();
    const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
    const router = useRouter();


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50); // Trigger after 50px scroll
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])

    useEffect(() => {
        if (status === "loading") {
            console.log("Session loading...");
        }
        if (status === "authenticated") {
            localStorage.setItem("token", session?.accessToken || "");
        }
    }, [session, status])

    const handleCloseDialog = () => {
        setIsSignOutDialogOpen(false);
    };

    const handleProfileClick = () => {
        setIsSignOutDialogOpen(true);
    };


    return (
        <header >
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='fixed top-0 left-0  z-50 w-full p-4  text-foreground '>
                <motion.div
                    layout
                    className={cn("max-w-6xl mx-auto flex items-center p-3  flex-row justify-between transition-all duration-300 ", isScrolled && "bg-background/80 backdrop-blur-md shadow-md max-w-4xl border border-neutral-600 py-4 rounded-md  h-16 ")}>
                    {/* logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="">
                        <Link href="#home">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={isScrolled ? 90 : 120}
                                height={isScrolled ? 90 : 120}
                                className='cursor-pointer transition-all duration-300'
                            />
                        </Link>
                    </motion.div>

                    {/* nav items */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="">
                        <ul className={cn(
                            'flex gap-4 transition-all duration-300',
                            isScrolled ? 'text-xs' : 'text-sm'
                        )}>
                            {menuItems.map((item, index) => (
                                <motion.li
                                    key={item.name}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                                    whileHover={{ y: -2 }}
                                    className={cn(
                                        "inline-block transition-all duration-300",
                                        isScrolled ? "mx-2" : "mx-4"
                                    )}>
                                    <Link href={item.link} className='hover:text-accent text-neutral-400 transition-colors duration-200'>
                                        {item.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className='flex gap-4 items-center relative'>

                        {/* Loading state */}
                        {status === "loading" ? (
                            <div className="animate-pulse bg-gray-300 h-10 w-10  rounded-full "></div>
                        ) : session?.user ? (
                            /* User is logged in */
                            <div className="flex items-center gap-3">
                                {/* User profile image with fallback */}
                                {session.user.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="User profile"
                                        width={40}
                                        height={40}
                                        onClick={handleProfileClick}
                                        className='rounded-full border-2 border-accent hover:cursor-pointer'
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                                        {session.user.name?.charAt(0) || 'U'}
                                    </div>
                                )}

                                {/* User name and sign out */}
                                {isScrolled ? null : (<div className="hidden md:flex flex-col">
                                    <span className="text-xs text-gray-400">Welcome</span>
                                    <span className="text-sm font-medium">{session.user.name}</span>
                                </div>)}

                            </div>
                        ) : (
                            /* User is not logged in */
                            <>
                                {isScrolled ? (

                                    <motion.button
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/api/auth/signup')}
                                        className='bg-accent text-white px-3 py-1 rounded-md cursor-pointer text-base hover:bg-accent/80 transition absolute right-0 top-1/2 transform -translate-y-1/2 h-10 w-32'>
                                        Get Started
                                    </motion.button>
                                ) : (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/api/auth/signup')}
                                            className='text-foreground border border-accent px-3 py-1 rounded-md transition cursor-pointer text-sm hover:bg-accent/80 h-10 w-24'>
                                            Login
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => router.push('/api/auth/signup')}
                                            className='bg-accent text-white px-3 py-1 rounded-md cursor-pointer hover:bg-accent/80 transition text-sm h-10 w-24'>
                                            Sign Up
                                        </motion.button>
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </motion.nav>
            <SignOutDialog isOpen={isSignOutDialogOpen} onClose={handleCloseDialog} />
        </header>
    )
}

export default NavBar; 