"use client";

import { useState } from "react";
import ModalSite from "./ModalSite"; // Aquele modal dinâmico que criamos

export default function ListaProjetosClient({ projetos }: { projetos: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<any>(null);

  const handleNovo = () => {
    setSelectedSite(null);
    setModalOpen(true);
  };

  const handleEditar = (projeto: any) => {
    setSelectedSite(projeto);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-slate-800 leading-none">Projetos</h1>
          <p className="text-sm font-bold text-slate-400 uppercase mt-2 italic">Gerenciamento de sites ativos</p>
        </div>
        
        {/* Botão agora abre o Modal em vez de ir para outra página */}
        <button 
          onClick={handleNovo}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>➕</span> Novo Projeto
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-b-4 border-b-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Ordem</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">Nome do Projeto</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">URLs</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projetos.map((projeto) => (
              <tr key={projeto.id_site} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg border border-slate-200">
                    #{projeto.ordem || 0}
                  </span>
                </td>
                <td className="p-6 font-black text-slate-800 uppercase italic text-sm">
                  {projeto.nome_site}
                </td>
                <td className="p-6 text-[10px] font-bold text-slate-400">
                   {projeto.url_home && <div className="text-blue-500">🏠 {projeto.url_home}</div>}
                   {projeto.url_admin && <div>🔐 {projeto.url_admin}</div>}
                </td>
                <td className="p-6 text-right">
                  {/* Botão de editar agora chama a função do Modal */}
                  <button 
                    onClick={() => handleEditar(projeto)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL ÚNICO PARA AMBAS AS FUNÇÕES */}
      <ModalSite 
        isOpen={modalOpen} 
        site={selectedSite} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}