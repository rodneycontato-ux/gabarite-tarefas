import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormPauta from "../../_components/FormPauta";

export default async function EditarPautaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pautaId = Number(id);

  if (isNaN(pautaId)) notFound();

  // 1. Adicionamos 'usuarios' na desestruturação e a consulta no Promise.all
  const [pauta, sites, categorias, usuarios] = await Promise.all([
    prisma.pauta.findUnique({
      where: { id_pauta: pautaId },
      include: {
        site_relacionado: true,
        categoria_relacionada: true,
        usuario: true // Opcional: inclui a relação do usuário atual se precisar
      }
    }),
    prisma.site.findMany({ orderBy: { nome_site: 'asc' } }),
    prisma.categoria.findMany({ orderBy: { nome_categoria: 'asc' } }),
    // 2. BUSCA OS USUÁRIOS PARA O SELECT
    prisma.usuario.findMany({ 
        orderBy: { nome: 'asc' },
        select: { id_usuario: true, nome: true } 
    })
  ]);

  if (!pauta) notFound();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <FormPauta 
          pauta={pauta} 
          sites={sites} 
          categorias={categorias} 
          usuarios={usuarios} // 3. PASSAMOS A LISTA PARA O FORM
        />
      </div>
    </div>
  );
}