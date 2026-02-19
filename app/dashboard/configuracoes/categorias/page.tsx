import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ListaCategoriasClient from "../_components/ListaCategorias";

export default async function ListaCategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: {
      nome_categoria: 'asc'
    }
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* O componente Client assume a renderização da lista e dos modais */}
      <ListaCategoriasClient categorias={categorias} />

      {/* Voltar */}
      <div className="mt-8 flex justify-between items-center">
        <Link href="/dashboard/configuracoes" className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 flex items-center gap-2 cursor-pointer transition-colors">
          👈 Voltar para Configurações
        </Link>
        <span className="text-[10px] font-bold text-slate-300 uppercase italic">
          Total: {categorias.length} itens
        </span>
      </div>
    </div>
  );
}