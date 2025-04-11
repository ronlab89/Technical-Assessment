"use client";
import "@/assets/css/loader.css";

interface LoaderProps {
  type: string;
  text: string;
}

const Loader = ({ type, text }: LoaderProps) => {
  return (
    <section className="w-screen h-screen flex justify-center items-center z-[5000] fixed top-0 left-0 bg-slate-100/60 dark:bg-slate-900/60">
      {type === "" ? (
        <div className="flex flex-col justify-center items-center">
          <span className="loader-18"></span>
          <span className="pt-2 text-[1.2rem] font-semibold animate-pulse text-Shippingco-text dark:text-Shippingco-textdark">
            {text}
          </span>
        </div>
      ) : type === "pulse" ? (
        <span className="loader"></span>
      ) : (
        type === "location" && <span className="loader-95"> </span>
      )}
    </section>
  );
};

export default Loader;
