"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import ModalUsuario from "../usuarios/_components/ModalUsuario"; 

export function Header() {
  const { data: session, update } = useSession() as any; // 'update' serve para atualizar a sessão após salvar
  const [modalAberto, setModalAberto] = useState(false);

  // Aprendizado: O ModalUsuario espera "nome" e "id_usuario" (conforme seu Prisma).
  // Se o NextAuth salvar como "user.id", o Modal não vai encontrar o ID e a Action vai falhar.
  const usuarioFormatado = {
    id_usuario: session?.user?.id_usuario || session?.user?.id, // Tenta as duas opções comuns
    nome: session?.user?.name || session?.user?.nome,
    email: session?.user?.email,
    nivel: session?.user?.nivel,
    pix: session?.user?.pix || "", 
  };

  return (
    <header className="bg-white border-b border-slate-200 w-full py-4 px-6 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">
          {session?.user?.nivel === 1 ? "Painel Gerente" : "Painel Colaborador"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-2xl transition-all group border border-transparent hover:border-slate-100"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-700 leading-none group-hover:text-blue-600">
              {session?.user?.name}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {session?.user?.nivel === 1 ? "⚡ Gerente" : "🛠️ Colaborador"}
            </p>
          </div>
          
          <div className="relative w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:scale-105 transition-transform">
            {session?.user?.name?.charAt(0) || "U"}
            <div className="absolute -bottom-1 -right-1 bg-white border border-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
              ✏️
            </div>
          </div>
        </button>

        <div className="h-8 w-[1px] bg-slate-100" />

        <button 
          onClick={() => signOut({ callbackUrl: "/entrar" })}
          className="text-[10px] font-black uppercase tracking-tighter text-slate-400 hover:text-red-500 transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Modal de Edição de Perfil */}
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