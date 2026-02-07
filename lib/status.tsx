// Arquivo: lib/status.tsx

// Tradutor para Nível de Usuário
export function getNivelUsuario(nivel: number | string | null) {
  const base = "border shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-3 py-1 rounded-full text-[9px] font-black uppercase";
  
  if (nivel === 1 || nivel === "1") {
    return <span className={`bg-purple-50 text-purple-600 border-purple-100 ${base}`}>Gerente</span>;
  }
  if (nivel === 2 || nivel === "2") {
    return <span className={`bg-slate-100 text-slate-600 border-slate-200 ${base}`}>Colaborador</span>;
  }
  return <span className={`bg-gray-50 text-gray-500 border-gray-200 ${base}`}>Usuário</span>;
}

// Tradutor para Status da Pauta
export function getStatusPauta(status: number | string | null) {
  const base = "border shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-3 py-1 rounded-full text-[9px] font-black uppercase";

  if (status === 1 || status === "1") {
    return <span className={`bg-emerald-50 text-emerald-600 border-emerald-100 ${base}`}>Concluído</span>;
  }
  if (status === 2 || status === "2") {
    return <span className={`bg-red-50 text-red-600 border-red-100 ${base}`}>Pendente</span>;
  }
  if (status === 3 || status === "3") {
    return <span className={`bg-amber-50 text-amber-600 border-amber-100 ${base}`}>Aberto</span>;
    
  }
  return <span className={`bg-slate-50 text-slate-500 border-slate-200 ${base}`}>Outro</span>;
}

// Tradutor para Status de Pagamento
export function getStatusPagamento(status: string | null) {
  const base = "border shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-3 py-1 rounded-full text-[9px] font-black uppercase";

  if (status === "pago") {
    return <span className={`bg-emerald-50 text-emerald-600 border-emerald-100 ${base}`}>Pago</span>;
  }
  if (status === "pendente") {
    return <span className={`bg-red-50 text-red-600 border-red-100 ${base}`}>Processando</span>;
  }
  return <span className={`bg-slate-50 text-slate-500 border-slate-200 ${base}`}>Outro</span>;
}