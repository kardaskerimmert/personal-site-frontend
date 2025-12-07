import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_URL } from "~/lib/api";
import Background from "~/components/ui/Background"; // Arka planı import ettik

export function meta() { return [{ title: "Admin Panel Giriş" }]; }

export default function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [exists, setExists] = useState<boolean | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_URL}/api/admin/exists`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.loggedIn) { navigate("/admin/dashboard"); return; }
        setExists(Boolean(data.exists));
      })
      .catch(() => { if (mounted) setExists(false); })
      .finally(() => { if (mounted) setChecking(false); });
    return () => { mounted = false; };
  }, [navigate]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/setup`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ username, password, setupToken }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Hata oluştu"); }
      alert("Admin hesabı oluşturuldu.");
      navigate("/admin/dashboard");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Giriş başarısız");
      navigate("/admin/dashboard");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  // Ortak Input Stilleri (Dark Mode)
  const inputClass = "w-full p-3 bg-[#0a0a0c] border border-white/10 rounded-lg text-white outline-none focus:border-blue-500 transition-colors placeholder-gray-600";
  const labelClass = "block text-sm font-medium mb-2 text-gray-400";

  // YÜKLENİYOR EKRANI (Dark)
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] font-sans relative overflow-hidden p-4">
      
      {/* 1. ARKA PLAN EFEKTİ */}
      <Background />

      {/* 2. İÇERİK KUTUSU (Z-Index ile öne aldık) */}
      <div className="relative z-10 w-full max-w-md">
        
        {exists ? (
          // --- LOGIN FORMU ---
          <div className="bg-[#141420] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Hoş Geldiniz</h1>
              <p className="text-gray-400 text-sm">Yönetici paneline erişmek için giriş yapın.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Kullanıcı Adı</label>
                <input type="text" className={inputClass} value={username} onChange={e=>setUsername(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Şifre</label>
                <input type="password" className={inputClass} value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              
              {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </button>
            </form>
          </div>
        ) : (
          // --- SETUP FORMU ---
          <div className="bg-[#141420] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Sistem Kurulumu</h1>
              <p className="text-gray-400 text-sm">İlk yönetici hesabınızı oluşturun.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-green-400">Kurulum Anahtarı (Setup Token)</label>
                <input 
                  type="text" 
                  placeholder=".env dosyasındaki anahtar" 
                  className="w-full p-3 bg-green-900/10 border border-green-500/30 rounded-lg text-green-400 outline-none focus:border-green-500 transition-colors placeholder-green-800/50 font-mono" 
                  value={setupToken} 
                  onChange={e=>setSetupToken(e.target.value)} 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Kullanıcı Adı</label>
                <input type="text" className={inputClass} value={username} onChange={e=>setUsername(e.target.value)} required />
              </div>
              <div>
                <label className={labelClass}>Şifre</label>
                <input type="password" className={inputClass} value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>

              {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
              >
                {loading ? "Oluşturuluyor..." : "Hesabı Oluştur"}
              </button>
            </form>
          </div>
        )}
        
      </div>
    </div>
  );
}