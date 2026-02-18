import { prisma } from "@/lib/prisma";
import { getStatusPagamento } from "@/lib/status";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Mesma interface que funcionou em Tarefas
interface CustomSession {
  user?: {
    id_usuario?: number;
    nivel?: number;
  };
}

async function getPagamentos(nivel?: number, idUsuario?: number) {
  try {
    // Se for Nível 1 (Gerente), whereCondition continua vazio {} para trazer tudo
    // Se for Nível 2 (Colaborador), traz apenas o dele
    const whereCondition = nivel === 1 ? {} : { id_usuario: idUsuario ? Number(idUsuario) : 0 };

    const lista = await prisma.pagamentos.findMany({
      where: whereCondition,
      include: {
        usuario: true 
      },
      orderBy: {
        criado_em: 'desc'
      },
      take: 50
    });
    return lista;
  } catch (error) {
    console.error("Erro ao carregar pagamentos:", error);
    return [];
  }
}

export default async function PagamentosPage() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const nivel = session?.user?.nivel;
  const idUsuario = session?.user?.id_usuario;

  const pagamentos = await getPagamentos(nivel, idUsuario);
  
  const BRL = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">Pagamentos
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">
          Histórico de recebimentos
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Referência</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Total</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">Status / Ação</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-50">
            {pagamentos.map((p) => (
              <tr key={p.id_pagamento} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-sm font-black italic text-slate-700 uppercase">
                   {p.usuario?.nome || "---"}
                </td>

                <td className="px-8 py-5 text-center">
                  <span className="text-[11px] font-black text-slate-500 uppercase italic bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                    {p.mes.toString().padStart(2, '0')}/{p.ano}
                  </span>
                </td>

                <td className="px-8 py-5 text-sm font-black text-slate-900 italic">
                  {BRL.format(Number(p.total_valor))}
                </td>

                <td className="px-8 py-5 text-center">
                  {/* Botão de pagar aparece apenas para Nível 1 */}
                  {p.status === "pendente" && nivel === 1 ? (
                    <Link 
                      href={`/dashboard/pagamentos/pagar/${p.id_pagamento}`}
                      className="bg-blue-600 hover:bg-slate-900 text-white text-[9px] font-black uppercase italic tracking-widest px-5 py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2 active:scale-95 border-b-4 border-blue-800"
                    >
                      <span>💸</span> Pagar Agora
                    </Link>
                  ) : (
                    <div className="inline-block transform scale-90">
                      {getStatusPagamento(p.status)}
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {pagamentos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-xs font-black uppercase text-slate-300 italic tracking-[0.3em]">
                   Nenhum pagamento registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}