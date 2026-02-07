export default function Footer() {
  return (
    <div className="w-full px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 border-t border-slate-100 bg-white">
      {/* Texto principal - Agora mais discreto */}
      <p className="font-medium">
        &copy; 2026 <span className="font-bold text-slate-600">Gabarite Tarefas</span> - Gestão de Conteúdos
      </p>
      
      {/* Versão e Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Sistema Ativo</span>
        </div>
        <span className="h-4 w-[1px] bg-slate-200"></span>
        <span className="font-mono text-[10px] bg-slate-50 px-2 py-1 rounded border border-slate-100 text-slate-400">
          v1.2
        </span>
      </div>
    </div>
  );
}