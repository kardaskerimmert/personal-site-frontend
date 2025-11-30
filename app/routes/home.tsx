import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router"; // Yönlendirme için
import type { Route } from "./+types/home";

// --- TİP TANIMLAMALARI ---
type SiteData = {
  title: string;
  subtitle: string;
  email: string;
  profileImage: string;
  topLinks: Array<{ label: string; url: string }>;
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
  technologies: Array<{ name: string; icon: string; primary?: boolean }>;
  games: Array<{ name: string; url: string; icon: string }>;
  projects: Array<{ title: string; description: string; url: string }>;
  copyright: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fearlinn | Dijital Profil" },
    { name: "description", content: "Fearlinn - Code / Gaming / Community" },
  ];
}

// --- SPOTLIGHT KART ---
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-white/10 bg-white/5 overflow-hidden rounded-xl ${className}`}
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
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// --- ANA KOMPONENT ---
export default function Home() {
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        // 1. Admin hesabı var mı kontrol et
        const existsRes = await fetch("http://localhost:4000/api/admin/exists");
        const existsData = await existsRes.json();

        // Eğer admin yoksa, kurulum sayfasına yönlendir
        if (!existsData.exists) {
          navigate("/admin");
          return;
        }

        // 2. Admin varsa site verisini çek
        const dataRes = await fetch("http://localhost:4000/api/site-data");
        if (!dataRes.ok) throw new Error("Veri çekilemedi");
        
        const body = await dataRes.json();
        setSiteData(body.siteData || null);
        setLoading(false);

      } catch (err) {
        console.error("Home initialization failed", err);
        // Hata durumunda ne yapılacağı (Örn: Retry butonu veya boş state)
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">Yükleniyor...</div>;
  if (!siteData) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">Veri yok.</div>;

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-[#F0F0F0] font-['Inter'] overflow-x-hidden select-none flex flex-col relative">
      
      {/* ARKA PLAN */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl mx-auto p-5 flex flex-col min-h-screen"
      >
        
        {/* ÜST BAR */}
        <motion.header variants={itemVars} className="flex flex-col lg:flex-row justify-between items-center py-6 h-[80px]">
          <div className="flex gap-6 text-sm font-medium tracking-wide">
            {siteData.topLinks.map((link) => (
              <a key={link.url} href={link.url} target="_blank" className="text-gray-400 hover:text-[#3DDC84] transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#3DDC84] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <div className="flex gap-4 text-xl mt-4 lg:mt-0">
            {siteData.socialLinks.map((social) => (
              <a key={social.platform} href={social.url} target="_blank" className="text-gray-400 hover:text-[#7129ee] hover:scale-110 transition-all">
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </motion.header>

        {/* HERO SECTION */}
        <main className="flex-grow flex flex-col items-center text-center relative w-full">
          
          <div className="my-auto flex flex-col items-center justify-center">
            <motion.div 
              variants={itemVars} 
              className="relative group cursor-pointer z-0" 
              style={{ y: y1, opacity, scale }}
            >
               <div className="absolute -inset-1 bg-gradient-to-r from-[#3DDC84] to-[#7129ee] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
               <img src={siteData.profileImage} alt="Profile" className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-[#141420] shadow-2xl" />
            </motion.div>

            <motion.div style={{ opacity, y: y1 }}>
              <motion.h1 variants={itemVars} className="mt-8 text-5xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                  {siteData.title.toUpperCase()}
              </motion.h1>

              <motion.div variants={itemVars} className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md mx-auto">
                  <span className="w-2 h-2 rounded-full bg-[#3DDC84] animate-pulse"></span>
                  <p className="text-[#3DDC84] font-mono text-sm lg:text-base">{siteData.subtitle}</p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVars} 
            className="mt-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10 pb-12"
          >
            
            {/* Sol: Tech */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {siteData.technologies.map((tech) => (
                <span key={tech.name} className={`px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-2 ${tech.primary ? 'bg-[#3DDC84]/20 border-[#3DDC84] text-[#3DDC84]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  <i className={tech.icon}></i> {tech.name}
                </span>
              ))}
            </div>

            {/* Orta: Mail */}
            <div className="flex justify-center">
               <div className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition flex items-center gap-3 group backdrop-blur-sm">
                 <i className="far fa-envelope text-[#7129ee]"></i>
                 <span className="text-gray-300 group-hover:text-white transition">{siteData.email}</span>
               </div>
            </div>

            {/* Sağ: Games */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
               {siteData.games.map((game) => (
                 <a key={game.name} href={game.url} target="_blank" className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#7129ee]/10 border border-[#7129ee]/30 text-[#a78bfa] hover:bg-[#7129ee] hover:text-white transition flex items-center gap-2">
                   <i className={game.icon}></i> {game.name}
                 </a>
               ))}
            </div>

          </motion.div>
        </main>

      </motion.div>

      {/* PROJELER */}
      <section id="projects" className="relative z-10 w-full bg-[#050507] border-t border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-5">
           <motion.h2 
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="text-3xl font-bold mb-12 flex items-center gap-4"
           >
             <span className="text-[#7129ee]">#</span> PROJELER
             <div className="h-px bg-white/10 flex-grow ml-4"></div>
           </motion.h2>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {siteData.projects.map((project, i) => (
               <motion.div
                 key={project.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 viewport={{ once: true }}
               >
                 <SpotlightCard className="h-full p-6 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                   <div className="mb-4 w-12 h-12 rounded-lg bg-gradient-to-br from-[#7129ee] to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-purple-900/30">
                     <i className="fas fa-code"></i>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{project.description}</p>
                   <a href={project.url} target="_blank" className="inline-flex items-center text-sm font-semibold text-[#3DDC84] hover:text-white transition group/link">
                     Projeyi İncele <i className="fas fa-arrow-right ml-2 transform group-hover/link:translate-x-1 transition"></i>
                   </a>
                 </SpotlightCard>
               </motion.div>
             ))}
           </div>

           <div className="mt-20 text-center border-t border-white/5 pt-10">
             <p className="text-sm text-gray-500 font-mono">{siteData.copyright}</p>
           </div>
        </div>
      </section>

    </div>
  );
}