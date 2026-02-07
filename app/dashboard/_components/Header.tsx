"use client";

import { useSession, signOut } from "next-auth/react";

export function Header() {
    
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 w-full py-4 px-6 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Painel Administrativo</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700">{session?.user?.name}</p>
          <p className="text-[10px] text-slate-400 font-mono uppercase">Nível: {session?.user?.nivel === 1 ? "Gerente" : "Colaborador"}</p>
        </div>
        
        {/* Foto ou Iniciais */}
        <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {session?.user?.name?.charAt(0) || "U"}
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/entrar" })}
          className="ml-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}