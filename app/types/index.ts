export interface Link {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  name?: string;
}

export interface Technology {
  name: string;
  icon: string;
  primary?: boolean;
}

export interface Game {
  name: string;
  url: string;
  icon: string;
}

export interface Project {
  title: string;
  description: string;
  url: string;
}

export interface SiteData {
  title: string;
  subtitle: string;
  email: string;
  profileImage: string;
  topLinks: Link[];
  socialLinks: SocialLink[];
  technologies: Technology[];
  games: Game[];
  projects: Project[];
  copyright: string;
  themeSettings: {
    primary: string;
    accent: string;
  };
}