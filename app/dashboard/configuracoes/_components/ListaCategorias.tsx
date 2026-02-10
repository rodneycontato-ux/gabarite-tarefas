"use client";

import { useState } from "react";
import ModalCategoria from "./ModalCategoria";

export default function ListaCategoriasClient({ categorias }: { categorias: any[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);

  const handleNovo = () => {
    setSelectedCat(null); // Limpa para modo cadastro
    setModalOpen(true);
  };

  const handleEditar = (cat: any) => {
    setSelectedCat(cat); // Preenche para modo edição
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-slate-800 leading-none">
            Categorias
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase mt-2 italic">
            Classificação das pautas no sistema
          </p>
        </div>
        
        <button 
          onClick={handleNovo}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>➕</span> Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-b-4 border-b-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider w-24">ID</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome da Categoria</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6 text-xs font-bold text-slate-300">#{cat.id}</td>
                <td className="p-6 text-sm font-black text-slate-800 uppercase italic">
                  {cat.nome_categoria || "Sem Nome"}
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => handleEditar(cat)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
            
            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="p-20 text-center text-slate-300 font-bold uppercase italic text-sm">
                  Nenhuma categoria encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* O Modal que criamos no passo anterior */}
      <ModalCategoria 
        isOpen={modalOpen} 
        categoria={selectedCat} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}