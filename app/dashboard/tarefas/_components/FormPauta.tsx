"use client";

import { useState } from "react";
import { criarPauta } from "../_actions/cadastrar"; 
import { editarPauta } from "../_actions/editar"; 
import { excluirPauta } from "../_actions/excluir"; 
import Editor from "../../_components/Editor";

/**
 * Helper para formatar objetos Date para o formato aceito pelo input datetime-local:
 * YYYY-MM-DDTHH:mm
 */
const formatarDataParaInput = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  
  // Ajuste para o fuso horário local e formatação para o input
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function FormPauta({ 
  sites, 
  categorias, 
  usuarios, 
  pauta 
}: { 
  sites: any[], 
  categorias: any[], 
  usuarios: any[], 
  pauta?: any 
}) {
  const [texto, setTexto] = useState(pauta?.texto || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("texto", texto);

    const res = pauta?.id_pauta 
      ? await editarPauta(pauta.id_pauta, formData) 
      : await criarPauta(formData);
    
    if (res?.error) {
      alert("Erro: " + res.error);
      setLoading(false);
    } else {
      alert(pauta ? "Tarefa atualizada!" : "Tarefa cadastrada!");
      window.location.href = "/dashboard/tarefas"; 
    }
  }

  async function handleExcluir() {
    if (confirm(`Atenção: Deseja realmente excluir a pauta #${pauta.id_pauta}?`)) {
      setLoading(true);
      const res = await excluirPauta(pauta.id_pauta);
      if (res?.error) {
        alert("Erro ao excluir: " + res.error);
        setLoading(false);
      } else {
        alert("Pauta removida com sucesso.");
        window.location.href = "/dashboard/tarefas";
      }
    }
  }

  const labelStyle = "text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1";
  const inputStyle = "bg-slate-50 border border-slate-100 text-slate-900 p-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 text-sm font-bold uppercase italic w-full";

  return (
    <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm border-b-4 border-b-slate-200 text-slate-900">
      
      <input type="hidden" name="id_pauta" value={pauta?.id_pauta || ""} />

      {/* Cabeçalho */}
      <div className="col-span-full mb-4 flex justify-between items-start">
        <div>
            <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1 rounded-full border border-blue-100 uppercase">
                    {pauta ? `Editando #${pauta.id_pauta}` : "Novo Registro"}
                </span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-800 leading-none mt-4">
                {pauta ? "Alterar Tarefa" : "Criar Tarefa"}
            </h2>
        </div>
      </div>

      {/* TÍTULO */}
      <div className="col-span-full flex flex-col">
        <label className={labelStyle}>Título da Tarefa</label>
        <input 
          name="titulo" 
          type="text" 
          required 
          className={inputStyle} 
          placeholder="EX: CRIAR POST PARA INSTAGRAM..." 
          defaultValue={pauta?.titulo || ""}
        />
      </div>

      {/* LINHA 1: COLABORADOR E STATUS */}
      <div className="flex flex-col">
        <label className={labelStyle}>Colaborador Responsável</label>
        <select 
          name="id_usuario" 
          className={inputStyle} 
          defaultValue={pauta?.id_usuario || ""}
        >
          <option value="">Selecionar colaborador...</option>
          {usuarios?.map(u => (
            <option key={u.id_usuario} value={u.id_usuario}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Status do Fluxo</label>
        <select name="status" className={inputStyle} defaultValue={pauta?.status || "3"}>
          <option value="3">🟡 3. Aberto</option>
          <option value="2">🟠 2. Pendente</option>
          <option value="1">🟢 1. Concluído</option>
        </select>
      </div>

      {/* LINHA 2: SITE E CATEGORIA */}
      <div className="flex flex-col">
        <label className={labelStyle}>Site Destino</label>
        <select 
          name="id_site" 
          required 
          className={inputStyle} 
          defaultValue={pauta?.id_site || ""}
        >
          <option value="">Selecionar site...</option>
          {sites.map(s => (
            <option key={s.id_site} value={s.id_site}>
              {s.nome_site}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Categoria</label>
        <select 
          name="id_categoria" 
          required 
          className={inputStyle} 
          defaultValue={pauta?.id_categoria || ""}
        >
          <option value="">Selecionar categoria...</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome_categoria}
            </option>
          ))}
        </select>
      </div>

      {/* NOVO: LINHA 3 - DATAS (Início Padrão Hoje e Conclusão Opcional) */}
      <div className="flex flex-col">
        <label className={labelStyle}>Data de Início</label>
        <input 
          name="data_inicio" 
          type="datetime-local" 
          className={inputStyle} 
          // Se for edição, mantém a data original. Se for novo, coloca a data de hoje.
          defaultValue={pauta?.data_inicio ? formatarDataParaInput(pauta.data_inicio) : formatarDataParaInput(new Date())}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Data de Conclusão (Opcional)</label>
        <input 
          name="data_conclusao" 
          type="datetime-local" 
          className={inputStyle} 
          // Vem sempre vazio se for novo ou se não tiver no banco
          defaultValue={formatarDataParaInput(pauta?.data_conclusao)}
        />
      </div>

      {/* LINHA 4: VALOR */}
      <div className="col-span-full flex flex-col">
        <label className={labelStyle}>Valor da Pauta</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">R$</span>
          <input 
            name="preco" 
            type="number" 
            step="0.01" 
            className={`${inputStyle} pl-12`} 
            placeholder="0,00" 
            defaultValue={pauta?.preco || ""}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="col-span-full flex flex-col mt-2">
        <label className={labelStyle}>Conteúdo e Briefing</label>
        <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 p-1">
          <Editor value={texto} onChange={setTexto} />
        </div>
      </div>

      {/* Ações */}
      <div className="col-span-full mt-4 flex gap-4">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-grow bg-[#1e293b] hover:bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] p-5 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Processando..." : pauta ? "💾 Salvar Alterações" : "🚀 Publicar Pauta"}
        </button>

        {pauta && (
          <button 
            type="button"
            onClick={handleExcluir}
            disabled={loading}
            className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-100 px-8 rounded-2xl transition-all flex items-center justify-center disabled:opacity-30"
          >
            🗑️
          </button>
        )}
      </div>
    </form>
  );
}