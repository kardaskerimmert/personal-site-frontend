import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

interface SpotlightCardProps {
  title: string;
  description: string;
  url: string;
}

export default function SpotlightCard({ title, description, url }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-white/5 overflow-hidden rounded-xl h-full p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(113, 41, 238, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">
        <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-[#7129ee] to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-purple-900/30">
          <i className="fas fa-code"></i>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-semibold text-[#3DDC84] hover:text-white transition group/link">
          Projeyi İncele <i className="fas fa-arrow-right ml-2 transform group-hover/link:translate-x-1 transition"></i>
        </a>
      </div>
    </div>
  );
}