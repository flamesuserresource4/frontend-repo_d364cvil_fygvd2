import { useMemo, useState } from "react";
import Uploader from "./components/Uploader";
import EditorControls from "./components/EditorControls";
import PreviewPicker from "./components/PreviewPicker";
import AIChat from "./components/AIChat";
import HighlightsExtractor from "./components/HighlightsExtractor";

function App() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleAddFiles = (incoming) => {
    // Merge e deduplica per name+size
    const map = new Map();
    [...files, ...incoming].forEach((f) => map.set(`${f.name}-${f.size}`, f));
    setFiles(Array.from(map.values()));
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => setFiles([]);

  const generatePreviews = ({ targetLength, aspect, preset, censor }) => {
    // Mock: genera fino a 6 anteprime da file video caricati o placeholder neri
    const videoFiles = files.filter((f) => f.type.startsWith("video"));
    const generated = [];

    for (let i = 0; i < 6; i++) {
      const f = videoFiles[i];
      if (f) generated.push(URL.createObjectURL(f));
      else generated.push("");
    }

    setPreviews(generated);
    setSelectedPreview(null);
  };

  const restart = () => {
    setSelectedPreview(null);
    setPreviews([]);
  };

  const hasSelection = useMemo(() => selectedPreview !== null, [selectedPreview]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-slate-900">AI Video Studio</div>
          <div className="text-xs text-slate-600">Ottimizzato per YouTube • 16:9 · 9:16 · 1:1</div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Uploader
              files={files}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClear={handleClear}
            />
            <EditorControls onSubmit={generatePreviews} />
            <PreviewPicker
              previews={previews}
              onRestart={restart}
              onSelect={(idx) => setSelectedPreview(idx)}
            />
            {/* Nuova funzionalità: estrazione highlight da un video già montato */}
            <HighlightsExtractor />
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Stato</h3>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>File caricati: {files.length}</li>
                <li>Anteprime generate: {previews.filter(Boolean).length}/6</li>
                <li>
                  Selezione: {hasSelection ? `Anteprima #${(selectedPreview ?? 0) + 1}` : "Nessuna"}
                </li>
              </ul>
            </div>
            <AIChat onUpload={handleAddFiles} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
