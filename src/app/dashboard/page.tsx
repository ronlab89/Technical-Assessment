"use client";
import { useSessionStore } from "@/store/sessionStore";

const Page = () => {
  const session = useSessionStore((state) => state.session);
  const user = useSessionStore((state) => state.user);

  if (!session) {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
      <p>Tu email es: {user?.email}</p>
    </div>
  );
};

export default Page;
