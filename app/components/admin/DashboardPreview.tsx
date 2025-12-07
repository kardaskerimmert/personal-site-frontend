import Editable from "~/components/admin/Editable";
import SpotlightCard from "~/components/ui/SpotlightCard";
import { getThemeStyles } from "~/lib/theme";
import type { SiteData } from "~/types";

interface DashboardPreviewProps {
  siteData: SiteData;
  onEditClick: (path: string[], schemaType: string, title: string) => void;
}

export default function DashboardPreview({ siteData, onEditClick }: DashboardPreviewProps) {
  return (
    <div className="border-4 border-white/10 rounded-xl overflow-hidden shadow-2xl relative bg-[#0a0a0c]">
       <div className="absolute top-4 left-4 z-50 bg-[var(--color-primary)] text-[#0a0a0c] px-3 py-1 rounded-full text-xs shadow-lg pointer-events-none font-bold opacity-80"><i className="fas fa-magic mr-1"></i> Düzenlemek için öğelere tıkla</div>
       
       <div className="w-full min-h-screen bg-[#0a0a0c] text-[#F0F0F0] font-['Inter'] overflow-x-hidden p-5 flex flex-col relative" style={getThemeStyles(siteData)}>
          <div className="flex flex-col lg:flex-row justify-between items-center py-6 h-[80px]">
             <div className="flex gap-6 text-sm font-medium">
                {siteData.topLinks.map((link, i) => (
                  <Editable key={i} onClick={() => onEditClick(['topLinks', String(i)], 'topLink', 'Link Düzenle')}>
                     <span className="text-gray-400 hover:text-[var(--color-primary)] relative group block hover:text-[var(--color-primary)]">{link.label}</span>
                  </Editable>
                ))}
             </div>
             <div className="flex gap-4 text-xl">
                {siteData.socialLinks.map((social, i) => (
                  <Editable key={i} onClick={() => onEditClick(['socialLinks', String(i)], 'social', 'Sosyal Medya')}>
                     <i className={`${social.icon} text-gray-400 hover:text-[var(--color-accent)]`}></i>
                  </Editable>
                ))}
             </div>
          </div>

          <div className="flex-grow flex flex-col items-center text-center relative w-full justify-center my-10">
             <Editable onClick={() => onEditClick(['profileImage'], 'simple', 'Profil Resmi')}>
                <div className="relative group w-48 h-48 lg:w-64 lg:h-64 rounded-full mb-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full blur opacity-50"></div>
                   <img src={siteData.profileImage} className="relative w-full h-full rounded-full object-cover border-4 border-[#141420]" alt="Profil" />
                </div>
             </Editable>

             <Editable onClick={() => onEditClick(['title'], 'simple', 'Başlık')}><h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-4">{siteData.title.toUpperCase()}</h1></Editable>
             <Editable onClick={() => onEditClick(['subtitle'], 'simple', 'Alt Başlık')}>
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                 <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                 <p className="text-[var(--color-primary)] font-mono">{siteData.subtitle}</p>
               </div>
             </Editable>

             <div className="mt-[400px] w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pb-12">
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                   {siteData.technologies.map((tech, i) => (
                      <Editable key={i} onClick={() => onEditClick(['technologies', String(i)], 'tech', 'Teknoloji')}>
                         <span className={`px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-2 ${tech.primary ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)] text-[var(--color-primary)]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                           <i className={tech.icon}></i> {tech.name}
                         </span>
                      </Editable>
                   ))}
                </div>
                <div className="flex justify-center">
                   <Editable onClick={() => onEditClick(['email'], 'simple', 'Email')}>
                      <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-gray-300">
                        <i className="far fa-envelope text-[var(--color-accent)]"></i> {siteData.email}
                      </div>
                   </Editable>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                   {siteData.games.map((game, i) => (
                      <Editable key={i} onClick={() => onEditClick(['games', String(i)], 'game', 'Oyun')}>
                         <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[#a78bfa] flex items-center gap-2">
                           <i className={game.icon}></i> {game.name}
                         </span>
                      </Editable>
                   ))}
                </div>
             </div>
          </div>

          <div className="border-t border-white/10 py-10">
             <h2 className="text-3xl font-bold mb-10 text-center"><span className="text-[var(--color-accent)]">#</span> PROJELER</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteData.projects.map((project, i) => (
                   <Editable key={i} onClick={() => onEditClick(['projects', String(i)], 'project', 'Proje')} className="h-full">
                      <SpotlightCard title={project.title} url={project.url} description={project.description}/>
                   </Editable>
                ))}
             </div>
             <Editable onClick={() => onEditClick(['copyright'], 'simple', 'Copyright')} className="mt-10 text-center block">
                <p className="text-sm text-gray-500 font-mono">{siteData.copyright}</p>
             </Editable>
          </div>
       </div>
    </div>
  );
}