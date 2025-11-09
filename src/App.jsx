import { useMemo, useState } from "react";
import Uploader from "./components/Uploader";
import MainEditor from "./components/MainEditor";
import RealHighlightsExtractor from "./components/RealHighlightsExtractor";
import CoverGenerator from "./components/CoverGenerator";

function App() {
  const [files, setFiles] = useState([]);

  const handleAddFiles = (incoming) => {
    const map = new Map();
    [...files, ...incoming].forEach((f) => map.set(`${f.name}-${f.size}`, f));
    setFiles(Array.from(map.values()));
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => setFiles([]);

  const videoCount = useMemo(() => files.filter((f) => f.type.startsWith("video")).length, [files]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-slate-900">AI Video Studio</div>
          <div className="text-xs text-slate-600">Editor intelligente: tagli, effetti, sottotitoli, 6 versioni</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Uploader files={files} onAddFiles={handleAddFiles} onRemoveFile={handleRemoveFile} onClear={handleClear} />
            <MainEditor files={files} />
            <RealHighlightsExtractor />
            <CoverGenerator />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Stato</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>File caricati: {files.length}</li>
                <li>Video: {videoCount}</li>
                <li>Suggerimento: genera le 6 versioni con un click dall'editor.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
