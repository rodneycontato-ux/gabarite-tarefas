"use client";

import { useState, useEffect } from "react";
import { salvarUsuario, excluirUsuario } from "../_actions/salvar-usuario"; // Importado de volta
import { buscarUsuarioPorId } from "../_actions/buscar-usuario";
import { useRouter } from "next/navigation";

export default function ModalUsuario({ usuario, isOpen, onClose, isSelfEdit = false }: any) {
  const [userData, setUserData] = useState(usuario);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEdit = !!(usuario?.id_usuario || usuario?.id);

  useEffect(() => {
    async function carregarDados() {
      const id = usuario?.id_usuario || usuario?.id;
      if (isOpen && id) {
        setIsLoading(true);
        const freshData = await buscarUsuarioPorId(Number(id));
        if (freshData) setUserData(freshData);
        setIsLoading(false);
      } else if (isOpen && !id) {
        setUserData(null);
      }
    }
    carregarDados();
  }, [isOpen, usuario]);

  // APRENDIZADO: Função de exclusão com confirmação para segurança em produção
  async function handleDelete() {
    const id = userData?.id_usuario || usuario?.id_usuario;
    if (!id) return;

    if (!confirm(`Deseja realmente remover o colaborador "${userData?.nome || 'este usuário'}"?`)) return;
    
    setIsPending(true);
    const result = await excluirUsuario(Number(id));
    setIsPending(false);
    
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
  }

  if (!isOpen) return null;

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const idParaSalvar = userData?.id_usuario || usuario?.id_usuario || usuario?.id;
    const result = await salvarUsuario(formData, idParaSalvar ? Number(idParaSalvar) : undefined);
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
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8">
        {isLoading ? (
          <div className="flex justify-center py-10 font-bold text-slate-400 italic">Buscando dados...</div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black italic uppercase text-slate-900">
                {isSelfEdit ? "Meu Perfil" : isEdit ? "Editar Colaborador" : "Novo Colaborador"}
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>

            <form action={handleSubmit} className="flex flex-col gap-4">
              {isSelfEdit && <input type="hidden" name="nivel" value={userData?.nivel} />}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome</label>
                <input name="nome" defaultValue={userData?.nome || ""} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500" required />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">E-mail</label>
                <input name="email" type="email" defaultValue={userData?.email || ""} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nível</label>
                  <select 
                    name="nivel" 
                    defaultValue={userData?.nivel || 2} 
                    disabled={isSelfEdit && userData?.nivel !== 1}
                    className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
                  >
                    <option value={2}>2. Colaborador</option>
                    <option value={1}>1. Administrador</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Chave PIX</label>
                  <input name="pix" defaultValue={userData?.pix || ""} className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-blue-500" placeholder="CPF ou E-mail" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8">
                {/* APRENDIZADO: O botão de lixeira só aparece se for Edição E NÃO for o seu próprio perfil */}
                {isEdit && !isSelfEdit && (
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
                
                <button type="button" onClick={onClose} className="flex-1 rounded-2xl font-black text-slate-500 bg-slate-100 py-5 uppercase text-[11px]">Cancelar</button>
                
                <button type="submit" disabled={isPending} className="flex-[2] bg-slate-900 text-white rounded-2xl font-black py-5 uppercase text-[11px] hover:bg-blue-600 transition-all">
                  {isPending ? "Processando..." : isEdit ? "Salvar Alterações" : "Cadastrar Agora"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}