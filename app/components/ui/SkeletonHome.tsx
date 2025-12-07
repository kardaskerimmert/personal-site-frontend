export default function SkeletonHome() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-5 space-y-8 animate-pulse">
      <div className="w-48 h-48 rounded-full bg-white/5 border-4 border-white/10"></div>
      
      <div className="h-12 w-64 bg-white/5 rounded-lg"></div>
      
      <div className="h-8 w-40 bg-white/5 rounded-full"></div>
      
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        <div className="h-16 bg-white/5 rounded-xl"></div>
        <div className="h-16 bg-white/5 rounded-xl"></div>
        <div className="h-16 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
}