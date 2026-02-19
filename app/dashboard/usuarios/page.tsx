// app/dashboard/usuarios/page.tsx
import { prisma } from "@/lib/prisma";
import UsuariosClient from "./_components/ListaUsuarios"; // Vamos criar esse abaixo

export default async function ListaUsuariosPage() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { nome: 'asc' }
  });

  return (
    <div>
      <UsuariosClient usuarios={usuarios} />
    </div>
  );
}