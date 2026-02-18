import { Suspense } from "react";
import GraficoCustos from "./_components/GraficoCustos";
import ResumoAdmin from "./_components/ResumoTarefas"; // Import do novo componente unificado
import CustoColaborador from "./_components/CustoColaborador";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* 1. SEÇÃO DE CARDS SUPERIORES (Unificados) */}
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
            <div className="h-32 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
            <div className="h-32 bg-slate-50 animate-pulse rounded-3xl border border-slate-100" />
          </div>
        }
      >
        <ResumoAdmin />
      </Suspense>

      {/* 2. SEÇÃO DO GRÁFICO */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-tighter italic">Fluxo de Custos (12 Meses)</h4>
          <span className="text-[10px] font-black text-slate-300 uppercase italic">Relatório Consolidado</span>
        </div>
        
        <div className="h-[250px] w-full">
          <GraficoCustos /> 
        </div>
      </div>

      {/* 3. Seção: Custo por Colaborador */}
      <Suspense fallback={<div className="h-64 bg-slate-50 animate-pulse rounded-3xl" />}>
        <CustoColaborador />
      </Suspense>

    </div>
  );
}