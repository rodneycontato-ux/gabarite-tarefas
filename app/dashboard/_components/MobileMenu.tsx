"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Barra do Topo (Só Mobile) - Sem o 'fixed' para não cobrir o texto */}
      <div className="lg:hidden flex items-center px-4 h-16 bg-white border-b border-slate-200 shrink-0">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-900 text-white rounded-lg"
        >
          <Menu size={20} />
        </button>
        <span className="ml-3 font-bold text-slate-800 text-sm tracking-tight uppercase">
          Menu
        </span>
      </div>

      {/* Overlay (Só Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-64 bg-[#1e293b] transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:flex-shrink-0
      `}>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
        {children}
      </aside>
    </>
  );
}