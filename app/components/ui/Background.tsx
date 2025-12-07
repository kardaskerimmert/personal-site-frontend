export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0c]">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen animate-pulse-slow bg-[var(--color-primary)]/20 transition-colors duration-700" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen bg-[var(--color-accent)]/10 transition-colors duration-700" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>
  );
}