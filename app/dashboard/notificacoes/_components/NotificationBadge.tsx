"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NotificationBadge({ inicial }: { inicial: number }) {
  // Estado que guarda a contagem "viva" no navegador
  const [count, setCount] = useState(inicial);
  const pathname = usePathname();

  // Toda vez que o valor inicial mudar (vinda do servidor), atualizamos o estado
  useEffect(() => {
    setCount(inicial);
  }, [inicial]);

  // A MÁGICA: Se o usuário entrar na página de notificações, 
  // limpamos o contador localmente para sempre.
  useEffect(() => {
    if (pathname === "/dashboard/notificacoes") {
      setCount(0);
    }
  }, [pathname]);

  // Se for zero ou menor, não renderiza nada (esconde o badge)
  if (count <= 0) return null;

  return (
    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
      {count}
    </span>
  );
}