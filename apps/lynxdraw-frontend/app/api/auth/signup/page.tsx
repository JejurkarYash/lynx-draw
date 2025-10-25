"use client"
import { signIn, signOut, useSession } from "next-auth/react";
// import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl shadow-md hover:scale-105 transition"
        >
          {/* <FcGoogle className="text-2xl" /> */}
          Continue with Google
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p>Signed in as {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
