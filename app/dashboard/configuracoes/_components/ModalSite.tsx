"use client";

import { useState } from "react";
import { salvarSite } from "../_actions/salvar-site";
import { excluirSite } from "../_actions/excluir-site"; // Importe a action de excluir
import { useRouter } from "next/navigation";

interface ModalSiteProps {
  site?: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSite({ site, isOpen, onClose }: ModalSiteProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const isEdit = !!site?.id_site;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await salvarSite(formData, site?.id_site);
    setIsPending(false);

    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  // FUNÇÃO PARA EXCLUIR O SITE
  async function handleDelete() {
    const confirmar = confirm(
      `⚠️ ATENÇÃO: Deseja realmente excluir o projeto "${site.nome_site}"?\n\nEsta ação falhará se houver pautas vinculadas a este site no banco de produção.`
    );

    if (!confirmar) return;

    setIsPending(true);
    const result = await excluirSite(site.id_site);
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
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-8 pb-0 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-slate-900 leading-none">
              {isEdit ? "Editar Projeto" : "Novo Projeto"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              {isEdit ? `ID: #${site.id_site}` : "Preencha os dados abaixo"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        <form action={handleSubmit} className="p-8 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Site</label>
              <input
                name="nome_site"
                defaultValue={site?.nome_site || ""}
                className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Ordem</label>
              <input
                name="ordem"
                type="number"
                defaultValue={site?.ordem || ""}
                className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">URL Home</label>
            <input
              name="url_home"
              defaultValue={site?.url_home || ""}
              className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
              placeholder="https://meusite.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">URL Admin</label>
            <input
              name="url_admin"
              defaultValue={site?.url_admin || ""}
              className="px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
              placeholder="https://meusite.com/wp-admin"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {/* BOTÃO EXCLUIR - Só visível na edição */}
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 disabled:opacity-50"
                title="Excluir Projeto"
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
              className="flex-[2] bg-blue-600 text-white px-5 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {isPending ? "Processando..." : isEdit ? "Salvar Alterações" : "Cadastrar Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}