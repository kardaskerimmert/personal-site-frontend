import { type ReactNode } from "react";

interface EditableProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export default function Editable({ children, onClick, className = "" }: EditableProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative group cursor-pointer transition-all hover:ring-2 hover:ring-[var(--color-primary)]/50 rounded-lg ${className}`}
    >
      {/* Hover Indicator */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-[var(--color-primary)] text-[#0a0a0c] p-1.5 rounded-full shadow-lg">
          <i className="fas fa-edit text-xs"></i>
        </div>
      </div>
      
      {children}
    </div>
  );
}