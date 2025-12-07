import type { SiteData } from "~/types";

export function getThemeStyles(siteData: SiteData | null) {
  if (!siteData || !siteData.themeSettings) return {};

  return {
    "--color-primary": siteData.themeSettings.primary,
    "--color-accent": siteData.themeSettings.accent,
  } as React.CSSProperties;
}