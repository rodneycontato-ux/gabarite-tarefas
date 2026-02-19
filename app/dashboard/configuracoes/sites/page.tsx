import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ListaProjetosClient from "../_components/ListaSites";

export default async function ListaProjetosPage() {
  const projetos = await prisma.site.findMany({
    orderBy: { ordem: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* O componente cliente cuida do Header e da Tabela */}
      <ListaProjetosClient projetos={projetos} />

      {/* Voltar (Pode ficar aqui ou no cliente) */}
      <div className="mt-8">
        <Link href="/dashboard/configuracoes" className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2 cursor-pointer transition-colors">
          👈 Voltar para Configurações
        </Link>
      </div>
    </div>
  );
}