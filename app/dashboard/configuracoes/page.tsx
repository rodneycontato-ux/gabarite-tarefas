import Link from "next/link";

export default function ConfiguracoesPage() {
  const menus = [
    {
      titulo: "Sites",
      descricao: "Gerenciar sites e domínios",
      link: "/dashboard/configuracoes/sites",
      emoji: "🌐",
      cor: "bg-blue-50 text-blue-600",
      borda: "hover:border-blue-500"
    },
    {
      titulo: "Categorias",
      descricao: "Ajustar tipos de tarefas",
      link: "/dashboard/configuracoes/categorias",
      emoji: "📁",
      cor: "bg-emerald-50 text-emerald-600",
      borda: "hover:border-emerald-500"
    }
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-10">
        <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">
          Configurações
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
          Gerenciamento de tabelas auxiliares
        </p>
      </div>

      {/* Grid com apenas os dois cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menus.map((item) => (
          <Link key={item.titulo} href={item.link} className="cursor-pointer">
            <div className={`group bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm transition-all hover:shadow-xl border-b-4 border-b-slate-200 ${item.borda} flex flex-col items-center text-center`}>
              
              <div className={`w-24 h-24 ${item.cor} rounded-[2rem] flex items-center justify-center text-5xl mb-6 transition-transform group-hover:scale-110 duration-300`}>
                {item.emoji}
              </div>

              <h3 className="text-2xl font-black uppercase italic text-slate-800 mb-2">
                {item.titulo}
              </h3>
              
              <p className="text-sm font-medium text-slate-400">
                {item.descricao}
              </p>

              <div className="mt-8 text-[11px] font-black uppercase text-blue-600 flex items-center gap-2">
                Acessar agora 👉
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}