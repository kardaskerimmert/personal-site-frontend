import { useState, useEffect } from "react";
import { API_URL } from "~/lib/api";
import type { SiteData } from "~/types";

export function useHome(initialData: SiteData | null) {
  const [siteData, setSiteData] = useState<SiteData | null>(initialData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const init = async () => {
      try {
        const authRes = await fetch(`${API_URL}/api/admin/exists`, { 
          credentials: "include",
          signal: controller.signal 
        });
        
        if (authRes.ok) {
          const authData = await authRes.json();
          if (mounted && authData.loggedIn) {
            setIsLoggedIn(true);
          }
        }
        
        if (!siteData) {
          const dataRes = await fetch(`${API_URL}/api/site-data`, {
            signal: controller.signal
          });
          
          if (dataRes.ok) {
            const body = await dataRes.json();
            if (mounted && body.siteData) {
              setSiteData(body.siteData);
            }
          } else {
            throw new Error("Veri yüklenemedi");
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && mounted) {
          console.error("Home init error:", err);
          setError(err.message || "Bir hata oluştu");
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
  }, [siteData]);

  return { siteData, isLoggedIn, loading, error };
}