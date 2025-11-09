import React, { useRef, useState } from 'react';
import { Scissors, Download, Copy } from 'lucide-react';

const runtimeBackend = (() => {
  if (import.meta.env.VITE_BACKEND_URL) return import.meta.env.VITE_BACKEND_URL;
  if (typeof window !== 'undefined') {
    try {
      const u = new URL(window.location.href);
      u.port = '8000';
      return `${u.protocol}//${u.hostname}:${u.port}`;
    } catch (e) {
      // fallthrough
    }
  }
  return 'http://localhost:8000';
})();

function toSrtTime(seconds) {
  const ms = Math.floor((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms).padStart(3, '0')}`;
}

export default function HighlightsExtractor() {
  const [video, setVideo] = useState(null);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const onPick = async (file) => {
    setVideo(file);
    setMoments([]);
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('desired_segments', '6');
      const res = await fetch(`${runtimeBackend}/extract-highlights`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Errore estrazione');
      const json = await res.json();
      setMoments(json.moments || []);
    } catch (e) {
      console.error(e);
      setMoments([]);
    } finally {
      setLoading(false);
    }
  };

  const playAt = (t) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = t;
    videoRef.current.play();
  };

  const downloadCSV = () => {
    const rows = [['start', 'end', 'label'], ...moments.map((m) => [m.start, m.end, m.label])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlights.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSRT = () => {
    const srt = moments
      .map((m, i) => `${i + 1}\n${toSrtTime(m.start)} --> ${toSrtTime(m.end)}\n${m.label}\n`)
      .join('\n');
    const blob = new Blob([srt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'highlights.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Scissors size={18} />
        <h2 className="text-lg font-semibold">Estrattore Highlights</h2>
      </div>

      <label className="mb-3 block">
        <input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        <div className="cursor-pointer rounded-md border border-dashed border-white/20 bg-black/20 p-4 text-center text-sm text-white/70 hover:bg-black/30">
          {video ? 'Cambia video' : 'Seleziona o trascina un video già editato'}
        </div>
      </label>

      {video && (
        <video ref={videoRef} src={URL.createObjectURL(video)} controls className="w-full rounded-lg" />
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-white/70">
          {loading ? 'Analisi in corso…' : moments.length > 0 ? `${moments.length} momenti trovati` : 'Nessun momento disponibile'}
        </p>
        <div className="flex gap-2">
          <button onClick={downloadCSV} disabled={!moments.length} className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20 disabled:opacity-40">
            <Download size={14} /> CSV
          </button>
          <button onClick={downloadSRT} disabled={!moments.length} className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20 disabled:opacity-40">
            <Download size={14} /> SRT
          </button>
        </div>
      </div>

      {moments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {moments.map((m, i) => (
            <li key={i} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
              <div>
                <div className="font-medium">{m.label}</div>
                <div className="text-xs text-white/60">{m.start.toFixed(1)}s → {m.end.toFixed(1)}s</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => playAt(m.start)} className="rounded-md bg-indigo-500 px-2 py-1 text-xs font-medium hover:bg-indigo-400">Play</button>
                <button
                  onClick={() => navigator.clipboard.writeText(`${Math.floor(m.start / 60)}:${String(Math.floor(m.start % 60)).padStart(2, '0')}`)}
                  className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
                >
                  <Copy size={14} /> Copia timestamp
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
