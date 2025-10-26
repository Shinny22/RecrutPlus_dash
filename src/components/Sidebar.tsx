// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { FileText, Home, Award, Users as UsersIcon, LogOut } from "lucide-react";
// import Link from "next/link";

// const links = [
//   { href: "/dashboard", label: "Dashboard", Icon: Home },
//   { href: "/dashboard/domaines", label: "Domaines", Icon: Award },
//   { href: "/dashboard/diplomes", label: "Diplômes", Icon: Award },
//   { href: "/dashboard/campagnes", label: "Campagnes", Icon: FileText },
//   { href: "/dashboard/candidats", label: "Candidats", Icon: UsersIcon },
//   { href: "/dashboard/demandes", label: "Demandes", Icon: FileText },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="w-72 bg-gradient-to-b from-blue-50 to-white shadow-lg p-6 flex flex-col justify-between">
//       {/* Logo */}
//       <div>
//         <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 transition duration-300">
//           <FileText className="w-6 h-6 text-blue-800" />
//           <h2 className="text-xl font-bold text-blue-900">Cfi_recrute</h2>
//         </div>

//         {/* Navigation Links */}
//         <nav className="flex flex-col gap-2 mt-6">
//           {links.map((link) => (
//             <Link key={link.href} href={link.href} passHref>
//               <Button
//                 variant="ghost"
//                 className="justify-start flex items-center w-full hover:bg-blue-100 hover:text-blue-800 transition duration-200 rounded-lg"
//               >
//                 <link.Icon className="w-5 h-5 mr-2 text-blue-600" />
//                 {link.label}
//               </Button>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Logout */}
//       <div className="mt-auto">
//         <Button
//           variant="outline"
//           className="flex items-center gap-2 w-full hover:bg-red-50 hover:text-red-600 transition duration-200 rounded-lg"
//         >
//           <LogOut className="w-5 h-5 text-red-500" /> Déconnexion
//         </Button>
//       </div>
//     </aside>
//   );
// }



"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Home, Award, Users as UsersIcon, LogOut } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: Home },
  { href: "/dashboard/domaines", label: "Domaines", Icon: Award },
  { href: "/dashboard/diplomes", label: "Diplômes", Icon: Award },
  { href: "/dashboard/campagnes", label: "Campagnes", Icon: FileText },
  { href: "/dashboard/candidats", label: "Candidats", Icon: UsersIcon },
  { href: "/dashboard/demandes", label: "Demandes", Icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-green-50 to-white shadow-lg p-6 flex flex-col justify-between rounded-2xl">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 transition duration-300">
          <FileText className="w-6 h-6 text-green-800" />
          <h2 className="text-xl font-bold text-green-900">CFI Recrute</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 mt-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant="ghost"
                className="justify-start flex items-center w-full hover:bg-green-100 hover:text-green-800 transition duration-200 rounded-xl"
              >
                <link.Icon className="w-5 h-5 mr-2 text-green-600" />
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="mt-auto">
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full hover:bg-red-50 hover:text-red-600 transition duration-200 rounded-xl"
        >
          <LogOut className="w-5 h-5 text-red-500" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}
