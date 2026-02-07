import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ListaProjetosPage() {
  // Busca os projetos ordenados
  const projetos = await prisma.site.findMany({
    orderBy: {
      ordem: 'asc'
    }
  });

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {/* Cabeçalho com Botão de Novo */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-slate-800 leading-none">
            Projetos
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase mt-2 italic">
            Gerenciamento de sites ativos
          </p>
        </div>
        
        <Link 
          href="/dashboard/configuracoes/projetos/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>➕</span> Novo Projeto
        </Link>
      </div>

      {/* Tabela de Projetos */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-b-4 border-b-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Ordem</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome do Projeto</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">URLs</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projetos.map((projeto) => (
              <tr key={projeto.id_site} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-lg border border-slate-200">
                    #{projeto.ordem || 0}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 uppercase italic">
                      {projeto.nome_site}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold">ID: {projeto.id_site}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <a href={projeto.url_home || "#"} target="_blank" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                      🏠 {projeto.url_home || "---"}
                    </a>
                    <a href={projeto.url_admin || "#"} target="_blank" className="text-[10px] font-bold text-slate-400 hover:underline flex items-center gap-1">
                      🔐 {projeto.url_admin || "---"}
                    </a>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <Link 
                    href={`/dashboard/configuracoes/projetos/editar/${projeto.id_site}`}
                    className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-sm"
                    title="Editar Projeto"
                  >
                    ✏️
                  </Link>
                </td>
              </tr>
            ))}
            
            {projetos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <span className="text-4xl block mb-4">📭</span>
                  <p className="text-sm font-bold text-slate-300 uppercase italic">Nenhum projeto cadastrado no banco.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Voltar */}
      <div className="mt-8">
        <Link href="/dashboard/configuracoes" className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2 cursor-pointer transition-colors">
          👈 Voltar para Configurações
        </Link>
      </div>
    </div>
  );
}