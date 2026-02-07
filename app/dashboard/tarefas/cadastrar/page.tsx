import { prisma } from "@/lib/prisma";
import FormPauta from "../_components/FormPauta";

export default async function Page() {
  // Busca as tabelas relacionadas para popular os selects
  const [sites, categorias] = await Promise.all([
    prisma.site.findMany({ orderBy: { nome_site: 'asc' } }),
    prisma.categoria.findMany({ orderBy: { nome_categoria: 'asc' } })
  ]);

  return (
    <div className="min-h-screen p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <FormPauta sites={sites} categorias={categorias} />
      </div>
    </div>
  );
}