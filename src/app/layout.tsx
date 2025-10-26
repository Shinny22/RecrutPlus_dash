import "@/app/globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body >
        <div >
      
          <main >{children}</main>
        </div>
      </body>
    </html>
  );
}
