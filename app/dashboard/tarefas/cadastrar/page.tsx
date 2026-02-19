import { prisma } from "@/lib/prisma";
import FormPauta from "../_components/FormPauta";

export default async function CadastroPautaPage() {
  // 1. Buscamos as 3 tabelas ao mesmo tempo para ganhar performance
  const [sites, categorias, usuarios] = await Promise.all([
    prisma.site.findMany({ 
      orderBy: { nome_site: 'asc' } 
    }),
    prisma.categoria.findMany({ 
      orderBy: { nome_categoria: 'asc' } 
    }),
    // 2. Buscamos os usuários aqui (id_usuario e nome conforme seu model)
    prisma.usuario.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id_usuario: true,
        nome: true,
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className=" mx-auto">
        {/* 3. Agora passamos a nova lista de usuários para o componente */}
        <FormPauta 
          sites={sites} 
          categorias={categorias} 
          usuarios={usuarios} 
        />
      </div>
    </div>
  );
}