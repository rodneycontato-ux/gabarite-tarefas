import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ListaCategoriasPage() {
  // Busca todas as categorias ordenadas por nome para facilitar a localização
  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nome_categoria: 'asc'
    }
  });

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-slate-800 leading-none">
            Categorias
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase mt-2 italic">
            Classificação das pautas no sistema
          </p>
        </div>
        
        <Link 
          href="/dashboard/configuracoes/categorias/novo" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>➕</span> Nova Categoria
        </Link>
      </div>

      {/* Tabela de Categorias */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden border-b-4 border-b-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider w-24">ID</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider">Nome da Categoria</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <span className="text-xs font-bold text-slate-300">#{cat.id}</span>
                </td>
                <td className="p-6">
                  <span className="text-sm font-black text-slate-800 uppercase italic">
                    {cat.nome_categoria || "Sem Nome"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <Link 
                    href={`/dashboard/configuracoes/categorias/editar/${cat.id}`}
                    className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm"
                    title="Editar Categoria"
                  >
                    ✏️
                  </Link>
                </td>
              </tr>
            ))}
            
            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="p-20 text-center">
                  <span className="text-4xl block mb-4">📂</span>
                  <p className="text-sm font-bold text-slate-300 uppercase italic">Nenhuma categoria encontrada.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Voltar */}
      <div className="mt-8 flex justify-between items-center">
        <Link href="/dashboard/configuracoes" className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2 cursor-pointer transition-colors">
          👈 Voltar para Configurações
        </Link>
        <span className="text-[10px] font-bold text-slate-300 uppercase italic">
          Total: {categorias.length} itens
        </span>
      </div>
    </div>
  );
}