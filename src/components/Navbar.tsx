"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">Cfi Recrute</div>

        {/* Desktop links */}
        <nav className="hidden md:flex gap-6">
          <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/dashboard/domaines" className="text-gray-700 hover:text-blue-600">Domaines</a>
          <a href="/dashboard/diplomes" className="text-gray-700 hover:text-blue-600">Diplômes</a>
          <a href="/dashboard/campagnes" className="text-gray-700 hover:text-blue-600">Campagnes</a>
          <a href="/dashboard/candidats" className="text-gray-700 hover:text-blue-600">Candidats</a>
          <a href="/dashboard/demandes" className="text-gray-700 hover:text-blue-600">Demandes</a>
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile links */}
      {open && (
        <div className="flex flex-col items-start bg-gray-50 px-6 py-3 md:hidden">
          <a href="/dashboard" className="py-2 w-full text-gray-700 hover:text-blue-600">Dashboard</a>
          <a href="/dashboard/domaines" className="py-2 w-full text-gray-700 hover:text-blue-600">Domaines</a>
          <a href="/dashboard/diplomes" className="py-2 w-full text-gray-700 hover:text-blue-600">Diplômes</a>
          <a href="/dashboard/campagnes" className="py-2 w-full text-gray-700 hover:text-blue-600">Campagnes</a>
          <a href="/dashboard/candidats" className="py-2 w-full text-gray-700 hover:text-blue-600">Candidats</a>
          <a href="/dashboard/demandes" className="py-2 w-full text-gray-700 hover:text-blue-600">Demandes</a>
        </div>
      )}
    </header>
  );
}
