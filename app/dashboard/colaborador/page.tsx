import { Suspense } from "react";
import GraficoGanhos from "./_components/GraficoGanhos";
import PautasDisponiveis from "./_components/PautasDisponiveis";
import ProducaoMensal from "./_components/ProducaoMensal";
import ProducaoPotencial from "./_components/ProducaoAberta";
import CardInformativo from "./_components/CardInformativo";

export default function PainelColaborador() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* 1. SEÇÃO DE CARDS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CHAMADA TAREFAS DISCPONÍVEIS */}
        <Suspense fallback={<div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />}>
          <PautasDisponiveis />
        </Suspense>

        {/* CHAMADA PUATAS ABERTAS */}
        <Suspense fallback={<div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />}>
          <ProducaoPotencial />
        </Suspense>

       {/* CHAMADA PAUTAS CONCLÍDAS */}
        <Suspense fallback={<div className="h-32 bg-white animate-pulse rounded-[2rem] border border-slate-100" />}>
          <ProducaoMensal />
        </Suspense>

      </div>

      {/* 2. Chamada do Gráfico */}
      <div className="grid grid-cols-1">
        <Suspense fallback={<div className="h-[300px] bg-slate-100 animate-pulse rounded-[2rem]" />}>
          <GraficoGanhos />
        </Suspense>
      </div>

      {/* CARD INFORMATIVO (Abaixo dos cards de status) */}
      <div className="grid grid-cols-1 gap-6">
        <CardInformativo />
      </div>

    </div>
  );
}