"use client";

import { signIn, getSession } from "next-auth/react"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function clientAction(formData: FormData) {
    const email = formData.get("email");
    const senha = formData.get("senha");

    setErro("");
    setCarregando(true);

    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false, 
    });

    if (result?.error) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
    } else {
      // Busca a sessão para verificar o nível que vem do seu banco
      const session = await getSession();
      
      const nivel = session?.user?.nivel;

      if (nivel === 1) {
        router.push("/dashboard/gerente");
      } else if (nivel === 2) {
        router.push("/dashboard/colaborador");
      } else {
        // Caso exista um nível não mapeado ou erro inesperado
        router.push("/entrar");
      }
      
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 tracking-tighter uppercase">
            Gabarite Tarefas
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Console de Administração</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Identificação</h2>

          <form action={clientAction} className="space-y-5">
            {erro && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center border border-red-100">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
              <input
                name="senha"
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className={`w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95 ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {carregando ? "Autenticando..." : "Entrar no Sistema"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              Acesso restrito a colaboradores e administradores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}