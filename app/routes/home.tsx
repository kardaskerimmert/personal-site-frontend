import { motion, useScroll, useTransform } from "framer-motion";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { API_URL } from "~/lib/api";
import type { SiteData } from "~/types";
import { getThemeStyles } from "~/lib/theme";
import SpotlightCard from "~/components/ui/SpotlightCard";
import SkeletonHome from "~/components/ui/SkeletonHome";
import Background from "~/components/ui/Background";
import { useHome } from "~/hooks/useHome";

// --- LOADER ---
export async function loader() {
  try {
    const res = await fetch(`${API_URL}/api/site-data`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!res.ok) throw new Error("Veri çekilemedi");
    
    const data = await res.json();
    return data.siteData as SiteData;
  } catch (error) {
    console.error("Loader error:", error);
    return null;
  }
}

// --- META ---
export function meta({ data }: Route.MetaArgs) {
  const title = data?.title || "Portfolio";
  const description = data?.subtitle || "Kişisel Portfolyo";
  
  return [
    { title: `${title} | Dijital Profil` },
    { name: "icon", href: data?.profileImage },
    { name: "description", content: description },
    { name: "keywords", content: "portfolio, developer, web development" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: data?.profileImage || "/og-image.png" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

// --- COMPONENT ---
export default function Home() {
  const initialData = useLoaderData() as SiteData | null;
  const { siteData, isLoggedIn, loading, error } = useHome(initialData);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  if (loading) return <SkeletonHome />;
  
  if (error || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">
        <div className="text-center space-y-4">
          <i className="fas fa-exclamation-triangle text-4xl text-red-400"></i>
          <p className="text-gray-400">Veri yüklenemedi.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full bg-[#0a0a0c] text-[#F0F0F0] font-['Inter'] overflow-x-hidden select-none flex flex-col relative"
      style={getThemeStyles(siteData)}
    >
      <Background />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative z-10 w-full max-w-7xl mx-auto p-5 flex flex-col min-h-screen"
      >
        <header className="flex flex-col lg:flex-row justify-between items-center py-6 h-[80px]">
          <nav className="flex gap-6 text-sm font-medium tracking-wide" aria-label="Main navigation">
            {siteData.topLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full"></span>
              </a>
            ))}
            {isLoggedIn && (
              <a 
                href="/admin/dashboard" 
                className="text-gray-400 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                Admin Paneli
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-primary)] transition-all group-hover:w-full"></span>
              </a>
            )}
          </nav>
          
          <div className="flex gap-4 text-xl mt-4 lg:mt-0 items-center" role="list" aria-label="Social media links">
            {siteData.socialLinks.map((social, i) => (
              <a 
                key={i} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[var(--color-accent)] hover:scale-110 transition-all"
                aria-label={social.platform}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </header>

        <main className="mt-25 flex-grow flex flex-col items-center text-center relative w-full justify-center">
          <motion.div 
            style={{ y: y1, opacity, scale }} 
            className="relative group cursor-pointer z-0 mb-8"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={siteData.profileImage} 
              alt={`${siteData.title} profil resmi`}
              className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-[#141420] shadow-2xl"
              loading="eager"
            />
          </motion.div>

          <motion.div style={{ opacity, y: y1 }}>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
              {siteData.title.toUpperCase()}
            </h1>
            <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md mx-auto">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
              <p className="text-[var(--color-primary)] font-mono text-sm lg:text-base">{siteData.subtitle}</p>
            </div>
          </motion.div>

          <div className="mt-70 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10 pb-12">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {siteData.technologies.map((tech, i) => (
                <span 
                  key={i} 
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-2 ${
                    tech.primary 
                      ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]' 
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <i className={tech.icon}></i> {tech.name}
                </span>
              ))}
            </div>

            <div className="flex justify-center">
              <a 
                href={`mailto:${siteData.email}`}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition flex items-center gap-3 group backdrop-blur-sm"
              >
                <i className="far fa-envelope text-[var(--color-accent)]"></i>
                <span className="text-gray-300 group-hover:text-white transition">{siteData.email}</span>
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-2">
              {siteData.games.map((game, i) => (
                <a 
                  key={i} 
                  href={game.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1.5 rounded-md text-xs font-bold bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[#a78bfa] hover:bg-[var(--color-accent)] hover:text-white transition flex items-center gap-2"
                >
                  <i className={game.icon}></i> {game.name}
                </a>
              ))}
            </div>
          </div>
        </main>
      </motion.div>

      <section id="projects" className="relative z-10 w-full bg-[#050507] border-t border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
            <span className="text-[var(--color-accent)]">#</span> PROJELER
            <div className="h-px bg-white/10 flex-grow ml-4"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.projects.map((project, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
              >
                <SpotlightCard 
                  title={project.title} 
                  url={project.url} 
                  description={project.description}
                />
              </motion.div>
            ))}
          </div>

          <footer className="mt-20 text-center border-t border-white/5 pt-10">
            <p className="text-sm text-gray-500 font-mono">{siteData.copyright}</p>
          </footer>
        </div>
      </section>
    </div>
  );
}