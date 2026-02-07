"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pagarColaboradorAction } from "../_actions/pagar-pix"; // Referência para a action

export default function BotaoPagarMP({ idPagamento, valor, pix, status }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePagamento() {
    if (!pix) {
      alert("Erro: Colaborador sem chave PIX.");
      return;
    }

    if (status === "pago") {
      alert("Este pagamento já consta como realizado.");
      return;
    }

    const confirmar = confirm(`Deseja confirmar o pagamento de R$ ${valor}? (Ação direta no banco)`);
    if (!confirmar) return;

    setLoading(true);

    try {
      const res = await pagarColaboradorAction(idPagamento);

      if (res?.success) {
        alert("✅ Status atualizado com sucesso!");
        router.push("/dashboard/pagamentos");
        router.refresh();
      } else {
        alert("❌ Erro: " + res.error);
      }
    } catch (error) {
      alert("Ocorreu um erro crítico na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePagamento}
      disabled={loading || status === "pago"}
      className={`w-full p-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3
        ${status === "pago" 
          ? "bg-emerald-500 text-white cursor-not-allowed" 
          : "bg-blue-600 hover:bg-slate-900 text-white active:scale-95"
        }`}
    >
      {loading ? "PROCESSANDO..." : status === "pago" ? "✅ PAGO" : "💸 CONFIRMAR PAGAMENTO"}
    </button>
  );
}