"use client";
import { useState } from "react";
import College from "@/components/College";
import Cutoff2024 from "@/components/Cutoff2024";

const Dashboard = () => {
  const [selectType, setSelectType] = useState<string>("");
  const handleSelect = (option: string) => {
    setSelectType(option);
  };
  return (
    <main className="h-full w-full px-2 py-2">
      <section className="flex  justify-end gap-4 items-center px-12 py-4 my-4 text-[8px] sm:text-sm font-sans bg-indigo-200">
        <article className="px-2 bg-stone-50 rounded-sm">
          <button
            onClick={() => handleSelect("colleges")}
            className="focus:outline-0"
          >
            College
          </button>
        </article>
        <article className="px-2 bg-stone-50 rounded-sm">
          <button
            onClick={() => handleSelect("cutoff")}
            className="focus:outline-0"
          >
            Cutoff 2024
          </button>
        </article>
      </section>
      {selectType == "colleges" ? <College /> : <Cutoff2024 />}
    </main>
  );
};

export default Dashboard;
