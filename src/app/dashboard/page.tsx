"use client";
import { signOutUser } from "@/lib/auth";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const session = useSessionStore((state) => state.session);
  const user = useSessionStore((state) => state.user);
  const router = useRouter();
  const resetSession = useSessionStore((state) => state.resetSession);

  if (!session) {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Tu email es: {user?.email}</p>
      <button
        onClick={() => signOutUser(router, resetSession)}
        className="border border-red-500 bg-red-500 text-white p-2 rounded-md cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Page;
