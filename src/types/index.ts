export interface RemotionConfig {
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  compositionId: string;
}

export interface PromptConcept {
  id: string;
  title: string;
  stockTitle: string;
  category: string;
  duration: string;
  aspectRatio: string;
  framerate: string;
  videoPrompt: string;
  negativePrompt: string;
  cameraDirective: string;
  lightingDirective: string;
  commercialAppeal: string;
  targetBuyer: string;
  keywords: string[];
  suggestedSeriesAngle?: string;
  technicalQualityScore?: number;
  estimatedDemand?: string;
  generatorTarget?: string;
  createdAt?: string;
  remotionCode?: string;
  remotionConfig?: RemotionConfig;
  animationType?: string;
}

export interface MarketTrend {
  id: string;
  category: string;
  title: string;
  growth: string;
  commercialDemand: string;
  buyerTypes: string[];
  description: string;
  samplePrompts: string[];
  recommendedKeywords: string[];
}

export interface SeriesClip {
  shotType: string;
  stockTitle?: string;
  prompt: string;
  duration: string;
  role: string;
}

export interface SeriesPack {
  seriesName: string;
  seriesRationale?: string;
  clips: SeriesClip[];
  commonKeywords?: string[];
}

export interface GeneratorOptions {
  theme: string;
  customIdea: string;
  cameraMovement: string;
  lightingMood: string;
  duration: string;
  aspectRatio: string;
  generatorTarget: string;
  buyerNiche: string;
  count: number;
}
