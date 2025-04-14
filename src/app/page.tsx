import Image from "next/image";
import Login from "@/components/Login";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col">
      <section className="w-full h-[100px] flex justify-between items-center px-10">
        <article className="flex justify-start items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo para la prueba tecnica"
            width={40}
            height={40}
            className="w-[40px] h-auto"
            loading="eager"
          />
          <h1 className="text-2xl font-bold">Prueba tecnica</h1>
        </article>
      </section>
      <Login />
    </main>
  );
}
