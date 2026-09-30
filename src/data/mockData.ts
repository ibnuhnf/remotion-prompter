export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularFor: string;
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: 'tech_ai',
    name: 'Teknologi & AI',
    icon: 'Cpu',
    description: 'Data center, microchip, robotika, antarmuka futuristik, cyber security',
    popularFor: 'Fintech, SaaS, Brand Teknologi'
  },
  {
    id: 'corporate',
    name: 'Bisnis & Korporat',
    icon: 'Briefcase',
    description: 'Rapat hybrid, kantor modern minimalis, presentasi, kerja tim otentik',
    popularFor: 'Perusahaan B2B, HR, Konsultan'
  },
  {
    id: 'food_slowmo',
    name: 'Makanan & Kuliner (120fps)',
    icon: 'Coffee',
    description: 'Tuangan kopi espresso, sizzle wagyu, cipratan buah segar, saus gourmet',
    popularFor: 'Restoran, Aplikasi Delivery, Iklan TV'
  },
  {
    id: 'lifestyle_health',
    name: 'Lifestyle & Wellness',
    icon: 'HeartPulse',
    description: 'Yoga di taman, lansia bugar aktif, meditasi pagi, lari pantai, hidrasi',
    popularFor: 'Suplemen, Asuransi, Klinik Kesehatan'
  },
  {
    id: 'nature_drone',
    name: 'Alam & Drone Sinematik',
    icon: 'Mountain',
    description: 'Pesisir pantai tropis, kabut hutan pinus, air terjun megah, jalan tebing',
    popularFor: 'Travel Agency, Dokumenter, Iklan Mobil'
  },
  {
    id: 'renewable_energy',
    name: 'Energi Terbarukan & Eco',
    icon: 'Wind',
    description: 'Kincir angin lepas pantai, panel surya ladang hijau, mobil listrik',
    popularFor: 'Laporan ESG, Perusahaan Hijau, NGO'
  },
  {
    id: 'urban_architecture',
    name: 'Arsitektur & Kota 4K',
    icon: 'Building2',
    description: 'Gedung pencakar langit kaca, jembatan modern senja, lampu lalu lintas malam',
    popularFor: 'Real Estate, Video Presentasi Arsitek'
  },
  {
    id: 'abstract_vfx',
    name: 'Abstrak 3D & VJ Loop',
    icon: 'Sparkles',
    description: 'Gelombang sutra mewah, cairan kaca berbias warna, partikel data fotonik',
    popularFor: 'Hero Background Web, Event LED, TV Intro'
  },
  {
    id: 'medical_science',
    name: 'Medis & Laboratorium',
    icon: 'Dna',
    description: 'Pipet dan cawan petri steril, mikroskop digital, dokter ramah, bioteknologi',
    popularFor: 'Rumah Sakit, Farmasi, Riset Ilmiah'
  },
  {
    id: 'industrial_logistics',
    name: 'Industri & Logistik',
    icon: 'Truck',
    description: 'Gudang otomatis robotik, kapal kargo pelabuhan, ban berjalan modern',
    popularFor: 'E-Commerce, Rantai Pasok, Manufaktur'
  },
  {
    id: 'travel_culture',
    name: 'Wisata & Budaya Lokal',
    icon: 'Compass',
    description: 'Pasar tradisional eksotis, pengrajin tembikar, lentera festival malam',
    popularFor: 'Maskapai, Pariwisata, Agen Tur'
  },
  {
    id: 'craft_artisanal',
    name: 'Kerajinan & Seni Tangan',
    icon: 'Hammer',
    description: 'Pembuatan keramik tanah liat, penyamakan kulit, melukis cat minyak macro',
    popularFor: 'Brand Mewah, Artisanal Goods'
  }
];

export const CAMERA_MOVEMENTS = [
  { id: 'drone_aerial_forward', name: 'Drone Aerial Maju Halus', desc: 'Gerakan terbang stabil dari atas ke depan' },
  { id: 'slider_left_right', name: 'Slow Motion Slider (Kiri-Kanan)', desc: 'Gerakan horizontal mulus memberi kedalaman' },
  { id: 'macro_extreme_close_up', name: 'Macro Extreme Close-Up (100mm)', desc: 'Fokus detail mikro dengan background bokeh pekat' },
  { id: 'slow_dolly_in', name: 'Slow Dolly In (Maju Perlahan)', desc: 'Kamera perlahan mendekati subjek utama' },
  { id: '360_orbit', name: '360° Orbit Mengitari Subjek', desc: 'Memutari objek secara konsisten dan sinematik' },
  { id: 'static_tripod_hero', name: 'Static Locked Tripod (Hero Shot)', desc: 'Kamera diam kokoh, subjek bergerak anggun di frame' },
  { id: 'low_angle_pedestal', name: 'Low Angle Pedestal (Bawah ke Atas)', desc: 'Melihat ke atas memberi kesan megah dan megapolitan' },
  { id: 'fpv_smooth_sweep', name: 'FPV Smooth Gliding Sweep', desc: 'Menukik halus melintasi pemandangan spektakuler' }
];

export const LIGHTING_MOODS = [
  { id: 'golden_hour', name: 'Golden Hour (Sunset / Sunrise)', desc: 'Cahaya emas hangat dengan bayangan lembut berdimensi' },
  { id: 'studio_commercial', name: 'Studio Komersial Bersih (High-Key)', desc: 'Pencahayaan terang merata tanpa bayangan tajam, bersih' },
  { id: 'moody_cinematic', name: 'Moody Cinematic (Teal & Orange)', desc: 'Kontras kaya dengan saturasi warna film Hollywood' },
  { id: 'soft_window_natural', name: 'Cahaya Alami Jendela (Diffused)', desc: 'Sinar matahari pagi lembut menerobos kaca jendela' },
  { id: 'cyberpunk_neon', name: 'Cyberpunk & Neon Ambient', desc: 'Pendaran neon magenta, sian, dan biru malam hari' },
  { id: 'backlit_rim', name: 'Backlit Rim Light (Siluet Terang)', desc: 'Cahaya dari belakang membentuk garis tepi berkilau pada subjek' }
];

export const DURATIONS = [
  { id: '5s', name: '5 Detik', desc: 'Cocok untuk B-Roll pendek, TikTok Ads, dan Transisi video' },
  { id: '8s', name: '8 Detik', desc: 'Durasi terlaris di Shutterstock & Adobe Stock' },
  { id: '10s', name: '10 Detik', desc: 'Durasi standar komersial untuk background web & TV' },
  { id: '15s', name: '15 Detik', desc: 'Mini storyline utuh untuk video presentasi perusahaan' }
];

export const ASPECT_RATIOS = [
  { id: '16:9', name: '16:9 Landscape', desc: 'Standar Microstock Utama (TV, YouTube, Layar Monitor, Billboard)' },
  { id: '9:16', name: '9:16 Portrait / Vertical', desc: 'Format Populer untuk Iklan Reels, TikTok, YouTube Shorts' },
  { id: '1:1', name: '1:1 Square', desc: 'Format Carousel & Feed Iklan Media Sosial' }
];

export const AI_GENERATORS = [
  { id: 'runway_gen3', name: 'Runway Gen-3 Alpha', badge: 'Ultra Smooth', syntaxNote: 'Memakai motion prompts & bracket camera tags' },
  { id: 'kling_ai', name: 'Kling AI 1.5 / 2.0', badge: 'Realistic Physics', syntaxNote: 'Kuat pada fisika cairan & gerakan manusia alami' },
  { id: 'luma_dream', name: 'Luma Dream Machine', badge: 'Gimbal Stability', syntaxNote: 'Sangat stabil pada pergerakan kamera bebas 3D' },
  { id: 'sora', name: 'OpenAI Sora', badge: 'Cinematic World', syntaxNote: 'Pemahaman sinematografi 35mm yang sangat dalam' },
  { id: 'remotion', name: 'Remotion (React 4K Video)', badge: 'React Code', syntaxNote: 'Kode React animasi 60fps untuk looping background & HUD' },
  { id: 'hailuo_minimax', name: 'Hailuo / Minimax', badge: 'Fluid Animation', syntaxNote: 'Bagus untuk detail mikro dan ekspresi gerak' },
  { id: 'midjourney_veo', name: 'Midjourney + Veo 3.1', badge: 'Hyper Quality', syntaxNote: 'Tekstur fotorealistik tingkat master 4K' }
];

export const BUYER_NICHES = [
  { id: 'commercial_ad', name: 'Agensi Iklan Komersial', desc: 'Mencari ruang kosong (copy space) untuk menaruh teks penawaran' },
  { id: 'tech_startup', name: 'Startup Teknologi & SaaS', desc: 'Mencari visual data, AI, dan kolaborasi modern' },
  { id: 'corporate_deck', name: 'Presentasi Perusahaan & Investor', desc: 'Mencari visual pertumbuhan bisnis, keberagaman tim, dan stabilitas' },
  { id: 'wellness_brand', name: 'Brand Kesehatan & Gaya Hidup', desc: 'Mencari nuansa ketenangan, vitalitas, dan produk organik' },
  { id: 'broadcast_tv', name: 'Televisi & Kanal YouTube', desc: 'Mencari footage B-Roll transisi berkualitas tinggi 60fps' }
];

export const RANDOM_INSPIRATIONS = [
  'Barista artisan menuangkan susu oat dengan latte art dedaunan pada cangkir keramik hitam matte',
  'Turbin angin lepas pantai berputar anggun di atas samudra berkilau saat matahari terbit keemasan',
  'Teknisi perempuan di laboratorium cleanroom memeriksa silikon chip mikro beriluminasi cahaya neon biru',
  'Pasangan lansia bugar berbusana kasual tersenyum sambil bersepeda santai di tepi pantai pagi hari',
  'Tetesan embun pagi meluncur perlahan di daun monstera hijau segar dalam gerakan ultra slow-motion',
  'Gedung pencakar langit berkaca cermin memantulkan pergerakan awan senja di distrik finansial modern',
  'Mobil listrik minimalis melaju senyap di jalan tol pegunungan berkabut dengan lampu LED depan menyala',
  'Tangan profesional mengenakan jam tangan pintar sedang mengetuk grafik analitik di tablet digital',
  'Gelombang cairan emas cair dan kaca transparan yang meliuk-liuk membentuk loop animasi abstrak 4K',
  'Koki sushi profesional memotong tuna segar dengan pisau damascus tajam dalam slow-motion 120fps'
];
