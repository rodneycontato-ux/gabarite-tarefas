"use client";

import { useState } from "react";
import ModalUsuario from "./ModalUsuario"; 
import { getNivelUsuario } from "@/lib/status";

export default function UsuariosClient({ usuarios }: { usuarios: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);

  const abrirParaEditar = (u: any) => {
    setUsuarioSelecionado(u);
    setModalOpen(true);
  };

  const abrirParaNovo = () => {
    setUsuarioSelecionado(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">Colaboradores</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">Gerenciamento de equipe</p>
        </div>
        
        <button 
          onClick={abrirParaNovo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          ➕ Novo Colaborador
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Nome</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Email</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-center text-slate-400">Nível</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase text-right text-slate-400">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="hover:bg-slate-50/50 transition group">
                <td className="px-6 py-4 text-sm font-black italic text-slate-700 uppercase">{u.nome}</td>
                <td className="px-6 py-4 text-xs text-slate-400 font-bold">{u.email}</td>
                <td className="px-6 py-4 text-center">
                  <span>
                    {getNivelUsuario(u.nivel)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => abrirParaEditar(u)}
                    className="bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all"
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalUsuario 
        isOpen={modalOpen} 
        usuario={usuarioSelecionado} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}