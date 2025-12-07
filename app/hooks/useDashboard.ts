import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { API_URL } from "~/lib/api";
import type { SiteData } from "~/types";

export function useDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const init = async () => {
      try {
        const authCheck = await fetch(`${API_URL}/api/admin/exists`, { 
          credentials: "include",
          signal: controller.signal
        });
        
        if (!authCheck.ok) throw new Error("Auth check failed");
        
        const authData = await authCheck.json();
        
        if (!authData.loggedIn) {
          if (mounted) navigate("/admin");
          return;
        }

        const dataRes = await fetch(`${API_URL}/api/site-data`, {
          signal: controller.signal
        });
        
        if (dataRes.ok) {
          const body = await dataRes.json();
          if (mounted) setSiteData(body.siteData || null);
        } else {
          throw new Error("Veri yüklenemedi");
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Dashboard init error:", err);
          if (mounted) {
            toast.error("Bağlantı hatası");
            navigate("/admin");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const saveToServer = async () => {
    if (!siteData) {
      toast.error("Kaydedilecek veri yok");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/site-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ siteData }),
      });

      if (res.status === 401) {
        toast.warning("Oturum doldu. Lütfen tekrar giriş yapın.");
        navigate("/admin");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Kaydetme hatası");
      }

      setHasUnsavedChanges(false);
      toast.success("Başarıyla kaydedildi!");
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error("Kaydetme hatası: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/admin");
    }
  };

  const updateData = useCallback((path: string[], value: any) => {
    setSiteData((prev) => {
      if (!prev) return null;
      
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);

  const applyTheme = useCallback((primary: string, accent: string) => {
    setSiteData((prev) => {
      if (!prev) return null;
      
      const newData = JSON.parse(JSON.stringify(prev));
      if (!newData.themeSettings) newData.themeSettings = {};
      newData.themeSettings.primary = primary;
      newData.themeSettings.accent = accent;
      
      setHasUnsavedChanges(true);
      return newData;
    });
  }, []);

  const addItem = useCallback((arrayName: keyof SiteData, newItem: any) => {
    setSiteData((prev) => {
      if (!prev) return null;
      setHasUnsavedChanges(true);
      return { ...prev, [arrayName]: [...(prev[arrayName] as any[]), newItem] };
    });
  }, []);

  const removeItem = useCallback((arrayName: keyof SiteData, index: number) => {
    setSiteData((prev) => {
      if (!prev) return null;
      setHasUnsavedChanges(true);
      return { ...prev, [arrayName]: (prev[arrayName] as any[]).filter((_, i) => i !== index) };
    });
  }, []);

  return {
    siteData,
    loading,
    saving,
    hasUnsavedChanges,
    saveToServer,
    logout,
    updateData,
    applyTheme,
    addItem,
    removeItem,
  };
}