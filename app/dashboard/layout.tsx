// app/dashboard/layout.tsx
import Sidebar from "./_components/Sidebar";
import Footer from "./_components/Footer";
import { Header } from "./_components/Header";
import { Providers } from "../providers"; // Ajuste o caminho conforme onde você criou o arquivo

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers> {/* O Providers "abraça" tudo que está no dashboard */}
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        
        {/* Esquerda: Menu (Fixo) */}
        <aside className="w-64 flex-shrink-0 bg-[#1e293b]">
          <Sidebar />
        </aside>

        {/* Direita: Área de Scroll Total */}
        <div className="flex-1 overflow-y-auto min-w-0 h-full flex flex-col">

          {/* O Header agora vai funcionar porque o Providers está acima dele */}
          <Header />
          
          {/* CONTEÚDO */}
          <main className="flex-1 p-8">
            {children}
          </main>
          
          {/* FOOTER */}
          <footer className="w-full bg-white border-t border-slate-200">
            <Footer />
          </footer>
          
        </div>
      </div>
    </Providers>
  );
}