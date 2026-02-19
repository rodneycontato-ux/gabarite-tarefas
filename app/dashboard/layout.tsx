import Sidebar from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { Providers } from "../providers";
import MobileMenu from "./_components/MobileMenu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50">
        <MobileMenu>
          <Sidebar />
        </MobileMenu>

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}