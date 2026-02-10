"use client";

import { useState } from "react";
import { salvarUsuario, excluirUsuario } from "../_actions/salvar-usuario";
import { useRouter } from "next/navigation";

export default function ModalUsuario({ usuario, isOpen, onClose }: any) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const isEdit = !!usuario?.id_usuario;

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await salvarUsuario(formData, usuario?.id_usuario);
    setIsPending(false);
    
    if (result.success) {
      router.refresh(); // Atualiza a lista por trás
      onClose();
    } else {
      alert(result.error);
    }
  }

  async function handleDelete() {
    if (!confirm(`Deseja realmente remover o colaborador "${usuario.nome}"?`)) return;
    
    setIsPending(true);
    const result = await excluirUsuario(usuario.id_usuario);
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
        
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic uppercase text-slate-900">
              {isEdit ? "Editar Colaborador" : "Novo Colaborador"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {isEdit ? `Matrícula: #${usuario.id_usuario}` : "Registro de novo membro"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        <form action={handleSubmit} className="p-8 pt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Colaborador</label>
            <input 
              name="nome" 
              defaultValue={usuario?.nome} 
              className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" 
              placeholder="Ex: João Silva"
              required 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail Profissional</label>
            <input 
              name="email" 
              type="email" 
              defaultValue={usuario?.email} 
              className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" 
              placeholder="email@empresa.com"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nível de Acesso</label>
              <select 
                name="nivel" 
                defaultValue={usuario?.nivel || 0} 
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none"
              >
                <option value={2}>2. Colaborador</option>
                <option value={1}>1. Administrador</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Chave PIX (Pagamentos)</label>
              <input 
                name="pix" 
                defaultValue={usuario?.pix} 
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500 transition-all" 
                placeholder="CPF ou E-mail" 
              />
            </div>
          </div>

          {/* RODAPÉ DE AÇÕES */}
          <div className="flex items-center gap-3 mt-8">
            {isEdit && (
              <button 
                type="button" 
                onClick={handleDelete} 
                disabled={isPending} 
                className="flex items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 min-w-[60px] self-stretch"
                title="Excluir Colaborador"
              >
                <span className="text-xl">🗑️</span>
              </button>
            )}
            
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 rounded-2xl font-black uppercase text-[11px] text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all py-5 tracking-widest"
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              disabled={isPending} 
              className="flex-[2] bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 py-5"
            >
              {isPending ? "Processando..." : isEdit ? "Salvar Alterações" : "Cadastrar Colaborador"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}