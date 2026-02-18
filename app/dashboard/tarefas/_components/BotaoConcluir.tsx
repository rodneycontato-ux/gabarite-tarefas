"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusPauta } from "../_actions/atualizar-status"; 

export default function BotaoConcluirTarefa({ pautaId }: { pautaId: number }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleAction() {
    if (!confirm("Confirmar a entrega desta tarefa?")) return;
    
    setIsPending(true);
    
    // PEGANDO O VALOR DO TEXTAREA PELO NAME
    const textarea = document.getElementsByName("relato_colaborador")[0] as HTMLTextAreaElement;
    const relato = textarea?.value || "";
    
    // Passamos o relato como 3º argumento
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
      className={`
        w-full py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] transition-all shadow-xl
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