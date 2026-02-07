"use client";

import { useState } from "react";
import Editor from "../../_components/Editor"; 
import { criarNotificacaoAction } from "../_actions/criar"; // Ajuste o caminho da pasta de actions

export default function NovaNotificacaoModal({ usuarios }: { usuarios: { id_usuario: number, nome: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [idUsuario, setIdUsuario] = useState<string>("null");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    // Validação básica para não enviar HTML vazio (padrão do Quill)
    if (!mensagem || mensagem === "<p><br></p>") {
      return alert("Por favor, escreva uma mensagem.");
    }
    
    setLoading(true);
    
    try {
      const result = await criarNotificacaoAction({
        id_usuario: idUsuario === "null" ? null : Number(idUsuario),
        mensagem: mensagem 
      });

      if (result.success) {
        // Sucesso: Reseta o estado e fecha o modal
        setIsOpen(false);
        setMensagem("");
        setIdUsuario("null");
      } else {
        // Caso a action retorne erro (ex: falta de permissão)
        alert(result.error || "Erro ao salvar notificação.");
      }
    } catch (error) {
      console.error("Erro no Modal:", error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 flex items-center gap-3 active:scale-95 w-fit"
      >
        <span className="text-lg">+</span>
        Nova Notificação
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black italic uppercase text-slate-900 leading-none">Criar Aviso</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Envio de mensagem interna</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-tighter transition-colors"
          >
            [ Fechar ]
          </button>
        </div>

        {/* CORPO */}
        <div className="p-10 overflow-y-auto space-y-8">
          
          {/* SELEÇÃO DE DESTINATÁRIO */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-3 ml-1 tracking-widest">
              Destinatário
            </label>
            <select 
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20 transition-all appearance-none"
            >
              <option value="null">TODOS OS COLABORADORES (GLOBAL)</option>
              {usuarios?.map(u => (
                <option key={u.id_usuario} value={String(u.id_usuario)}>
                  {u.nome.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* ÁREA DO EDITOR */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-3 ml-1 tracking-widest">
              Conteúdo da Mensagem
            </label>
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden">
              <Editor value={mensagem} onChange={setMensagem} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={handleSalvar}
            disabled={loading}
            className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 active:scale-95 shadow-lg"
          >
            {loading ? "Gravando..." : "Disparar Notificação"}
          </button>
        </div>

      </div>
    </div>
  );
}