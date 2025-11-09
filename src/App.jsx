import { useMemo, useState } from "react";
import { Video, Sparkles, Github } from "lucide-react";
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

  const videoCount = useMemo(
    () => files.filter((f) => f.type.startsWith("video")).length,
    [files]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <Video className="h-4 w-4" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold">AI Video Studio</span>
              <span className="text-xs text-slate-600">Tagli, effetti, sottotitoli, 6 versioni</span>
            </div>
          </div>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Github className="h-4 w-4" />
            Star
          </a>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative mx-auto max-w-7xl px-6 pt-10">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Montaggio video con AI in un unico flusso
              </h1>
              <p className="mt-1 max-w-prose text-sm text-slate-700">
                Carica un clip. L’editor applica tagli intelligenti, effetti, sottotitoli per parlato poco chiaro e genera 6 versioni pronte da confrontare.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Automazione assistita da AI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Uploader
              files={files}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClear={handleClear}
            />
            <MainEditor files={files} />
            <RealHighlightsExtractor />
            <CoverGenerator />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Panoramica</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>File caricati: {files.length}</li>
                <li>Video: {videoCount}</li>
                <li>Formato consigliato: MP4/H.264</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Suggerimenti</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                <li>Usa “Genera sottotitoli” per attivare il rilevamento del parlato poco chiaro.</li>
                <li>Confronta le 6 versioni ed esporta i piani JSON per automazione.</li>
                <li>Genera 6 copertine coordinate per social diversi.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} AI Video Studio</span>
          <span>
            Backend su {import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8000`}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
