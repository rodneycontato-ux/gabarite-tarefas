import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NovaNotificacaoModal from "./_components/NotificacaoModal"; 
import { marcarComoLidasAction } from "./_actions/lida";

// Interface local para tipagem da sessão
interface CustomSession {
  user?: {
    id_usuario?: number;
    nivel?: number;
  };
}

async function getLogAdmin(nivel?: number, idUsuario?: number) {
  try {
    const whereCondition = nivel === 1 
      ? {} 
      : {
          OR: [
            { id_usuario: idUsuario ? Number(idUsuario) : 0 },
            { id_usuario: null }
          ]
        };

    return await prisma.notificacao.findMany({
      where: whereCondition,
      include: {
        usuario: true,
        notificacao_visualizada: {
          include: {
            usuario: true 
          }
        }
      },
      orderBy: { data_envio: 'desc' },
      take: 20
    });
  } catch (error) {
    console.error("Erro no banco:", error);
    return [];
  }
}

export default async function AdminNotificacoesPage() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const nivel = session?.user?.nivel;
  const idUsuario = session?.user?.id_usuario;

  // CHAMA A ACTION PARA MARCAR COMO LIDA
  if (idUsuario) {
    await marcarComoLidasAction(idUsuario);
  }

  // 1. Busca as notificações
  const notificacoes = await getLogAdmin(nivel, idUsuario);

  // 2. Busca a lista de usuários para o seletor do gerente
  const listaUsuarios = await prisma.usuario.findMany({
    select: { id_usuario: true, nome: true },
    orderBy: { nome: 'asc' }
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 leading-none">
            Notificações
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
            Avisos, comunicados e atualizações do sistema
          </p>
        </div>

        {/* 3. Passa a lista de usuários para o Modal */}
        {nivel === 1 && (
          <NovaNotificacaoModal usuarios={listaUsuarios} />
        )}
      </div>

      <div className="max-w-5xl space-y-6">
        {notificacoes.map((n) => {
          const lida = n.notificacao_visualizada.length > 0;

          return (
            <div 
              key={n.id_notificacao} 
              className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm"
            >
              <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${n.id_usuario ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {n.id_usuario ? 'PV' : 'GL'}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Enviada para:</p>
                    <p className="text-sm font-black text-slate-700 uppercase italic">
                      {n.usuario?.nome || "Todos os Colaboradores (Global)"}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Data do Envio:</p>
                  <p className="text-xs font-bold text-slate-600">
                    {n.data_envio?.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="px-10 py-8">
                <div 
                  className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: n.mensagem }} 
                />
              </div>

              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${lida ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                    {lida ? 'Mensagem Visualizada' : 'Aguardando Visualização'}
                  </span>
                </div>

                <div className="text-[9px] font-bold text-slate-400">
                  {lida ? (
                    <span>
                      Lida em: {n.notificacao_visualizada[0]?.data_visualizacao?.toLocaleString('pt-BR')}
                    </span>
                  ) : (
                    <span className="italic">O destinatário ainda não abriu este conteúdo.</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {notificacoes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
            <p className="text-slate-300 font-black uppercase italic tracking-widest text-xs">
              Nenhuma notificação encontrada no momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}