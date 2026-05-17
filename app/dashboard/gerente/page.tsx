import { Suspense } from "react";
import GraficoCustos from "./_components/GraficoCustos";
import ResumoAdmin from "./_components/ResumoTarefas"; // Import do novo componente unificado
import UltimasTarefasConcluidas from "./_components/TarefasConcluidas"; // Novo histórico de entregas

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

      {/* 2. Chamada do Gráfico */}
      <div className="grid grid-cols-1">
        <Suspense fallback={<div className="h-75 bg-slate-100 animate-pulse rounded-4xl" />}>
          <GraficoCustos />
        </Suspense>
      </div>

      {/* 3. Últimas Tarefas Concluídas */}
      <div className="grid grid-cols-1">
        <Suspense 
          fallback={
            <div className="bg-white p-6 rounded-4xl border border-slate-100 space-y-4">
              <div className="h-6 w-48 bg-slate-100 animate-pulse rounded-md" />
              <div className="h-4 w-32 bg-slate-50 animate-pulse rounded-md" />
              <div className="space-y-3 pt-4">
                <div className="h-20 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                <div className="h-20 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                <div className="h-20 bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
              </div>
            </div>
          }
        >
          <UltimasTarefasConcluidas />
        </Suspense>
      </div>

    </div>
  );
}