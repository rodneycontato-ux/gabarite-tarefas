import { Suspense } from "react";
import GraficoGanhos from "./_components/GraficoGanhos";
import ResumoFinanceiro from "./_components/ResumoTarefas"; // Novo componente unificado
import CardInformativo from "./_components/CardInformativo";

export default function PainelColaborador() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* 1. SEÇÃO DE CARDS SUPERIORES (Unificados) */}
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />
            <div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />
            <div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />
          </div>
        }
      >
        <ResumoFinanceiro />
      </Suspense>

      {/* 2. Chamada do Gráfico */}
      <div className="grid grid-cols-1">
        <Suspense fallback={<div className="h-[300px] bg-slate-100 animate-pulse rounded-[2rem]" />}>
          <GraficoGanhos />
        </Suspense>
      </div>

      {/* 3. Card Informativo / FAQ */}
      <div className="grid grid-cols-1">
        <CardInformativo />
      </div>

    </div>
  );
}