import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormPauta from "../../_components/FormPauta";

export default async function EditarPautaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pautaId = Number(id);

  if (isNaN(pautaId)) notFound();

  const [pauta, sites, categorias] = await Promise.all([
    prisma.pauta.findUnique({
      where: { id_pauta: pautaId },
      include: {
        site_relacionado: true,      // Nome da relação no seu model pauta
        categoria_relacionada: true  // Nome da relação no seu model pauta
      }
    }),
    prisma.site.findMany({ orderBy: { nome_site: 'asc' } }),
    prisma.categoria.findMany({ orderBy: { nome_categoria: 'asc' } })
  ]);

  if (!pauta) notFound();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <FormPauta 
          pauta={pauta} 
          sites={sites} 
          categorias={categorias} 
        />
      </div>
    </div>
  );
}