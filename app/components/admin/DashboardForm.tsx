import SectionCard from "~/components/admin/SectionCard";
import { PRESET_THEMES } from "~/lib/constants";
import type { SiteData } from "~/types";

interface DashboardFormProps {
  siteData: SiteData;
  updateData: (path: string[], value: any) => void;
  applyTheme: (primary: string, accent: string) => void;
  addItem: (arrayName: keyof SiteData, newItem: any) => void;
  removeItem: (arrayName: keyof SiteData, index: number) => void;
}

export default function DashboardForm({ siteData, updateData, applyTheme, addItem, removeItem }: DashboardFormProps) {
  
  const inputClass = "w-full p-2.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-gray-200 outline-none focus:border-[var(--color-primary)] transition-colors placeholder-gray-600";
  const labelClass = "block text-sm font-medium mb-1.5 text-gray-400";

  return (
    <div className="animate-fade-in-up space-y-6">
      
      <SectionCard title="Genel Bilgiler" defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className={labelClass}>Başlık</label><input className={inputClass} value={siteData.title} onChange={(e) => updateData(['title'], e.target.value)} /></div>
          <div><label className={labelClass}>Alt Başlık</label><input className={inputClass} value={siteData.subtitle} onChange={(e) => updateData(['subtitle'], e.target.value)} /></div>
          <div><label className={labelClass}>E-posta</label><input className={inputClass} value={siteData.email} onChange={(e) => updateData(['email'], e.target.value)} /></div>
          <div><label className={labelClass}>Profil Resmi URL</label><div className="flex gap-2"><input className={inputClass} value={siteData.profileImage} onChange={(e) => updateData(['profileImage'], e.target.value)} /><img src={siteData.profileImage} className="w-11 h-11 rounded-full border border-white/20" alt="Profil" /></div></div>
        </div>
      </SectionCard>

      <SectionCard title="Tema ve Renkler">
        <div className="mb-8">
          <label className={labelClass + " mb-3"}>Hazır Temalar</label>
          <div className="flex flex-wrap gap-4">
            {PRESET_THEMES.map((theme) => (
              <button key={theme.name} onClick={() => applyTheme(theme.primary, theme.accent)} className="group flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full shadow-lg border border-white/10 overflow-hidden flex transform group-hover:scale-110 transition-transform duration-200 cursor-pointer">
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.primary }}></div>
                  <div className="w-1/2 h-full" style={{ backgroundColor: theme.accent }}></div>
                </div>
                <span className="text-xs text-gray-400 font-medium group-hover:text-white">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 my-6"></div>
        <h4 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2"><i className="fas fa-sliders-h text-[var(--color-primary)]"></i> Özel Renk Seçimi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0a0a0c] p-4 rounded-xl border border-white/10">
          <div>
            <label className={labelClass}>Ana Renk (Primary)</label>
            <div className="flex items-center gap-3">
              <input type="color" className="h-10 w-10 p-0 border-0 rounded cursor-pointer shadow-sm bg-transparent" value={siteData.themeSettings?.primary || '#3DDC84'} onChange={(e) => updateData(['themeSettings', 'primary'], e.target.value)} />
              <input type="text" className={inputClass} value={siteData.themeSettings?.primary || '#3DDC84'} onChange={(e) => updateData(['themeSettings', 'primary'], e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Vurgu Rengi (Accent)</label>
            <div className="flex items-center gap-3">
              <input type="color" className="h-10 w-10 p-0 border-0 rounded cursor-pointer shadow-sm bg-transparent" value={siteData.themeSettings?.accent || '#7129ee'} onChange={(e) => updateData(['themeSettings', 'accent'], e.target.value)} />
              <input type="text" className={inputClass} value={siteData.themeSettings?.accent || '#7129ee'} onChange={(e) => updateData(['themeSettings', 'accent'], e.target.value)} />
            </div>
          </div>
        </div>
      </SectionCard>
      
      <SectionCard title="Projeler">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteData.projects.map((p, i) => (
            <div key={i} className="bg-[#0a0a0c] p-4 rounded-lg border border-white/10 relative group hover:border-[var(--color-primary)] transition-colors">
              <button onClick={() => removeItem('projects', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
              <div className="space-y-3">
                <input className={`${inputClass} font-bold`} value={p.title} onChange={(e) => updateData(['projects', String(i), 'title'], e.target.value)} placeholder="Proje Adı" />
                <textarea className={`${inputClass} text-sm`} rows={2} value={p.description} onChange={(e) => updateData(['projects', String(i), 'description'], e.target.value)} placeholder="Açıklama" />
                <input className={`${inputClass} text-sm text-[var(--color-accent)]`} value={p.url} onChange={(e) => updateData(['projects', String(i), 'url'], e.target.value)} placeholder="URL" />
              </div>
            </div>
          ))}
          <button onClick={() => addItem('projects', { title: "Yeni", description: "", url: "#" })} className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-white/20 rounded-lg text-gray-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all bg-[#0a0a0c]/50"><i className="fas fa-plus text-2xl mb-1"></i>Ekle</button>
        </div>
      </SectionCard>

        <SectionCard title="Sosyal Medya">
            {siteData.socialLinks.map((s, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <div className="w-10 h-10 flex items-center justify-center bg-[#0a0a0c] border border-white/10 rounded text-[var(--color-accent)] shrink-0"><i className={s.icon}></i></div>
                  <input className={inputClass} value={s.icon} onChange={(e) => updateData(['socialLinks', String(i), 'icon'], e.target.value)} />
                  <input className={inputClass} value={s.url} onChange={(e) => updateData(['socialLinks', String(i), 'url'], e.target.value)} />
                <button onClick={() => removeItem('socialLinks', i)} className="text-red-400 p-2 hover:bg-white/5 rounded"><i className="fas fa-trash"></i></button>
              </div>
            ))}
            <button onClick={() => addItem('socialLinks', { platform: "Yeni", url: "#", icon: "fab fa-s" })} className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 rounded hover:bg-white/5 transition-colors">+ Sosyal Medya Ekle</button>
        </SectionCard>

         <div className="space-y-6">
           <SectionCard title="Oyunlar & Topluluk">
              {siteData.games.map((g, i) => (
                <div key={i} className="flex gap-2 items-center mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0a0a0c] border border-white/10 rounded text-[var(--color-accent)] shrink-0"><i className={g.icon}></i></div>
                  <input className={inputClass} value={g.name} onChange={(e) => updateData(['games', String(i), 'name'], e.target.value)} />
                  <input className={inputClass} value={g.url} onChange={(e) => updateData(['games', String(i), 'url'], e.target.value)} />
                  <input className={inputClass} value={g.icon} onChange={(e) => updateData(['games', String(i), 'url'], e.target.value)} />
                  <button onClick={() => removeItem('games', i)} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              <button onClick={() => addItem('games', { name: "Yeni Oyun", url: "#", icon: "fas fa-gamepad" })} className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 rounded hover:bg-white/5 transition-colors">+ Oyun Ekle</button>
           </SectionCard>

           <SectionCard title="Teknolojiler">
              {siteData.technologies.map((t, i) => (
                <div key={i} className="flex gap-2 items-center mb-2">
                    <div className="w-10 h-10 flex items-center justify-center bg-[#0a0a0c] border border-white/10 rounded text-[var(--color-accent)] shrink-0"><i className={t.icon}></i></div>
                   <input className={inputClass} value={t.name} onChange={(e) => updateData(['technologies', String(i), 'name'], e.target.value)} />
                   <input className={inputClass} value={t.icon} onChange={(e) => updateData(['technologies', String(i), 'icon'], e.target.value)} />
                   <button onClick={() => removeItem('technologies', i)} className="text-red-400 p-2"><i className="fas fa-trash"></i></button>
                </div>
              ))}
              <button onClick={() => addItem('technologies', { name: "Yeni Teknoloji", icon: "fas fa-code", primary: false })} className="w-full py-3 border-2 border-dashed border-white/20 text-gray-400 rounded hover:bg-white/5 transition-colors">+ Teknoloji Ekle</button>
           </SectionCard>
      </div>
    </div>
  );
}