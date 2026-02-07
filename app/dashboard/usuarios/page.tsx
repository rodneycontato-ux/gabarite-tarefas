// app/dashboard/usuarios/page.tsx
import { prisma } from "@/lib/prisma"; // Importa a instância configurada na sua lib
import { getNivelUsuario } from "@/lib/status";

async function getUsuarios() {
  try {
    // Busca simples e direta, já que o banco agora tem datas válidas
    const usuarios = await prisma.usuario.findMany({
      orderBy: { 
        nome: 'asc' 
      }
    });
    
    return usuarios;
  } catch (error) {
    console.error("Erro ao buscar usuários no banco:", error);
    return [];
  }
}

export default async function ListaUsuariosPage() {
  const usuarios = await getUsuarios();

  return (
    <div className="p-8">
       <h1 className="text-2xl font-black italic uppercase mb-6">Usuários</h1>
       <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-center">Nível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usuarios.map((u) => (
                <tr key={u.id_usuario} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 text-sm font-black italic text-slate-700">{u.nome}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-bold">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    {/* Remova o span de fora e deixe apenas a função */}
                    {getNivelUsuario(u.nivel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  );
}