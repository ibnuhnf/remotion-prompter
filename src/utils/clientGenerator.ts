import { PromptConcept } from '../types';

interface GenerateOptions {
  theme: string;
  customIdea?: string;
  cameraMovement: string;
  lightingMood: string;
  duration: string;
  aspectRatio: string;
  generatorTarget: string;
  buyerNiche: string;
  count: number;
}

const THEME_TITLES: Record<string, string[]> = {
  corporate: [
    'Eksekutif Bisnis Modern Rapat Kolaboratif di Ruang Kaca High-Rise',
    'Presentasi Analitik Data Finansial pada Layar Interaktif Tipis',
    'Tim Multikultural Berdiskusi Strategi di Ruang Kerja Terbuka'
  ],
  tech_ai: [
    'Peneliti AI Menganalisis Visualisasi Data Holografik di Laboratorium',
    'Server Data Center Modern dengan Indikator LED Berkedip Halus',
    'Robotika Cerdas Bekerja Sama dengan Teknisi di Pabrik Presisi'
  ],
  culinary_fnb: [
    'Barista Profesional Menuang Latte Art dengan Slow Motion 120fps',
    'Chef Menaburkan Garam Kristal dan Bumbu pada Steak Wagyu Panggang',
    'Minuman Segar Berkarbonasi dengan Percikan Es Batu dan Irisan Buah'
  ],
  nature_drone: [
    'Drone Aerial Sinematik Menyusuri Garis Pantai Tebing Karang Saat Sunset',
    'Kabut Pagi Menyelimuti Hutan Pinus Pegunungan dengan Cahaya Menembus',
    'Air Terjun Mengalir Deras ke Lembah Hijau dengan Sudut Pandang Rendah'
  ],
  lifestyle_wellness: [
    'Seseorang Melakukan Meditasi Yoga di Tepi Danau yang Tenang Saat Subuh',
    'Aktivitas Lari Pagi di Taman Kota dengan Cahaya Emas Golden Hour',
    'Momen Santai Membaca Buku di Balkon Rumah Modern Berpohon Asri'
  ],
  industrial: [
    'Pekerja Konstruksi Terampil Menggunakan Mesin Presisi dengan Percikan Api Halus',
    'Inspeksi Panel Surya Skala Besar di Gurun dengan Sudut Drone Luas',
    'Lengan Robot Industri Otomotif Merakit Komponen dengan Gerakan Mulus'
  ]
};

export function generateClientPrompts(options: GenerateOptions): PromptConcept[] {
  const count = options.count || 2;
  const theme = options.theme || 'corporate';
  const titles = THEME_TITLES[theme] || THEME_TITLES.corporate;

  const results: PromptConcept[] = [];

  for (let i = 0; i < count; i++) {
    const title = titles[i % titles.length];
    const camera = options.cameraMovement.replace(/_/g, ' ');
    const lighting = options.lightingMood.replace(/_/g, ' ');
    const idea = options.customIdea ? `${options.customIdea}. ` : '';

    const commercialPrompt = `4K UHD ProRes 422 HQ footage, 35mm prime lens f/2.0, subtle smooth ${camera} motion. ${idea}Cinematic commercial high-end depiction of ${title.toLowerCase()}, featuring atmospheric ${lighting} with volumetric light falloff and soft bokeh background. Generous copy space on the right third of the frame for text overlay. Clean commercial microstock composition, zero motion blur, photorealistic color grading, ultra-sharp detail --ar ${options.aspectRatio}`;

    results.push({
      id: `client-prompt-${Date.now()}-${i}`,
      title: title,
      stockTitle: `4K Stock Footage of ${title} with Commercial Copy Space`,
      category: theme,
      duration: options.duration || '8s',
      aspectRatio: options.aspectRatio || '16:9',
      framerate: '60 FPS Ultra Smooth',
      videoPrompt: commercialPrompt,
      negativePrompt: 'deformed, blurry, jittery camera, distorted hands, extra limbs, watermark, logo, trademark, brand names, low resolution, noisy artifacts, flicker, cartoon, oversaturated, unstable motion',
      cameraDirective: `35mm prime lens f/2.0, mechanical gimbal stabilizer, ${camera}`,
      lightingDirective: `Commercial high-key diffused lighting, ${lighting}`,
      commercialAppeal: 'Klip ini dirancang dengan negative space luas di sepertiga frame sehingga sangat diminati pembeli korporat dan agensi periklanan untuk memasukkan teks promosi atau logo.',
      targetBuyer: 'Agensi Periklanan, Kampanye Korporat, Materi Promosi Digital',
      keywords: [
        '4k video', 'stock footage', 'commercial footage', 'royalty free', 'editorial', 'ultra hd',
        'clean background', 'copy space', 'advertising', 'presentation', 'slow motion', 'cinematic',
        'modern', 'professional', 'shutterstock video', 'adobe stock', theme, ...options.cameraMovement.split('_'), ...options.lightingMood.split('_')
      ],
      suggestedSeriesAngle: 'Buat shot lanjutan dengan sudut close-up ekspresi atau detail tangan untuk melengkapi serial klip.',
      technicalQualityScore: 98,
      estimatedDemand: 'Sangat Tinggi',
      generatorTarget: options.generatorTarget || 'runway_gen3'
    });
  }

  return results;
}
