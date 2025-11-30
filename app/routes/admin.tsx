import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [{ title: "Admin Panel Giriş" }];
}

export default function Admin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [exists, setExists] = useState<boolean | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // 1. Admin var mı kontrol et
    // 2. Eğer admin varsa ve zaten login olmuşsak dashboard'a at
    fetch("http://localhost:4000/api/admin/exists", { credentials: "include" })
      .then((r) => r.json())
      .then((data: { exists?: boolean; loggedIn?: boolean }) => {
        if (!mounted) return;
        
        if (data.loggedIn) {
            navigate("/admin/dashboard");
            return;
        }

        setExists(Boolean(data.exists));
      })
      .catch(() => {
        if (mounted) setExists(false);
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Admin oluşturulamadı");
      }

      setExists(true);
      setError(null);
      alert("Admin hesabı oluşturuldu. Lütfen giriş yapın.");
      setUsername("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Kullanıcı adı veya şifre hatalı");
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Yükleniyor...</p>
      </main>
    );
  }

  // Admin hesabı varsa -> LOGIN FORMU
  if (exists) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Girişi</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none transition"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Şifre</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Admin hesabı yoksa -> SETUP FORMU
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Kurulum</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Sitenizi yönetmek için bir yönetici hesabı oluşturun.</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-lg border-gray-300 border p-2.5 focus:border-blue-500 focus:ring-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Oluşturuluyor..." : "Hesabı Oluştur"}
          </button>
        </form>
      </div>
    </main>
  );
}