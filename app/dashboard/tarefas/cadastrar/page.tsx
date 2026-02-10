import { prisma } from "@/lib/prisma";
import FormPauta from "../_components/FormPauta";

export default async function CadastroPautaPage() {
  // Busca as tabelas relacionadas para popular os selects
  // Usamos orderBy para que os projetos apareçam em ordem alfabética
  const [sites, categorias] = await Promise.all([
    prisma.site.findMany({ 
      orderBy: { nome_site: 'asc' } 
    }),
    prisma.categoria.findMany({ 
      orderBy: { nome_categoria: 'asc' } 
    })
  ]);

  return (
    <div className="min-h-screen p-4 md:p-12 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Passamos sites e categorias. Como é cadastro, não passamos o objeto 'pauta' */}
        <FormPauta sites={sites} categorias={categorias} />
      </div>
    </div>
  );
}