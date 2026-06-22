import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar fixe */}
          <Sidebar />

          {/* Contenu principal scrollable */}
          <main className="flex-1 flex flex-col overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
