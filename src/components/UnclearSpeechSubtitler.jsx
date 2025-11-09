import { useCallback, useMemo, useRef, useState } from "react";
import { Subtitles, VolumeX, Download, Highlighter } from "lucide-react";

function toSrtTime(seconds) {
  const ms = Math.floor((seconds % 1) * 1000)
    .toString()
    .padStart(3, "0");
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s},${ms}`;
}

function deriveBackendUrl() {
  const env = import.meta.env.VITE_BACKEND_URL;
  if (env) return env.replace(/\/$/, "");
  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:8000`;
}

export default function UnclearSpeechSubtitler() {
  const [file, setFile] = useState(null);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(-30);
  const [minDuration, setMinDuration] = useState(0.4);
  const videoRef = useRef(null);

  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("video")) setFile(f);
  }, []);

  const onInput = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video")) setFile(f);
  }, []);

  const analyze = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const params = new URLSearchParams({
        noise_db: `${threshold}dB`,
        min_duration: String(minDuration),
      });
      const res = await fetch(`${deriveBackendUrl()}/detect-unclear?${params.toString()}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(`Errore server: ${res.status}`);
      const data = await res.json();
      setSegments(data?.segments || []);
    } catch (e) {
      setError(e.message || "Analisi fallita");
    } finally {
      setLoading(false);
    }
  }, [file, threshold, minDuration]);

  const downloadSrt = useCallback(() => {
    let idx = 1;
    const lines = [];
    segments.forEach((m) => {
      lines.push(String(idx++));
      lines.push(`${toSrtTime(m.start)} --> ${toSrtTime(m.end)}`);
      lines.push("[AUTO CC] Parlato poco chiaro o volume basso");
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file ? file.name.replace(/\.[^.]+$/, "") : "unclear"}.srt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [segments, file]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Subtitles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sottotitoli per Parlato Poco Chiaro</h2>
            <p className="text-sm text-slate-600">Rileva i tratti a volume basso e genera un file SRT placeholder per facilitarne l'editing.</p>
          </div>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 p-10 text-center hover:bg-slate-50"
          >
            <VolumeX className="h-10 w-10 text-slate-400" />
            <p className="text-slate-700">Trascina qui un video oppure</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-slate-800">
              <input type="file" accept="video/*" className="hidden" onChange={onInput} />
              Scegli file
            </label>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
                <video ref={videoRef} src={objectUrl} controls className="h-64 w-full" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Soglia volume (dB)</label>
                  <input
                    type="range"
                    min="-60"
                    max="0"
                    step="1"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-600">{threshold} dB (più basso = più sensibile)</div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Durata minima segmento (s)</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={minDuration}
                    onChange={(e) => setMinDuration(parseFloat(e.target.value) || 0.4)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFile(null)}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Cambia video
                </button>
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-50"
                >
                  <Highlighter className="h-4 w-4" /> {loading ? "Analisi..." : "Rileva tratti poco chiari"}
                </button>
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Segmenti rilevati</h3>
              <ul className="space-y-2">
                {segments.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/60 p-3">
                    <div className="text-sm text-slate-800">
                      <span className="font-medium">{(s.start).toFixed(2)}s</span> → <span className="font-medium">{(s.end).toFixed(2)}s</span>
                      <span className="ml-2 text-xs text-slate-600">{s.label}</span>
                    </div>
                    <div className="text-xs text-slate-500">{s.confidence ? `conf ${s.confidence.toFixed(2)}` : null}</div>
                  </li>
                ))}
              </ul>

              {segments.length > 0 && (
                <button
                  onClick={downloadSrt}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" /> Scarica SRT placeholder
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
