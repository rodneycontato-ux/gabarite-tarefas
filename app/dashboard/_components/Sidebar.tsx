import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma"; 
import NotificationBadge from "../notificacoes/_components/NotificationBadge"; 
import Link from 'next/link';
import NavLink from "./NavLink";
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Users, 
  CircleDollarSign, 
  Bell, 
  Settings, 
  PlusCircle, 
  Search 
} from "lucide-react";

interface CustomSession {
  user?: {
    id_usuario: number;
    nivel: number;
    nome: string;
  };
}

export default async function Sidebar() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  const nivel = session?.user?.nivel;
  const idUsuario = session?.user?.id_usuario;

  let totalNaoLidas = 0;
  if (idUsuario && nivel !== 1) {
    try {
      const userId = Number(idUsuario);
      totalNaoLidas = await prisma.notificacao.count({
        where: {
          AND: [
            { OR: [{ id_usuario: userId }, { id_usuario: null }] },
            { notificacao_visualizada: { none: { id_usuario: userId } } }
          ]
        }
      });
    } catch (error) {
      console.error("Erro Sidebar:", error);
    }
  }

  const activeStyle = "flex items-center gap-3 p-3 bg-slate-800 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-black/20";
  const normalStyle = "flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl font-medium transition-all duration-200 group";

  return (
    <div className="flex flex-col h-full text-slate-300">
      {/* Logo */}
      <div className="p-8">
        <h1 className="text-white text-2xl font-black tracking-tighter uppercase italic leading-none">
          GABARITE<br />
          <span className="text-blue-500 text-sm not-italic tracking-widest">TAREFAS</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {nivel === 1 ? (
          /* --- MENU GERENTE --- */
          <>
            <NavLink href="/dashboard/gerente" active={activeStyle} normal={normalStyle}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink href="/dashboard/tarefas" active={activeStyle} normal={normalStyle}>
              <CheckCircle2 size={20} /> Tarefas
            </NavLink>
            <NavLink href="/dashboard/usuarios" active={activeStyle} normal={normalStyle}>
              <Users size={20} /> Colaboradores
            </NavLink>
            <NavLink href="/dashboard/pagamentos" active={activeStyle} normal={normalStyle}>
              <CircleDollarSign size={20} /> Pagamentos
            </NavLink>
            <NavLink href="/dashboard/notificacoes" active={activeStyle} normal={normalStyle}>
              <Bell size={20} /> Notificações
            </NavLink>
            <NavLink href="/dashboard/configuracoes" active={activeStyle} normal={normalStyle}>
              <Settings size={20} /> Configurações
            </NavLink>
            
            <div className="pt-4">
              <Link href="/dashboard/tarefas/cadastrar" className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition group text-center shadow-lg shadow-emerald-900/20">
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" /> Nova Tarefa
              </Link>
            </div>
          </>
        ) : (
          /* --- MENU COLABORADOR --- */
          <>
            <NavLink href="/dashboard/colaborador" active={activeStyle} normal={normalStyle}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink href="/dashboard/tarefas" active={activeStyle} normal={normalStyle}>
              <CheckCircle2 size={20} /> Minhas Tarefas
            </NavLink>
            <NavLink href="/dashboard/pagamentos" active={activeStyle} normal={normalStyle}>
              <CircleDollarSign size={20} /> Meus Pagamentos
            </NavLink>
            
            <NavLink 
              href="/dashboard/notificacoes" 
              active={`${activeStyle} justify-between`} 
              normal={`${normalStyle} justify-between`}
            >
              <div className="flex items-center gap-3">
                <Bell size={20} /> Notificações
              </div>
              <NotificationBadge inicial={totalNaoLidas} />
            </NavLink>

            <div className="pt-4">
              <Link href="/dashboard/tarefas" className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition group text-center shadow-lg shadow-blue-900/20">
                <Search size={20} className="group-hover:scale-110 transition-transform" /> Buscar Tarefas
              </Link>
            </div>
          </>
        )}
      </nav>

      <div className="p-6 border-t border-slate-800/50">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
          Painel Administrativo v2.0
        </p>
      </div>
    </div>
  );
}