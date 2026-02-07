import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navegação */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">G</div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Gabarite Tarefas</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <a href="#funcionalidades" className="hover:text-indigo-600 transition">Funcionalidades</a>
          <a href="#sobre" className="hover:text-indigo-600 transition">Sobre</a>
        </div>
        <Link 
          href="/entrar" 
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
        >
          Acessar Console
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Especial para Donos de Sites e Redes Sociais
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
          Gerencie sua equipe <br />
          <span className="text-indigo-600">em um só lugar.</span>
        </h1>
        
        <p className="max-w-3xl text-xl text-slate-500 mb-12 leading-relaxed font-medium">
          Pare de se perder em planilhas e mensagens de WhatsApp. Centralize a produção de conteúdo de todos os seus sites, delegue tarefas para colaboradores e controle seus custos com precisão cirúrgica.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <Link 
            href="/entrar" 
            className="px-12 py-6 bg-slate-900 text-white text-lg font-black rounded-[2rem] hover:bg-slate-800 transition shadow-2xl shadow-slate-200 uppercase tracking-widest"
          >
            Começar Agora
          </Link>
        </div>

        {/* Problema vs Solução */}
        <div id="funcionalidades" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 text-left hover:bg-white hover:shadow-2xl transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">🌐</div>
            <h3 className="font-black text-slate-900 text-lg uppercase mb-4 tracking-tight">Multi-Site Manager</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Tem 5, 10 ou 50 sites? Publique pautas para todos eles em uma única interface. Seus colaboradores só veem o que precisam produzir.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 text-left hover:bg-white hover:shadow-2xl transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">👥</div>
            <h3 className="font-black text-slate-900 text-lg uppercase mb-4 tracking-tight">Gestão de Colaboradores</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Controle quem está escrevendo o quê. Saiba exatamente quais pautas estão em produção, quais estão atrasadas e o que já foi finalizado.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 text-left hover:bg-white hover:shadow-2xl transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">📈</div>
            <h3 className="font-black text-slate-900 text-lg uppercase mb-4 tracking-tight">Relatórios de Custos</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Visualize o quanto você deve pagar para cada colaborador no final do mês. Sem erros, sem cálculos manuais e sem estresse.
            </p>
          </div>
        </div>

        {/* Social Proof Simples */}
        <div className="mt-32 pt-16 border-t border-slate-100 w-full">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8">Ideal para sua operação</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale font-black text-2xl text-slate-600 italic">
            <span>BLOGS</span>
            <span>PORTAIS</span>
            <span>NOTÍCIAS</span>
            <span>INFOPRODUTOS</span>
            <span>SAAS</span>
          </div>
        </div>
      </main>

      <footer className="py-20 bg-slate-900 text-center text-white">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-indigo-400">Gabarite Tarefas • Estrutura Profissional</p>
          <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Organize hoje, escale amanhã.</h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            A plataforma desenvolvida por quem entende de escala de conteúdo. Controle total sobre sua rede de sites e colaboradores.
          </p>
        </div>
      </footer>
    </div>
  );
}