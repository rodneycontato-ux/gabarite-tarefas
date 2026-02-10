"use client";

import { useState } from "react";
import { salvarCategoria } from "../_actions/salvar-categoria";
import { excluirCategoria } from "../_actions/excluir-categoria"; // Certifique-se de criar esta action
import { useRouter } from "next/navigation";

interface ModalCategoriaProps {
  categoria?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalCategoria({ categoria, isOpen, onClose }: ModalCategoriaProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const isEdit = !!categoria?.id;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await salvarCategoria(formData, categoria?.id);
    setIsPending(false);

    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  // NOVA FUNÇÃO DE EXCLUSÃO
  async function handleDelete() {
    const confirmar = confirm(
      `⚠️ ATENÇÃO: Deseja realmente excluir a categoria "${categoria.nome_categoria}"?\n\nIsso pode falhar se houver pautas vinculadas a ela no banco de produção.`
    );

    if (!confirmar) return;

    setIsPending(true);
    const result = await excluirCategoria(categoria.id);
    setIsPending(false);

    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-8 pb-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-slate-900 leading-none">
              {isEdit ? "Editar Categoria" : "Nova Categoria"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              {isEdit ? `ID: #${categoria.id}` : "Defina o nome da categoria"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-600">✕</button>
        </div>

        <form action={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome da Categoria</label>
            <input
              name="nome_categoria"
              defaultValue={categoria?.nome_categoria || ""}
              className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700"
              placeholder="Ex: Notícia, Tutorial, Review..."
              required
            />
          </div>

          <div className="flex gap-3">
            {/* BOTÃO EXCLUIR - Só aparece se for Edição */}
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 disabled:opacity-50"
                title="Excluir Categoria"
              >
                🗑️
              </button>
            )}

            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-5 py-4 rounded-2xl font-black uppercase text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isPending}
              className="flex-[2] bg-emerald-600 text-white px-5 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
            >
              {isPending ? "Processando..." : isEdit ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}