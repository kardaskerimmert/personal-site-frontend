[🇹🇷 Türkçe](https://github.com/kardaskerimmert/personal-site-frontend/blob/main/README.TR.md) | [🇬🇧 English](https://github.com/kardaskerimmert/personal-site-frontend/blob/main/README.md)

# Kişisel Portfolyo Frontend

![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**React Router v7**, **Sunucu Taraflı İşleme (SSR)** ve **Tailwind CSS v4** ile oluşturulmuş modern, yüksek performanslı ve tamamen dinamik bir kişisel portfolyo ön yüzü (frontend). Gerçek zamanlı içerik yönetimi için güçlü bir yönetici paneli içerir.

## 🚀 Özellikler

* **⚡ Yüksek Performans:** Hızlı yükleme süreleri ve daha iyi SEO için **Vite** ve **SSR** (Server-Side Rendering) ile oluşturuldu.
* **🎨 Dinamik Tema:** CSS Değişkenleri ile güçlendirilmiş ve Yönetici Paneli üzerinden kontrol edilen gerçek zamanlı renk teması değiştirme (Ana/Vurgu renkleri).
* **📱 Duyarlı (Responsive) Tasarım:** **Tailwind CSS v4** kullanılarak mobil öncelikli yaklaşım.
* **✨ Animasyonlar:** **Framer Motion** kullanılarak pürüzsüz geçişler ve etkileşimli öğeler (örn. Spotlight Kartlar, Hero animasyonları).
* **🔒 Güvenli Yönetici Paneli:**
    * **Canlı Önizleme:** İçeriği düzenleyin ve değişiklikleri anında bölünmüş görünüm (split-view) modunda görün.
    * **Modüler Mimari:** Mantık (Hooks) ve Arayüz (Components) birbirinden ayrılmıştır.
    * **Kimlik Doğrulama:** HttpOnly çerezleri ile güvenli giriş akışı.
* **📢 Bildirimler:** `sonner` kullanan modern toast bildirimleri.
* **💀 Skeleton Yükleme:** Daha iyi bir kullanıcı deneyimi (UX) için cilalı yükleme durumları.
* **🌍 SEO Optimize Edilmiş:** API verilerine dayalı dinamik meta etiketleri ve Open Graph (OG) desteği.

## 🛠 Teknoloji Yığını

* **Framework:** React Router v7 (eski adıyla Remix/React Router)
* **Dil:** TypeScript
* **Stil:** Tailwind CSS v4
* **Animasyonlar:** Framer Motion
* **İkonlar:** FontAwesome (CDN üzerinden)
* **Bildirimler:** Sonner
* **HTTP İstemcisi:** Native Fetch API
* **Derleme Aracı:** Vite

## 📂 Proje Yapısı

Proje, modüler ve bileşen tabanlı bir mimari izler:

```text
app/
├── components/
│   ├── admin/          # Yöneticiye özel bileşenler (Formlar, Modallar, Bölüm Kartları)
│   └── ui/             # Yeniden kullanılabilir UI bileşenleri (SpotlightCard, Background, Skeleton)
├── hooks/              # Mantıksal ayrım için özel hook'lar (useDashboard, useHome)
├── lib/                # Yardımcı fonksiyonlar, API sabitleri ve Tema mantığı
├── routes/             # Dosya tabanlı yönlendirme (Home, Admin, Dashboard)
├── types/              # Paylaşılan TypeScript arayüzleri (interfaces)
├── root.tsx            # Kök düzen (layout) ve global bağlam
└── app.css             # Tailwind importları ve CSS değişken tanımları

```

## ⚙️ Kurulum & Ayarlar

### 1. Depoyu (Repository) Klonlayın


```bash
git clone https://github.com/kardaskerimmert/personal-site-frontend
cd personal-site-frontend
```

### 2. Bağımlılıkları Yükleyin

Bu proje **pnpm** kullanmaktadır.

```bash
pnpm install
```

### 3. Ortam Değişkenleri

Kök dizinde bir `.env` dosyası oluşturun:


```
# URL of your backend API
VITE_API_URL=http://localhost:4000
```

## 🏃‍♂️ Uygulamayı Çalıştırma

### Geliştirme Modu

HMR (Hot Module Replacement) ile geliştirme sunucusunu başlatır.

```bash
pnpm dev
```

### Prodüksiyon Derlemesi (Build)

Uygulamayı prodüksiyon için derler (Sunucu ve İstemci paketleri).

```bash
pnpm build

```

### Prodüksiyon Başlatma

Derlenmiş uygulamayı çalıştırır.

```bash
pnpm start

```

## 🎨 Tema Sistemi

Uygulama, CSS değişkenlerine dayalı dinamik bir tema sistemi kullanır.

1.  **Backend:** `primary (ana)` ve `accent (vurgu)` HEX kodlarını saklar.
    
2.  **Frontend (Mantık):** Bu renkleri çeker ve kök stil özniteliğine (root style attribute) enjekte eder.
    
3.  **Tailwind (v4):** Bu değişkenleri kullanmak üzere `app.css` içinde yapılandırılmıştır:
    
```css
@theme {
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
}

```
Bu sayede tüm sitenin renk şeması, yeniden derleme veya dağıtım (deployment) gerektirmeden anında değişebilir.

## 🛡️ Yönetici Paneli (Dashboard)

Panel, "İlgi Alanlarının Ayrımı" `(Separation of Concerns)` ilkesiyle tasarlanmıştır:

-   **`useDashboard` Hook:** Tüm API mantığını (Çekme, Kaydetme, Çıkış), Durum yönetimini ve İyimser UI güncellemelerini yönetir.
    
-   **`DashboardForm`:** Girdi alanlarını ve veri girişini yönetir.
    
-   **`DashboardPreview`:** Mevcut durumu kullanarak portfolyonun canlı önizlemesini oluşturur.
    

## 📄 License

Bu proje [MIT Lisansı](https://www.google.com/search?q=LICENSE) altında lisanslanmıştır.