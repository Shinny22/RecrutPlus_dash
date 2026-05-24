"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DomaineList from "@/components/lists/DomaineList";

export default function DomainesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 bg-[#E7F5EF] p-4 shadow-md w-full fixed top-0 z-50 rounded-b-lg">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-[#D1EAD9] transition"
        >
          <ArrowLeft className="w-6 h-6 text-[#0A5C36]" />
        </button>
        <h1 className="text-2xl font-bold text-[#0A5C36]">Gestion des Domaines</h1>
      </header>

      <main className="flex flex-col gap-6 p-6 pt-28">
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#E6F4ED]">
          <DomaineList />
        </div>
      </main>
    </div>
  );
}
