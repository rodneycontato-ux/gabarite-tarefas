import { Suspense } from "react";
import GraficoCustos from "./_components/GraficoCustos";
import TarefasPendentes from "./_components/TarefasPendentes";
import TarefasIniciadas from "./_components/TarefasIniciadas";
import PagamentosPendente from "./_components/PagamentosPendente";
import CustoColaborador from "./_components/CustoColaborador";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
          {/* Card 1: Tarefas para Produção (Backlog/Aguardando) */}
          <Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-3xl" />}>
            <TarefasPendentes />
          </Suspense>

          {/* Card 2: Tarefas em Produção (O que está sendo feito agora) */}
          <Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-3xl" />}>
            <TarefasIniciadas />
          </Suspense>

          {/* Card 3: Pagamentos em Aberto (O que já foi feito e precisa pagar) */}
          <Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse rounded-3xl" />}>
            <PagamentosPendente />
          </Suspense>
        
      </div>

      {/* SEÇÃO DO GRÁFICO (Corrigida) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-tighter italic">Fluxo de Custos (12 Meses)</h4>
          <span className="text-[10px] font-black text-slate-300 uppercase italic">Relatório Consolidado</span>
        </div>
        
        {/* Chamada do componente de gráfico */}
        <div className="h-[250px] w-full">
          <GraficoCustos /> 
        </div>
      </div>

      {/* Seção: Custo por Colaborador */}
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse rounded-3xl" />}>
        <CustoColaborador />
      </Suspense>

    </div>
  );
}