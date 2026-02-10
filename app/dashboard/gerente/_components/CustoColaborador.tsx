import { prisma } from "@/lib/prisma";

export default async function CustoColaborador() {
  const agora = new Date();
  const primeiroDiaMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  const usuariosComPautas = await prisma.usuario.findMany({
    where: {
      pauta: {
        some: { data_conclusao: { gte: primeiroDiaMes } }
      }
    },
    select: {
      nome: true,
      pauta: {
        where: { data_conclusao: { gte: primeiroDiaMes } },
        select: { preco: true, status: true }
      }
    }
  });

  const dadosProcessados = usuariosComPautas.map(user => {
    const estimado = user.pauta.reduce((acc, p) => acc + (p.preco || 0), 0);
    const concluido = user.pauta
      .filter(p => p.status === "1") 
      .reduce((acc, p) => acc + (p.preco || 0), 0);

    return {
      nome: user.nome || "Sem Nome",
      totalPautas: user.pauta.length,
      estimado,
      concluido
    };
  });

  const formatar = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
      {/* HEADER MAIS LIMPO */}
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h4 className="font-black text-slate-900 text-lg uppercase italic leading-none">Custos de Produção</h4>
          <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-wider">Desempenho Financeiro por Colaborador</p>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] bg-slate-900 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
             {agora.toLocaleString('pt-BR', { month: 'long' })}
           </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Colaborador</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Pautas Abertas</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Previsão Total</th>
              <th className="px-8 py-5 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-right bg-emerald-50/50">Total Concluído</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dadosProcessados.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                {/* COLABORADOR: Nome mais escuro e Avatar com mais contraste */}
                <td className="px-8 py-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-md rotate-3 group-hover:rotate-0 transition-transform">
                    {item.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-sm font-black text-slate-800 uppercase italic leading-none">
                      {item.nome}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Colaborador Ativo</span>
                  </div>
                </td>

                {/* QUANTIDADE: Fonte Mono em destaque médio */}
                <td className="px-8 py-5 text-center">
                  <span className="text-sm font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                    {item.totalPautas}
                  </span>
                </td>

                {/* PREVISTO: Texto em cinza, sem itálico excessivo para não cansar */}
                <td className="px-8 py-5 text-right text-sm font-bold text-slate-400">
                  {formatar(item.estimado)}
                </td>

                {/* CONCLUÍDO: Destaque total (Preto/Emerald) */}
                <td className="px-8 py-5 text-right bg-emerald-50/20">
                  <span className="text-lg font-black text-slate-900 tabular-nums">
                    {formatar(item.concluido)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* RODAPÉ COM TOTAL GERAL (OPCIONAL) */}
      <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase mr-4">Total Acumulado Concluído:</span>
          <span className="text-2xl font-black text-emerald-600 italic">
            {formatar(dadosProcessados.reduce((acc, curr) => acc + curr.concluido, 0))}
          </span>
      </div>
    </div>
  );
}