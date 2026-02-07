import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormPauta from "../../_components/FormPauta";

export default async function EditarPautaPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Você precisa dar await no params primeiro!
  const { id } = await params;

  // 2. Agora sim você usa o id no findUnique
  const [pauta, sites, categorias] = await Promise.all([
    prisma.pauta.findUnique({
      where: { id_pauta: Number(id) } // Use o id que extraímos acima
    }),
    prisma.site.findMany(),
    prisma.categoria.findMany()
  ]);

  if (!pauta) {
    notFound();
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black uppercase italic text-slate-900">
            Edição de Registro
          </h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2">
            Alterando a pauta: #{pauta.id_pauta}
          </p>
        </div>

        <FormPauta 
          pauta={pauta} 
          sites={sites} 
          categorias={categorias} 
        />
      </div>
    </div>
  );
}