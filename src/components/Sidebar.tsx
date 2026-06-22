"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Home, Award, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/dashboard/domaines", label: "Domaines", Icon: Award },
  { href: "/dashboard/diplomes", label: "Diplômes", Icon: Award },
  { href: "/dashboard/campagnes", label: "Campagnes", Icon: FileText },
  { href: "/dashboard/candidats", label: "Candidats", Icon: Users },
  { href: "/dashboard/demandes", label: "Demandes", Icon: FileText },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  /* ======================
     Logout (V1 cohérent)
  ====================== */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_user");

    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#E6F4ED]
      flex flex-col justify-between px-4 py-6 shadow-sm rounded-r-3xl">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 rounded-xl bg-[#E7F5EF] shadow-sm"
      >
        <FileText className="w-6 h-6 text-[#0A5C36]" />
        <h1 className="text-xl font-bold text-[#0A5C36] tracking-tight">
          CFI Recrute
        </h1>
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col mt-8 gap-2">
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname === href;

          return (
            <motion.div
              key={href}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="overflow-hidden rounded-xl"
            >
              <Link
                href={href}
                className={`flex items-center gap-3 py-3 px-4 text-sm font-medium transition-all rounded-xl
                  ${
                    isActive
                      ? "bg-[#0A5C36] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#D6F0E0] hover:text-[#0A5C36]"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="flex items-center gap-2 w-full py-3 px-4 mt-6
          rounded-xl border border-red-200 text-red-600 font-medium
          hover:bg-red-50 transition shadow-sm"
      >
        <LogOut className="w-5 h-5" />
        Déconnexion
      </motion.button>
    </aside>
  );
}
