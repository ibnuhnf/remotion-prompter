import React, { useState } from 'react';
import { PromptConcept } from '../types';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  CheckSquare, 
  Square, 
  Settings2, 
  Eye, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

interface CsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptConcept[];
}

export type ExportFormat = 'shutterstock' | 'adobestock' | 'master' | 'json';

export const CsvExportModal: React.FC<CsvExportModalProps> = ({
  isOpen,
  onClose,
  prompts
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('shutterstock');
  const [filePrefix, setFilePrefix] = useState('stock_4k_');
  const [fileExt, setFileExt] = useState('.mp4');
  const [startIndex, setStartIndex] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(prompts.map(p => p.id));
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');

  if (!isOpen) return null;

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === prompts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prompts.map(p => p.id));
    }
  };

  const selectedPrompts = prompts.filter(p => selectedIds.includes(p.id));

  // Map category to standard Shutterstock / Adobe Stock category ID or name
  const mapCategory = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('tech') || c.includes('ai')) return 'Technology';
    if (c.includes('corp') || c.includes('bisnis') || c.includes('business')) return 'Business/Finance';
    if (c.includes('food') || c.includes('makan') || c.includes('kuliner')) return 'Food and Drink';
    if (c.includes('health') || c.includes('lifestyle') || c.includes('medis')) return 'Healthcare/Medical';
    if (c.includes('nature') || c.includes('alam') || c.includes('drone')) return 'Nature';
    if (c.includes('energy') || c.includes('energi')) return 'Industrial';
    if (c.includes('abstract') || c.includes('abstrak')) return 'Abstract';
    if (c.includes('urban') || c.includes('arsitektur')) return 'Buildings/Landmarks';
    if (c.includes('travel') || c.includes('wisata')) return 'Transportation';
    return 'Miscellaneous';
  };

  // Build CSV Data based on selected template
  const buildCsvContent = () => {
    if (selectedFormat === 'json') {
      return JSON.stringify(selectedPrompts, null, 2);
    }

    let headers: string[] = [];
    let rows: string[][] = [];

    if (selectedFormat === 'shutterstock') {
      // Official Shutterstock CSV format:
      // Filename, Description, Keywords, Categories, Editorial, Mature content, Illustration
      headers = ['Filename', 'Description', 'Keywords', 'Categories', 'Editorial', 'Mature content', 'Illustration'];
      rows = selectedPrompts.map((p, idx) => {
        const num = String(startIndex + idx).padStart(3, '0');
        const filename = `${filePrefix}${num}${fileExt}`;
        const description = (p.stockTitle || p.title).replace(/"/g, '""');
        const keywords = p.keywords ? p.keywords.join(', ').replace(/"/g, '""') : '';
        const category = mapCategory(p.category);
        return [
          `"${filename}"`,
          `"${description}"`,
          `"${keywords}"`,
          `"${category}"`,
          `"no"`,
          `"no"`,
          `"no"`
        ];
      });
    } else if (selectedFormat === 'adobestock') {
      // Official Adobe Stock CSV format:
      // Filename, Title, Keywords, Category, Releases
      headers = ['Filename', 'Title', 'Keywords', 'Category', 'Releases'];
      rows = selectedPrompts.map((p, idx) => {
        const num = String(startIndex + idx).padStart(3, '0');
        const filename = `${filePrefix}${num}${fileExt}`;
        const title = (p.stockTitle || p.title).replace(/"/g, '""');
        const keywords = p.keywords ? p.keywords.join(', ').replace(/"/g, '""') : '';
        const category = mapCategory(p.category);
        return [
          `"${filename}"`,
          `"${title}"`,
          `"${keywords}"`,
          `"${category}"`,
          `""`
        ];
      });
    } else {
      // Master Studio Production CSV (Complete Details)
      headers = [
        'Filename',
        'Stock Title',
        'Duration',
        'Aspect Ratio',
        'Framerate',
        'Target AI Generator',
        'AI Video Prompt',
        'Negative Prompt',
        'Camera Directive',
        'Lighting Directive',
        'Commercial Appeal',
        'Keywords (Tags)'
      ];
      rows = selectedPrompts.map((p, idx) => {
        const num = String(startIndex + idx).padStart(3, '0');
        const filename = `${filePrefix}${num}${fileExt}`;
        return [
          `"${filename}"`,
          `"${(p.stockTitle || p.title).replace(/"/g, '""')}"`,
          `"${p.duration || '8s'}"`,
          `"${p.aspectRatio || '16:9'}"`,
          `"${p.framerate || '60 FPS'}"`,
          `"${p.generatorTarget || 'Runway Gen-3'}"`,
          `"${(p.videoPrompt || '').replace(/"/g, '""')}"`,
          `"${(p.negativePrompt || '').replace(/"/g, '""')}"`,
          `"${(p.cameraDirective || '').replace(/"/g, '""')}"`,
          `"${(p.lightingDirective || '').replace(/"/g, '""')}"`,
          `"${(p.commercialAppeal || '').replace(/"/g, '""')}"`,
          `"${(p.keywords || []).join(', ').replace(/"/g, '""')}"`
        ];
      });
    }

    const csvBody = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return `\uFEFF${csvBody}`; // UTF-8 BOM for flawless Excel compatibility
  };

  const handleDownload = () => {
    if (selectedPrompts.length === 0) return;

    const content = buildCsvContent();
    const isJson = selectedFormat === 'json';
    const mimeType = isJson ? 'application/json;charset=utf-8;' : 'text/csv;charset=utf-8;';
    const ext = isJson ? 'json' : 'csv';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedFormat}_metadata_${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    const content = buildCsvContent();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-10">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Ekspor Metadata CSV Microstock</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                {selectedPrompts.length} dari {prompts.length} Klip
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Format metadata otomatis siap impor untuk Shutterstock, Adobe Stock, atau Master Production Sheet.
            </p>
          </div>
        </div>

        {/* Format Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <button
            type="button"
            onClick={() => setSelectedFormat('shutterstock')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedFormat === 'shutterstock'
                ? 'bg-red-500/15 border-red-500 text-white ring-1 ring-red-500'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
              Format Resmi
            </span>
            <span className="text-xs font-bold text-white block">Shutterstock CSV</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Filename, Desc, 50 Tags</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('adobestock')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedFormat === 'adobestock'
                ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Format Resmi
            </span>
            <span className="text-xs font-bold text-white block">Adobe Stock CSV</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Filename, Title, Tags, Cat</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('master')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedFormat === 'master'
                ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Lengkap &amp; Detail
            </span>
            <span className="text-xs font-bold text-white block">Master Production</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Prompt, Camera, Specs, Tags</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('json')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedFormat === 'json'
                ? 'bg-cyan-500/15 border-cyan-500 text-white ring-1 ring-cyan-500'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
              Developer / Backup
            </span>
            <span className="text-xs font-bold text-white block">JSON Array</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Struktur data utuh</span>
          </button>
        </div>

        {/* Tab Switcher for Preview / Customization */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Tabel ({selectedPrompts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Pengaturan Penamaan File &amp; Pilih Klip</span>
            </button>
          </div>

          <button
            onClick={handleSelectAll}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            {selectedIds.length === prompts.length ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Batal Pilih Semua</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Pilih Semua Klip ({prompts.length})</span>
              </>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-4">
          {activeTab === 'preview' ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-x-auto">
              {selectedFormat === 'json' ? (
                <pre className="p-4 text-xs font-mono text-cyan-200 max-h-[340px] overflow-auto">
                  {buildCsvContent()}
                </pre>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Filename</th>
                      <th className="p-3">
                        {selectedFormat === 'shutterstock' ? 'Description' : 'Title'}
                      </th>
                      <th className="p-3">Keywords Preview</th>
                      <th className="p-3">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {selectedPrompts.map((prompt, idx) => {
                      const num = String(startIndex + idx).padStart(3, '0');
                      const fn = `${filePrefix}${num}${fileExt}`;
                      return (
                        <tr key={prompt.id} className="hover:bg-slate-900/50">
                          <td className="p-3 text-slate-500">{idx + 1}</td>
                          <td className="p-3 text-emerald-400 font-semibold whitespace-nowrap">{fn}</td>
                          <td className="p-3 font-sans max-w-xs truncate text-slate-200" title={prompt.stockTitle || prompt.title}>
                            {prompt.stockTitle || prompt.title}
                          </td>
                          <td className="p-3 text-slate-400 max-w-sm truncate" title={prompt.keywords?.join(', ')}>
                            {prompt.keywords?.slice(0, 5).join(', ')}... ({prompt.keywords?.length || 0} tags)
                          </td>
                          <td className="p-3 text-cyan-300 whitespace-nowrap font-sans">
                            {mapCategory(prompt.category)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Naming Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Awalan Nama File (Prefix):
                  </label>
                  <input
                    type="text"
                    value={filePrefix}
                    onChange={e => setFilePrefix(e.target.value)}
                    placeholder="stock_4k_"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Misal: footage_4k_, ad_clip_</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mulai Nomor Urut:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={startIndex}
                    onChange={e => setStartIndex(Number(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Hasil: {filePrefix}{String(startIndex).padStart(3, '0')}{fileExt}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Ekstensi Video:
                  </label>
                  <select
                    value={fileExt}
                    onChange={e => setFileExt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value=".mp4">.mp4 (Standar H.264 / H.265)</option>
                    <option value=".mov">.mov (Apple ProRes)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block mt-1">Pilih format video render Anda</span>
                </div>
              </div>

              {/* Clip Checklist Selection */}
              <div>
                <span className="text-xs font-bold text-white block mb-2">
                  Pilih Klip yang Mau Dimasukkan ke File CSV:
                </span>
                <div className="space-y-2">
                  {prompts.map((p, idx) => {
                    const isChecked = selectedIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleSelect(p.id)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-slate-950 border-emerald-500/60 text-white'
                            : 'bg-slate-950/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <div>
                            <span className="text-xs font-bold block">{p.stockTitle || p.title}</span>
                            <span className="text-[10px] text-slate-400 block">
                              {p.duration} &bull; {p.aspectRatio} &bull; {p.keywords?.length || 0} Keywords
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/50">
                          {filePrefix}{String(startIndex + idx).padStart(3, '0')}{fileExt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Format CSV kompatibel langsung dengan Microsoft Excel, Google Sheets, &amp; portal upload kontributor.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyClipboard}
              disabled={selectedPrompts.length === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks CSV</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={selectedPrompts.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File CSV ({selectedPrompts.length} Klip)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
