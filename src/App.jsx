import { useMemo, useState } from "react";
import Hero from "./components/Hero";
import Uploader from "./components/Uploader";
import EditorControls from "./components/EditorControls";
import PreviewPicker from "./components/PreviewPicker";
import AIChat from "./components/AIChat";

function App() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleAddFiles = (incoming) => {
    // Merge and de-duplicate by name+size for UX
    const map = new Map();
    [...files, ...incoming].forEach((f) => map.set(`${f.name}-${f.size}`, f));
    setFiles(Array.from(map.values()));
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => setFiles([]);

  const generatePreviews = ({ targetLength, aspect, preset, censor }) => {
    // Mock preview generation using local object URLs for the first videos
    const videoFiles = files.filter((f) => f.type.startsWith("video"));
    const limit = Math.min(6, videoFiles.length || 6);

    // If not enough videos uploaded, create dummy black videos via data URI as placeholders
    const generated = [];
    for (let i = 0; i < limit; i++) {
      const f = videoFiles[i];
      if (f) generated.push(URL.createObjectURL(f));
      else generated.push("");
    }
    while (generated.length < 6) generated.push("");

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
      <Hero />

      <main className="mx-auto max-w-7xl px-6 -mt-10 pb-24">
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
