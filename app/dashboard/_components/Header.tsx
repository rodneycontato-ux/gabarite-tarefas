"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu } from "lucide-react"; 
import ModalUsuario from "../usuarios/_components/ModalUsuario"; 

export function Header() {
  const { data: session } = useSession() as any;
  const [modalAberto, setModalAberto] = useState(false);

  const abrirMenu = () => window.dispatchEvent(new Event("open-sidebar"));

  const usuarioFormatado = {
    id_usuario: session?.user?.id_usuario || session?.user?.id,
    nome: session?.user?.name || session?.user?.nome,
    email: session?.user?.email,
    nivel: session?.user?.nivel,
    pix: session?.user?.pix || "", 
  };

  return (
    <header className="bg-white border-b border-slate-200 w-full py-3 px-4 flex justify-between items-center shadow-sm h-16">
      
      {/* LADO ESQUERDO: Botão + Título */}
      <div className="flex items-center gap-3">
        <button 
          onClick={abrirMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight uppercase italic leading-none">
          {session?.user?.nivel === 1 ? "Painel Gerente" : "Painel Colaborador"}
        </h2>
      </div>

      {/* LADO DIREITO: Usuário e Sair */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all group"
        >
          {/* Informação completa como era no início */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-700 leading-none group-hover:text-blue-600">
              {session?.user?.name}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {session?.user?.nivel === 1 ? "⚡ Gerente" : "🛠️ Colaborador"}
            </p>
          </div>
          
          <div className="relative w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-xs group-hover:scale-105 transition-transform">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
        </button>

        <div className="h-6 w-[1px] bg-slate-100 hidden sm:block" />

        <button 
          onClick={() => signOut({ callbackUrl: "" })}
          className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-red-500"
        >
          Sair
        </button>
      </div>

      {modalAberto && (
        <ModalUsuario 
          usuario={usuarioFormatado} 
          isOpen={modalAberto} 
          onClose={() => setModalAberto(false)} 
          isSelfEdit={true} 
        />
      )}
    </header>
  );
}