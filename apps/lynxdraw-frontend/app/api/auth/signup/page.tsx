"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your email login logic here
    console.log("Email login:", email, password);
    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In");
    signIn("google", {
      callbackUrl: "/"
    });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // if (session) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="border border-neutral-600 bg-background/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
  //       >
  //         <div className="text-center">
  //           <div className="mb-6">
  //             {session.user?.image ? (
  //               <Image
  //                 src={session.user.image}
  //                 alt="Profile"
  //                 width={80}
  //                 height={80}
  //                 className="rounded-full mx-auto border-4 border-accent"
  //               />
  //             ) : (
  //               <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
  //                 {session.user?.name?.charAt(0) || 'U'}
  //               </div>
  //             )}
  //           </div>
  //           <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
  //           <p className="text-neutral-400 mb-6">You're signed in as {session.user?.name}</p>
  //           <div className="space-y-3">
  //             <Link href="/canvas">
  //               <motion.button
  //                 whileHover={{ scale: 1.05 }}
  //                 whileTap={{ scale: 0.95 }}
  //                 className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition"
  //               >
  //                 Go to Canvas
  //               </motion.button>
  //             </Link>
  //             <motion.button
  //               whileHover={{ scale: 1.05 }}
  //               whileTap={{ scale: 0.95 }}
  //               onClick={() => signOut()}
  //               className="w-full border border-neutral-600 text-foreground py-3 rounded-lg font-medium hover:bg-neutral-800 transition"
  //             >
  //               Sign Out
  //             </motion.button>
  //           </div>
  //         </div>
  //       </motion.div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative border border-neutral-600 bg-background/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-8 items-center   "
        >
          <div className="flex items-center justify-center mx-auto m-3  ">
            <Image src="/logo.svg" alt="logo" width={150} height={200} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to LynxDraw</h1>
          <p className="text-neutral-400 text-sm">
            Sketch, share, and collaborate in real time. Log in to start creating with your team instantly.
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleEmailLogin}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-neutral-600 bg-transparent px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-neutral-600 bg-transparent px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          {/* <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-accent hover:underline">
              Forgot password?
            </Link> */}
          {/* </div> */}

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-neutral-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-neutral-600 bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </motion.button>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-neutral-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-accent hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div >
  );
}
