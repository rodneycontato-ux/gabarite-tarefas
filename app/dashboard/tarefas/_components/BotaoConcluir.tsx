"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPauta } from "../_actions/atualizar-status"; 

export default function BotaoConcluirTarefa({ pautaId }: { pautaId: number }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleAction() {
    // 1. BUSCA A TEXTAREA NA TELA
    const textarea = document.getElementsByName("relato_colaborador")[0] as HTMLTextAreaElement;
    const relato = textarea?.value || "";

    // 2. VALIDAÇÃO BLINDADA: SE TIVER VAZIA OU SÓ COM ESPAÇOS, TRAVA AQUI
    if (!relato.trim()) {
      alert("⚠️ O preenchimento do 'Relato da Execução' é obrigatório para concluir a tarefa!");
      textarea?.focus(); // Joga o cursor do usuário direto para a caixa de texto
      return;
    }

    // 3. SE PASSOU NA VALIDAÇÃO, PEDE A CONFIRMAÇÃO DO USUÁRIO
    if (!confirm("Confirmar a entrega desta tarefa?")) return;
    
    setIsPending(true);
    
    // Passamos o relato como 3º argumento para a sua Action
    const result = await atualizarStatusPauta(pautaId, 1, relato);
    
    if (result.success) {
      router.push("/dashboard/tarefas");
      router.refresh();
    } else {
      alert("Erro ao concluir: " + (result.error || "Erro desconhecido"));
      setIsPending(false);
    }
  }

  return (
    <button
      onClick={handleAction}
      disabled={isPending}
      type="button"
      className={`
        w-full py-6 rounded-4xl font-black uppercase text-[12px] tracking-[0.2em] transition-all shadow-xl
        ${isPending 
          ? "bg-slate-200 text-slate-400 cursor-wait" 
          : "bg-blue-600 text-white hover:bg-green-600 shadow-blue-200 hover:shadow-green-200 active:scale-[0.98]"
        }
      `}
    >
      {isPending ? "Enviando para Aprovação..." : "✅ Confirmar Entrega"}
    </button>
  );
}