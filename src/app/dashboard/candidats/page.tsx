

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CandidatForm from "@/components/forms/CandidatForm";
import CandidatList from "@/components/lists/CandidatList";

export default function CandidatsPage() {
  const [adding, setAdding] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  const handleAdd = () => setAdding(true);
  const handleCancel = () => setAdding(false);
  const handleAdded = () => {
    setRefresh(!refresh);
    handleCancel();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 bg-white p-4 shadow-md w-full fixed top-0 z-50">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100 transition">
          <ArrowLeft className="w-6 h-6 text-blue-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-800">Gestion des Candidats</h1>
      </header>

      <main className="flex flex-col gap-8 p-6 pt-28">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          {!adding ? (
            <CandidatList key={refresh ? 1 : 0} onAdd={handleAdd} />
          ) : (
            <CandidatForm onAdded={handleAdded} onCancel={handleCancel} />
          )}
        </div>
      </main>
    </div>
  );
}
