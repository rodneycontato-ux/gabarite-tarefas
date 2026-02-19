"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Escuta o evento para abrir o menu a partir de qualquer lugar
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-sidebar", handleOpen);
    return () => window.removeEventListener("open-sidebar", handleOpen);
  }, []);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-[#1e293b] transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:flex-shrink-0
      `}>
        <button onClick={() => setIsOpen(false)} className="lg:hidden absolute top-4 right-4 text-slate-400">
          <X size={24} />
        </button>
        {children}
      </aside>
    </>
  );
}