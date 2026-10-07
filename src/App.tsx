import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudioBrainstorm } from './components/StudioBrainstorm';
import { OmniTransitionStudio } from './components/OmniTransitionStudio';
import { TrendRadar } from './components/TrendRadar';
import { SeriesPackBuilder } from './components/SeriesPackBuilder';
import { PromptDoctor } from './components/PromptDoctor';
import { RemotionStudio } from './components/RemotionStudio';
import { SavedPrompts } from './components/SavedPrompts';
import { MicrostockGuideModal } from './components/MicrostockGuideModal';
import { PromptConcept } from './types';
import { Film, Sparkles, TrendingUp, Layers, HelpCircle, Heart, Video } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [savedPrompts, setSavedPrompts] = useState<PromptConcept[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // States passed from other tabs to Studio, Omni or Series Builder
  const [studioCategory, setStudioCategory] = useState<string | undefined>(undefined);
  const [studioIdea, setStudioIdea] = useState<string | undefined>(undefined);
  const [seriesConcept, setSeriesConcept] = useState<string | undefined>(undefined);
  const [omniPrompt, setOmniPrompt] = useState<string | undefined>(undefined);

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('stockprompt_saved_prompts');
      if (stored) {
        setSavedPrompts(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved prompts from localStorage', e);
    }
  }, []);

  // Save prompts handler
  const handleSavePrompt = (prompt: PromptConcept) => {
    setSavedPrompts(prev => {
      const exists = prev.some(p => p.id === prompt.id);
      let updated: PromptConcept[];
      if (exists) {
        updated = prev.filter(p => p.id !== prompt.id);
      } else {
        updated = [
          { ...prompt, createdAt: new Date().toISOString() },
          ...prev
        ];
      }
      try {
        localStorage.setItem('stockprompt_saved_prompts', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist to localStorage', e);
      }
      return updated;
    });
  };

  const handleRemoveSavedPrompt = (id: string) => {
    setSavedPrompts(prev => {
      const updated = prev.filter(p => p.id !== id);
      try {
        localStorage.setItem('stockprompt_saved_prompts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleClearAllSaved = () => {
    if (window.confirm('Hapus semua ide yang disimpan di koleksi?')) {
      setSavedPrompts([]);
      try {
        localStorage.removeItem('stockprompt_saved_prompts');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // From Trend Radar -> Go to Studio with that trend
  const handleSelectTrendForStudio = (category: string, idea: string) => {
    // Map Indonesian category name to id if possible
    let catId = 'tech_ai';
    if (category.toLowerCase().includes('energi') || category.toLowerCase().includes('terbarukan')) catId = 'renewable_energy';
    else if (category.toLowerCase().includes('makanan') || category.toLowerCase().includes('kuliner')) catId = 'food_slowmo';
    else if (category.toLowerCase().includes('lifestyle') || category.toLowerCase().includes('kesehatan')) catId = 'lifestyle_health';
    else if (category.toLowerCase().includes('bisnis') || category.toLowerCase().includes('korporat')) catId = 'corporate';
    else if (category.toLowerCase().includes('abstrak')) catId = 'abstract_vfx';
    else if (category.toLowerCase().includes('alam') || category.toLowerCase().includes('drone')) catId = 'nature_drone';

    setStudioCategory(catId);
    setStudioIdea(idea);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From PromptCard -> Build 5-shot series pack
  const handleGenerateSeriesFromPrompt = (prompt: PromptConcept) => {
    setSeriesConcept(prompt.stockTitle || prompt.title);
    setActiveTab('series');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From PromptCard -> Render Video in Omni Transition Studio
  const handleSendToOmni = (promptText: string) => {
    setOmniPrompt(promptText);
    setActiveTab('omni');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPrompts.length}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'studio' && (
          <StudioBrainstorm
            onSavePrompt={handleSavePrompt}
            savedPrompts={savedPrompts}
            onGenerateSeries={handleGenerateSeriesFromPrompt}
            onSendToOmni={handleSendToOmni}
            initialCategory={studioCategory}
            initialIdea={studioIdea}
          />
        )}

        {activeTab === 'omni' && (
          <OmniTransitionStudio initialPrompt={omniPrompt} />
        )}

        {activeTab === 'trends' && (
          <TrendRadar onSelectTrendForStudio={handleSelectTrendForStudio} />
        )}

        {activeTab === 'series' && (
          <SeriesPackBuilder initialConcept={seriesConcept} />
        )}

        {activeTab === 'doctor' && (
          <PromptDoctor />
        )}

        {activeTab === 'remotion' && (
          <RemotionStudio />
        )}

        {activeTab === 'saved' && (
          <SavedPrompts
            savedPrompts={savedPrompts}
            onRemovePrompt={handleRemoveSavedPrompt}
            onClearAll={handleClearAllSaved}
            onGenerateSeries={handleGenerateSeriesFromPrompt}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">StockPrompt 4K</span>
            <span>&bull;</span>
            <span>Studio Brainstorming Video AI untuk Kontributor Microstock</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Panduan Lolos Shutterstock
            </button>
            <span>&bull;</span>
            <span className="font-mono text-emerald-400/80">Resolusi 4K UHD 60fps</span>
          </div>
        </div>
      </footer>

      {/* Microstock Contributor Guide Modal */}
      <MicrostockGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
