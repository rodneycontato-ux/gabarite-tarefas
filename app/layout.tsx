import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabarite Tarefas - Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body suppressHydrationWarning >
       
        {/* Área de Conteúdo */}
        <main>
          {children}
        </main>
          
        
      </body>
    </html>
  );
}
