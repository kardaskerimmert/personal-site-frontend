import { useState, type ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function SectionCard({ title, children, defaultOpen = false }: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#141420] border border-white/10 rounded-xl shadow-lg overflow-hidden mb-6 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 bg-white/5 flex justify-between items-center text-left hover:bg-white/10 transition border-b border-white/5"
      >
        <span className="font-semibold text-gray-200">{title}</span>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && <div className="p-6 animate-fade-in-up text-gray-300">{children}</div>}
    </div>
  );
}