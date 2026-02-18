import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-12 text-center border border-slate-100">
        
        {/* Logo Minimalista */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-indigo-200">
            G
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Gabarite Tarefas
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Ambiente restrito para colaboradores
          </p>
        </div>

        {/* Botão Único de Acesso */}
        <Link 
          href="/entrar" 
          className="group relative flex items-center justify-center w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200"
        >
          Acessar Dashboard
          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        {/* Footer Discreto */}
        <div className="mt-10 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            Sistema de Gestão Interna v2.0
          </p>
        </div>
      </div>
    </div>
  );
}