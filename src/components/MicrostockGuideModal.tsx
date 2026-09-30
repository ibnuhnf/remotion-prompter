import React from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  Tv, 
  Clock, 
  Tag, 
  ShieldCheck, 
  DollarSign, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface MicrostockGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MicrostockGuideModal: React.FC<MicrostockGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panduan Lolos Kurasi &amp; Jual Video 4K di Microstock</h2>
            <p className="text-xs text-slate-400">
              Standar Industri untuk Shutterstock, Adobe Stock, Pond5 &amp; Getty Images
            </p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 text-sm">
          {/* 1. Standar Teknis Resolusi */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>1. Spesifikasi Teknis Video 4K</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Resolusi:</strong> Minimum 3840 x 2160 (4K UHD) atau 4096 x 2160 (DCI 4K). Hindari resolusi 1080p karena harga jual 4K jauh lebih tinggi ($60 - $200 per lisensi).</li>
              <li><strong>Frame Rate:</strong> 60 FPS (sangat disukai karena pembeli bisa me-slowmotion di timeline editor mereka) atau 24/30 FPS untuk cinematic film look.</li>
              <li><strong>Format File:</strong> .MP4 (H.264 / H.265) atau Apple ProRes 422 dengan bitrate tinggi (minimal 80 - 150 Mbps).</li>
              <li><strong>Scan Type:</strong> Progressive (tanpa interlaced scanning).</li>
            </ul>
          </div>

          {/* 2. Rahasia Durasi Emas 5 - 15 Detik */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>2. Mengapa Durasi 5 - 15 Detik Paling Laris?</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Di Shutterstock dan Adobe Stock, harga jual klip 5 detik sama dengan klip 30 detik. Namun pembeli (editor iklan TV, desainer website, pembuat konten) hampir selalu hanya memakai potongan 3 sampai 8 detik dalam adegan mereka! Klip pendek 5-15 detik lebih cepat di-render di AI, ukuran file lebih hemat, dan sangat diminati untuk background loop.
            </p>
          </div>

          {/* 3. Negative Space (Ruang Kosong untuk Teks Iklan) */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. 'Negative Space': Kunci Video Cepat Dibeli Agensi Iklan</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lebih dari 70% pembeli video stok adalah agensi iklan atau tim korporat. Mereka membutuhkan <strong>ruang kosong bersih (Negative Space)</strong> di sisi kiri, kanan, atau atas video untuk menaruh tulisan promo, slogan, atau logo brand mereka. Pastikan komposisi video tidak terlalu padat di seluruh frame!
            </p>
          </div>

          {/* 4. Penyebab Reject Paling Umum & Solusinya */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/60 space-y-2">
            <h3 className="font-bold text-rose-300 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>4. Penyebab Utama Video Ditolak (Reject) Inspektur</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">❌ Trademark / Logo Merek:</span>
                Pastikan tidak ada logo Apple di laptop, lambang mobil BMW, Starbucks di cangkir, atau tulisan brand. Gunakan negative prompt: <code>no logo, no trademark, unbranded</code>.
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">❌ Teks Acak / Glitch AI:</span>
                AI kadang menghasilkan tulisan huruf acak di papan reklame atau baju. Pastikan bersih dari teks menggunakan negative prompt.
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">❌ Gerakan Kamera Goyang / Jitter:</span>
                Video microstock menuntut kestabilan gimbal atau slider tripod. Gunakan prompt gerakan yang stabil (Smooth Drone, Slow Dolly).
              </div>
              <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">❌ Wajah Cacat / Distorsi Tangan:</span>
                Periksa frame video AI sebelum submit. Jika ada jari berlebih atau mata meleleh, jangan submit klip tersebut.
              </div>
            </div>
          </div>

          {/* 5. Kebijakan AI di Shutterstock & Adobe Stock */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>5. Status Penjualan Video AI di Shutterstock &amp; Adobe Stock</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adobe Stock dan Shutterstock menerima konten yang dibuat dengan generative AI secara legal, dengan syarat:
            </p>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              <li>Centang opsi <strong>"Created using generative AI tools"</strong> saat mengisi formulir upload.</li>
              <li>Jangan meniru karya artis spesifik (misal: "in style of Christopher Nolan").</li>
              <li>Berikan judul dan tag yang jujur mendeskripsikan subjek video.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Mengerti &amp; Kembali ke Studio
          </button>
        </div>
      </div>
    </div>
  );
};
