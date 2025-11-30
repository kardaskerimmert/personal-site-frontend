import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

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

// --- ŞEMALAR ---
type FieldType = 'text' | 'textarea' | 'checkbox';
interface SchemaField { key: string; label: string; type: FieldType; }

const SCHEMAS: Record<string, SchemaField[]> = {
  simple: [{ key: 'value', label: 'Değer', type: 'text' }],
  game: [{ key: 'name', label: 'Oyun Adı', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }, { key: 'icon', label: 'İkon (örn: fab fa-steam)', type: 'text' }],
  tech: [{ key: 'name', label: 'Teknoloji', type: 'text' }, { key: 'icon', label: 'İkon', type: 'text' }, { key: 'primary', label: 'Ana Teknoloji mi?', type: 'checkbox' }],
  project: [{ key: 'title', label: 'Başlık', type: 'text' }, { key: 'description', label: 'Açıklama', type: 'textarea' }, { key: 'url', label: 'URL', type: 'text' }],
  social: [{ key: 'platform', label: 'Platform', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }, { key: 'icon', label: 'İkon', type: 'text' }],
  topLink: [{ key: 'label', label: 'Yazı', type: 'text' }, { key: 'url', label: 'URL', type: 'text' }]
};

// --- YARDIMCI BİLEŞENLER ---

// 1. SectionCard (SORUNUN ÇÖZÜLDÜĞÜ YER - Kendi state'i var)
const SectionCard = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-4 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-4 bg-gray-50 flex justify-between items-center text-left hover:bg-gray-100 transition"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && <div className="p-6 border-t border-gray-100 animate-fade-in-down">{children}</div>}
    </div>
  );
};

// 2. Editable Wrapper
const Editable = ({ children, onClick, className = "", label = "Düzenle" }: any) => (
  <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(e); }} className={`group relative cursor-pointer border-2 border-transparent hover:border-blue-500 hover:bg-blue-500/10 rounded transition-all duration-200 ${className}`}>
    {children}
    <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 pointer-events-none whitespace-nowrap">
      <i className="fas fa-pencil-alt mr-1"></i> {label}
    </div>
  </div>
);

// 3. Spotlight Card (Önizleme İçin)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className={`group relative border border-white/10 bg-white/5 overflow-hidden rounded-xl ${className}`} onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(113, 41, 238, 0.15), transparent 80%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

// 4. Edit Modal
const EditModal = ({ isOpen, onClose, onSave, initialData, schemaType, title }: any) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (isOpen) setFormData(schemaType === 'simple' ? { value: initialData } : { ...initialData });
  }, [initialData, isOpen, schemaType]);

  if (!isOpen) return null;
  const fields = SCHEMAS[schemaType] || SCHEMAS.simple;
  const handleChange = (key: string, val: any) => setFormData((prev: any) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e2d] w-full max-w-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-[#151521]">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition"><i className="fas fa-times"></i></button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-gray-400 text-sm font-medium mb-1.5">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea className="w-full bg-[#0d0d12] text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500 min-h-[100px]" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} />
              ) : field.type === 'checkbox' ? (
                <div className="flex items-center gap-3 p-3 bg-[#0d0d12] border border-gray-600 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" checked={!!formData[field.key]} onChange={(e) => handleChange(field.key, e.target.checked)} />
                  <span className="text-white text-sm">Evet</span>
                </div>
              ) : (
                <input type="text" className="w-full bg-[#0d0d12] text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-blue-500" value={formData[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-[#151521] flex justify-end gap-3 border-t border-gray-700">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition text-sm">İptal</button>
          <button onClick={() => onSave(schemaType === 'simple' ? formData.value : formData)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-sm font-medium">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

// --- ANA DASHBOARD ---
export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');

  // Modal State
  const [editModal, setEditModal] = useState({ open: false, path: [] as string[], data: null, schemaType: 'simple', title: '' });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authCheck = await fetch("http://localhost:4000/api/admin/exists", { credentials: "include" });
        const authData = await authCheck.json();
        if (!authData.loggedIn) { navigate("/admin"); return; }

        const dataRes = await fetch("http://localhost:4000/api/site-data");
        if (dataRes.ok) {
           const body = await dataRes.json();
           setSiteData(body.siteData || null);
        }
      } catch (err) {
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, [navigate]);

  const handleSaveToServer = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:4000/api/site-data", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ siteData }),
      });
      if (res.status === 401) { alert("Oturum doldu."); navigate("/admin"); return; }
      if (!res.ok) throw new Error("Hata");
      alert("Kaydedildi!");
    } catch (err: any) { alert("Hata: " + err.message); } finally { setSaving(false); }
  };

  const updateData = (path: string[], value: any) => {
    if (!siteData) return;
    const newData = JSON.parse(JSON.stringify(siteData));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) { current = current[path[i]]; }
    current[path[path.length - 1]] = value;
    setSiteData(newData);
  };

  const openEdit = (path: string[], schemaType: string, title: string) => {
    if (!siteData) return;
    let val = siteData as any;
    for (const p of path) val = val[p];
    setEditModal({ open: true, path, data: val, schemaType, title });
  };

  const handleModalSave = (newData: any) => {
    updateData(editModal.path, newData);
    setEditModal({ ...editModal, open: false });
  };

  const addItem = (arrayName: keyof SiteData, newItem: any) => {
    if (!siteData) return;
    setSiteData({ ...siteData, [arrayName]: [...(siteData[arrayName] as any[]), newItem] });
  };

  const removeItem = (arrayName: keyof SiteData, index: number) => {
    if (!siteData) return;
    setSiteData({ ...siteData, [arrayName]: (siteData[arrayName] as any[]).filter((_, i) => i !== index) });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-600">Yükleniyor...</div>;
  if (!siteData) return <div className="h-screen flex items-center justify-center">Veri yok.</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="bg-white shadow border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Panel</h1>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setViewMode('form')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'form' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}><i className="fas fa-list mr-2"></i>Form</button>
              <button onClick={() => setViewMode('preview')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}><i className="fas fa-eye mr-2"></i>Önizleme</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-800 text-sm font-medium px-3">Siteye Git <i className="fas fa-external-link-alt ml-1"></i></button>
             <button onClick={handleSaveToServer} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all">{saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {saving ? '...' : 'Kaydet'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        
        {/* === FORM MODE === */}
        {viewMode === 'form' && (
          <div className="animate-fade-in-up">
            <SectionCard title="Genel Bilgiler" defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-1">Başlık</label><input className="w-full p-2 border rounded" value={siteData.title} onChange={(e) => updateData(['title'], e.target.value)} /></div>
                <div><label className="block text-sm font-medium mb-1">Alt Başlık</label><input className="w-full p-2 border rounded" value={siteData.subtitle} onChange={(e) => updateData(['subtitle'], e.target.value)} /></div>
                <div><label className="block text-sm font-medium mb-1">E-posta</label><input className="w-full p-2 border rounded" value={siteData.email} onChange={(e) => updateData(['email'], e.target.value)} /></div>
                <div><label className="block text-sm font-medium mb-1">Profil Resmi URL</label><div className="flex gap-2"><input className="flex-1 p-2 border rounded" value={siteData.profileImage} onChange={(e) => updateData(['profileImage'], e.target.value)} /><img src={siteData.profileImage} className="w-10 h-10 rounded-full" /></div></div>
              </div>
            </SectionCard>

            <SectionCard title="Projeler">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteData.projects.map((p, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg border relative group hover:shadow-md">
                    <button onClick={() => removeItem('projects', i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><i className="fas fa-trash"></i></button>
                    <div className="space-y-2">
                      <input className="w-full p-2 border rounded font-bold" value={p.title} onChange={(e) => updateData(['projects', String(i), 'title'], e.target.value)} placeholder="Proje Adı" />
                      <textarea className="w-full p-2 border rounded text-sm" rows={2} value={p.description} onChange={(e) => updateData(['projects', String(i), 'description'], e.target.value)} placeholder="Açıklama" />
                      <input className="w-full p-2 border rounded text-sm text-blue-600" value={p.url} onChange={(e) => updateData(['projects', String(i), 'url'], e.target.value)} placeholder="URL" />
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem('projects', { title: "Yeni", description: "", url: "#" })} className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-blue-500 hover:border-blue-500"><i className="fas fa-plus text-2xl mb-1"></i>Ekle</button>
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <SectionCard title="Oyunlar & Topluluk">
                  {siteData.games.map((g, i) => (
                    <div key={i} className="flex gap-2 items-center mb-2">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"><i className={g.icon}></i></div>
                      <input className="flex-1 p-2 border rounded" value={g.name} onChange={(e) => updateData(['games', String(i), 'name'], e.target.value)} />
                      <input className="flex-1 p-2 border rounded" value={g.url} onChange={(e) => updateData(['games', String(i), 'url'], e.target.value)} />
                      <button onClick={() => removeItem('games', i)} className="text-red-500 p-2"><i className="fas fa-trash"></i></button>
                    </div>
                  ))}
                  <button onClick={() => addItem('games', { name: "Yeni Oyun", url: "#", icon: "fas fa-gamepad" })} className="w-full py-2 border-2 border-dashed text-gray-500 rounded hover:bg-gray-50">+ Oyun Ekle</button>
               </SectionCard>

               <SectionCard title="Teknolojiler">
                  {siteData.technologies.map((t, i) => (
                    <div key={i} className="flex gap-2 items-center mb-2">
                       <input className="flex-1 p-2 border rounded" value={t.name} onChange={(e) => updateData(['technologies', String(i), 'name'], e.target.value)} />
                       <button onClick={() => removeItem('technologies', i)} className="text-red-500 p-2"><i className="fas fa-trash"></i></button>
                    </div>
                  ))}
                  <button onClick={() => addItem('technologies', { name: "Yeni Teknoloji", icon: "fas fa-code", primary: false })} className="w-full py-2 border-2 border-dashed text-gray-500 rounded hover:bg-gray-50">+ Teknoloji Ekle</button>
               </SectionCard>
            </div>
          </div>
        )}

        {/* === PREVIEW MODE === */}
        {viewMode === 'preview' && (
          <div className="border-4 border-gray-800 rounded-xl overflow-hidden shadow-2xl relative bg-[#0a0a0c]">
             <div className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-3 py-1 rounded-full text-xs shadow-lg pointer-events-none opacity-80"><i className="fas fa-magic mr-1"></i> Düzenlemek için öğelere tıkla</div>
             
             <div className="w-full min-h-screen bg-[#0a0a0c] text-[#F0F0F0] font-['Inter'] overflow-x-hidden p-5 flex flex-col relative">
                
                {/* Top Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center py-6 h-[80px]">
                   <div className="flex gap-6 text-sm font-medium">
                      {siteData.topLinks.map((link, i) => (
                        <Editable key={i} onClick={() => openEdit(['topLinks', String(i)], 'topLink', 'Link Düzenle')}>
                           <span className="text-gray-400 hover:text-[#3DDC84] relative group block">{link.label}</span>
                        </Editable>
                      ))}
                   </div>
                   <div className="flex gap-4 text-xl">
                      {siteData.socialLinks.map((social, i) => (
                        <Editable key={i} onClick={() => openEdit(['socialLinks', String(i)], 'social', 'Sosyal Medya')}>
                           <i className={`${social.icon} text-gray-400 hover:text-[#7129ee]`}></i>
                        </Editable>
                      ))}
                   </div>
                </div>

                {/* Hero */}
                <div className="flex-grow flex flex-col items-center text-center relative w-full justify-center my-10">
                   <Editable onClick={() => openEdit(['profileImage'], 'simple', 'Profil Resmi')}>
                      <div className="relative group w-48 h-48 lg:w-64 lg:h-64 rounded-full mb-8">
                         <div className="absolute -inset-1 bg-gradient-to-r from-[#3DDC84] to-[#7129ee] rounded-full blur opacity-50"></div>
                         <img src={siteData.profileImage} className="relative w-full h-full rounded-full object-cover border-4 border-[#141420]" />
                      </div>
                   </Editable>

                   <Editable onClick={() => openEdit(['title'], 'simple', 'Başlık')}><h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-4">{siteData.title.toUpperCase()}</h1></Editable>
                   <Editable onClick={() => openEdit(['subtitle'], 'simple', 'Alt Başlık')}><div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10"><span className="w-2 h-2 rounded-full bg-[#3DDC84]"></span><p className="text-[#3DDC84] font-mono">{siteData.subtitle}</p></div></Editable>

                   {/* Grid Area */}
                   <div className="mt-20 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pb-12">
                      <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                         {siteData.technologies.map((tech, i) => (
                            <Editable key={i} onClick={() => openEdit(['technologies', String(i)], 'tech', 'Teknoloji')}>
                               <span className={`px-3 py-1.5 rounded-md text-xs font-bold border flex items-center gap-2 ${tech.primary ? 'bg-[#3DDC84]/20 border-[#3DDC84] text-[#3DDC84]' : 'bg-white/5 border-white/10 text-gray-400'}`}><i className={tech.icon}></i> {tech.name}</span>
                            </Editable>
                         ))}
                      </div>
                      <div className="flex justify-center">
                         <Editable onClick={() => openEdit(['email'], 'simple', 'Email')}>
                            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-gray-300"><i className="far fa-envelope text-[#7129ee]"></i> {siteData.email}</div>
                         </Editable>
                      </div>
                      <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                         {siteData.games.map((game, i) => (
                            <Editable key={i} onClick={() => openEdit(['games', String(i)], 'game', 'Oyun')}>
                               <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#7129ee]/10 border border-[#7129ee]/30 text-[#a78bfa] flex items-center gap-2"><i className={game.icon}></i> {game.name}</span>
                            </Editable>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Projects */}
                <div className="border-t border-white/10 py-10">
                   <h2 className="text-3xl font-bold mb-10 text-center"><span className="text-[#7129ee]">#</span> PROJELER</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {siteData.projects.map((project, i) => (
                         <Editable key={i} onClick={() => openEdit(['projects', String(i)], 'project', 'Proje')} className="h-full">
                            <SpotlightCard className="h-full p-6 flex flex-col bg-[#141420]">
                               <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                               <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>
                               <span className="text-[#3DDC84] text-sm font-semibold">Projeyi İncele &rarr;</span>
                            </SpotlightCard>
                         </Editable>
                      ))}
                   </div>
                   <Editable onClick={() => openEdit(['copyright'], 'simple', 'Copyright')} className="mt-10 text-center block">
                      <p className="text-sm text-gray-500 font-mono">{siteData.copyright}</p>
                   </Editable>
                </div>
             </div>
          </div>
        )}
      </main>

      <EditModal isOpen={editModal.open} onClose={() => setEditModal({...editModal, open: false})} onSave={handleModalSave} initialData={editModal.data} schemaType={editModal.schemaType} title={editModal.title} />
    </div>
  );
}