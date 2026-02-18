import Sidebar from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { Providers } from "../providers";
import MobileMenu from "./_components/MobileMenu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {/* h-screen e overflow-hidden para manter o scroll apenas no conteúdo */}
      <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-slate-50">
        
        {/* No mobile, isso renderiza a barra do botão. No desktop, a sidebar lateral. */}
        <MobileMenu>
          <Sidebar />
        </MobileMenu>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* O Header agora vem LOGO ABAIXO da barra do botão no mobile */}
          <Header />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}