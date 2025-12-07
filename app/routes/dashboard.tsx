import { useState } from "react";
import { getThemeStyles } from "~/lib/theme";
import EditModal from "~/components/admin/EditModal";
import Background from "~/components/ui/Background";
import { useDashboard } from "~/hooks/useDashboard";
import DashboardForm from "~/components/admin/DashboardForm";
import DashboardPreview from "~/components/admin/DashboardPreview";

export default function Dashboard() {
  const { 
    siteData, loading, saving, 
    saveToServer, logout, updateData, applyTheme, addItem, removeItem 
  } = useDashboard();

  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [editModal, setEditModal] = useState({ open: false, path: [] as string[], data: null, schemaType: 'simple', title: '' });

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0a0a0c] text-white">Yükleniyor...</div>;
  if (!siteData) return <div className="h-screen flex items-center justify-center bg-[#0a0a0c] text-white">Veri yok.</div>;

  return (
    <div 
      className="min-h-screen font-sans text-gray-200 relative overflow-x-hidden"
      style={getThemeStyles(siteData)}
    >
      <Background />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">Admin Panel</h1>
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button onClick={() => setViewMode('form')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'form' ? 'bg-[var(--color-primary)] text-[#0a0a0c] shadow-lg' : 'text-gray-400 hover:text-white'}`}><i className="fas fa-list mr-2"></i>Form</button>
              <button onClick={() => setViewMode('preview')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-[var(--color-primary)] text-[#0a0a0c] shadow-lg' : 'text-gray-400 hover:text-white'}`}><i className="fas fa-eye mr-2"></i>Önizleme</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <a href="/" target="_blank" className="text-gray-400 hover:text-white text-sm font-medium px-3">Siteye Git <i className="fas fa-external-link-alt ml-1"></i></a>
             <button onClick={saveToServer} disabled={saving} className="bg-[var(--color-primary)] hover:bg-opacity-80 text-[#0a0a0c] font-bold px-5 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all">{saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>} {saving ? '...' : 'Kaydet'}</button>
             <button onClick={logout} className="text-red-400 hover:text-red-500 px-3 transition-colors" title="Çıkış Yap"><i className="fas fa-sign-out-alt text-xl"></i></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 relative z-10">
        
        {viewMode === 'form' ? (
          <DashboardForm 
            siteData={siteData} 
            updateData={updateData} 
            applyTheme={applyTheme} 
            addItem={addItem} 
            removeItem={removeItem} 
          />
        ) : (
          <DashboardPreview 
            siteData={siteData} 
            onEditClick={openEdit} 
          />
        )}

      </main>

      <EditModal isOpen={editModal.open} onClose={() => setEditModal({...editModal, open: false})} onSave={handleModalSave} initialData={editModal.data} schemaType={editModal.schemaType} title={editModal.title} />
    </div>
  );
}