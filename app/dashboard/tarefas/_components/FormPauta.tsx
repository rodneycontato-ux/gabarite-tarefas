"use client";

import { useState } from "react";
import { criarPauta } from "../_actions/cadastrar"; 
import { editarPauta } from "../_actions/editar"; 
import { excluirPauta } from "../_actions/excluir"; 
import Editor from "../../_components/Editor";

export default function FormPauta({ sites, categorias, pauta }: { sites: any[], categorias: any[], pauta?: any }) {
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
      window.location.href = "../../tarefas"; 
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
        window.location.href = "../../tarefas";
      }
    }
  }

  const labelStyle = "text-[9px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1";
  const inputStyle = "bg-slate-50 border border-slate-100 text-slate-900 p-4 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 text-sm font-bold uppercase italic";

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

      {/* CAMPO NOVO: TÍTULO DA TAREFA */}
      <div className="col-span-full flex flex-col">
        <label className={labelStyle}>Título da Tarefa (O que deve ser feito?)</label>
        <input 
          name="titulo" 
          type="text" 
          required 
          className={inputStyle} 
          placeholder="EX: CRIAR POST PARA INSTAGRAM SOBRE BANCO DE DADOS" 
          defaultValue={pauta?.titulo || ""}
        />
      </div>

      {/* Projeto */}
      <div className="flex flex-col">
        <label className={labelStyle}>Projeto Destino</label>
        <select name="site" required className={inputStyle} defaultValue={pauta?.site || ""}>
          <option value="">Selecionar projeto...</option>
          {sites.map(s => <option key={s.id_site} value={s.nome_site || ""}>{s.nome_site}</option>)}
        </select>
      </div>

      {/* Categoria */}
      <div className="flex flex-col">
        <label className={labelStyle}>Categoria</label>
        <select name="categoria" required className={inputStyle} defaultValue={pauta?.categoria || ""}>
          <option value="">Selecionar categoria...</option>
          {categorias.map(c => <option key={c.id} value={c.nome_categoria || ""}>{c.nome_categoria}</option>)}
        </select>
      </div>

      {/* Valor */}
      <div className="flex flex-col">
        <label className={labelStyle}>Valor da Pauta</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">R$</span>
          <input 
            name="preco" 
            type="number" 
            step="0.01" 
            className={`${inputStyle} w-full pl-12`} 
            placeholder="0,00" 
            defaultValue={pauta?.preco || ""}
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col">
        <label className={labelStyle}>Status do Fluxo</label>
        <select 
          name="status" 
          className={inputStyle} 
          defaultValue={pauta?.status || "3"}
        >
          <option value="3">🟡 Aberto</option>
          <option value="2">🟠 Pendente</option>
          <option value="1">🟢 Concluído</option>
        </select>
      </div>

      {/* Editor de Texto */}
      <div className="col-span-full flex flex-col mt-2">
        <label className={labelStyle}>Conteúdo e Briefing Detalhado</label>
        <div className="rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 p-1">
          <Editor value={texto} onChange={setTexto} />
        </div>
      </div>

      {/* Ações */}
      <div className="col-span-full mt-4 flex gap-4">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-grow bg-[#1e293b] hover:bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] p-5 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? "Processando..." : pauta ? "💾 Salvar Alterações" : "🚀 Publicar Pauta no Mural"}
        </button>

        {pauta && (
          <button 
            type="button"
            onClick={handleExcluir}
            disabled={loading}
            className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-100 px-8 rounded-2xl transition-all flex items-center justify-center disabled:opacity-30 cursor-pointer"
            title="Excluir Pauta"
          >
            <span className="text-lg">🗑️</span>
          </button>
        )}
      </div>
    </form>
  );
}