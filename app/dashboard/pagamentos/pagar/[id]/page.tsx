import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BotaoPagarMP from "../../_components/BotaoPagarMP";

export default async function PagarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pagamento = await prisma.pagamentos.findUnique({
    where: { id_pagamento: Number(id) },
    include: {
      usuario: true, // Traz o nome e o PIX do colaborador
    },
  });

  if (!pagamento) notFound();

  // Estilos rápidos para seguir o padrão do seu sistema
  const cardStyle = "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl max-w-2xl mx-auto mt-10";

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className={cardStyle}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              Checkout de Pagamento
            </span>
            <h1 className="text-3xl font-black uppercase italic text-slate-900 mt-4">
              Pagar Colaborador
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Referência</p>
            <p className="font-black text-slate-700">{pagamento.mes}/{pagamento.ano}</p>
          </div>
        </div>

        <div className="space-y-6 border-y border-slate-50 py-8 mb-8">
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold uppercase text-xs">Favorecido:</span>
            <span className="text-slate-900 font-black uppercase italic">{pagamento.usuario.nome}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-400 font-bold uppercase text-xs">Chave PIX:</span>
            <span className="text-blue-600 font-black">{pagamento.usuario.pix || "NÃO CADASTRADA"}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <span className="text-slate-500 font-bold uppercase text-xs">Total a Transferir:</span>
            <span className="text-2xl font-black text-slate-900">
              R$ {Number(pagamento.total_valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Componente Client que terá a lógica do Mercado Pago */}
        <BotaoPagarMP 
          idPagamento={pagamento.id_pagamento} 
          valor={Number(pagamento.total_valor)} 
          pix={pagamento.usuario.pix}
          status={pagamento.status}
        />
        
        <p className="text-center text-[9px] text-slate-400 uppercase font-bold mt-6 tracking-tighter">
          Atenção: Ao clicar em confirmar, o status será atualizado para pago.
        </p>
      </div>
    </div>
  );
}