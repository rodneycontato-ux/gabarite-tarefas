import { prisma } from "@/lib/prisma";

export default async function CustoColaborador() {
  const agora = new Date();
  const primeiroDiaMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

  // Busca pautas onde a CONCLUSÃO ocorreu neste mês
  const usuariosComPautas = await prisma.usuario.findMany({
    where: {
      pauta: {
        some: { 
            data_conclusao: { gte: primeiroDiaMes } 
        }
      }
    },
    select: {
      nome: true,
      pauta: {
        where: { data_conclusao: { gte: primeiroDiaMes } },
        select: {
          preco: true,
          status: true,
          data_conclusao: true
        }
      }
    }
  });

  const dadosProcessados = usuariosComPautas.map(user => {
    // Estimado: Tudo que foi concluído este mês (Previsão total)
    const estimado = user.pauta.reduce((acc, p) => acc + (p.preco || 0), 0);
    
    // Realizado: Apenas o que está com status "1" (Concluído para pagar)
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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-tighter italic">Custo por Colaborador</h4>
          <p className="text-[10px] text-slate-400 font-medium">Baseado na Data de Conclusão</p>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-black uppercase">Mês Atual</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tarefas</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest text-right">Total Previsto</th>
              <th className="px-6 py-4 text-[10px] font-black text-emerald-700 uppercase tracking-widest text-right bg-emerald-50/30">Total Concluído</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {dadosProcessados.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition group">
                <td className="px-6 py-4 text-sm font-black italic text-slate-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm">
                    {item.nome.substring(0, 2).toUpperCase()}
                  </div>
                  {item.nome}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-center text-slate-400">{item.totalPautas}</td>
                <td className="px-6 py-4 text-sm font-medium text-right text-slate-300 italic">{formatar(item.estimado)}</td>
                <td className="px-6 py-4 text-right bg-emerald-50/10">
                  <span className="text-xl font-black text-emerald-600 italic font-mono leading-none">
                    {formatar(item.concluido)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}