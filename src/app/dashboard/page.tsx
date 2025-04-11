"use client";
import Loader from "@/components/Loader";
import { signOutUser } from "@/lib/auth";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const user = useSessionStore((state) => state.user);
  const router = useRouter();
  const resetSession = useSessionStore((state) => state.resetSession);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Tu email es: {user?.email}</p>
      <button
        onClick={() => signOutUser(setLoading, router, resetSession)}
        className="border border-red-500 bg-red-500 text-white p-2 rounded-md cursor-pointer"
      >
        Cerrar sesión
      </button>
      {loading ? <Loader type="" text="" /> : null}
    </div>
  );
};

export default Page;
