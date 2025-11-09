import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Video, Scissors, Download, Copy, PlayCircle, Clock } from "lucide-react";

function secondsToTimestamp(s) {
  const sec = Math.max(0, Math.floor(s));
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return h === "00" ? `${m}:${ss}` : `${h}:${m}:${ss}`;
}

function buildMockMoments(duration, count = 6) {
  if (!duration || !isFinite(duration)) return [];
  const minClip = 8; // seconds
  const maxClip = 20; // seconds
  const moments = [];
  const step = duration / (count + 1);
  for (let i = 1; i <= count; i++) {
    const center = i * step;
    const len = Math.min(maxClip, Math.max(minClip, 10 + ((i * 7) % 9)));
    const start = Math.max(0, center - len / 2);
    const end = Math.min(duration, start + len);
    moments.push({ index: i, start, end, label: mockLabel(i) });
  }
  return moments;
}

function mockLabel(i) {
  const labels = [
    "Peak action",
    "Combo x2",
    "Clutch moment",
    "Ultimate play",
    "Perfect timing",
    "Critical objective",
    "High APM",
    "Teamfight win",
  ];
  return labels[(i - 1) % labels.length];
}

export default function HighlightsExtractor() {
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [moments, setMoments] = useState([]);
  const videoRef = useRef(null);
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("video")) setFile(f);
  }, []);

  const onInput = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("video")) setFile(f);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const dur = v.duration;
    setDuration(dur);
    setMoments(buildMockMoments(dur));
  }, []);

  const playFrom = useCallback((t) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, t);
    v.play();
  }, []);

  const copyTimestamp = useCallback(async (t) => {
    try {
      await navigator.clipboard.writeText(secondsToTimestamp(t));
    } catch (e) {
      // ignore
    }
  }, []);

  const downloadCSV = useCallback(() => {
    const rows = ["index,start,end,label"]; 
    moments.forEach((m) => {
      rows.push(`${m.index},${secondsToTimestamp(m.start)},${secondsToTimestamp(m.end)},${m.label}`);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file ? file.name.replace(/\.[^.]+$/, "") : "highlights"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [moments, file]);

  const downloadSRT = useCallback(() => {
    let idx = 1;
    const lines = [];
    moments.forEach((m) => {
      const start = toSrtTime(m.start);
      const end = toSrtTime(m.end);
      lines.push(`${idx++}`);
      lines.push(`${start} --> ${end}`);
      lines.push(m.label);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file ? file.name.replace(/\.[^.]+$/, "") : "highlights"}.srt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [moments, file]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Estrattore Highlights</h2>
            <p className="text-sm text-slate-600">Carica un video già montato: rileviamo i momenti migliori e generiamo clip pronte all'uso.</p>
          </div>
        </div>

        {!file ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 p-10 text-center hover:bg-slate-50"
          >
            <Video className="h-10 w-10 text-slate-400" />
            <p className="text-slate-700">Trascina qui un video oppure</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow hover:bg-slate-800">
              <input type="file" accept="video/*" className="hidden" onChange={onInput} />
              Scegli file
            </label>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
                <video
                  ref={videoRef}
                  src={objectUrl}
                  controls
                  className="h-64 w-full"
                  onLoadedMetadata={onLoadedMetadata}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1"><Clock className="h-4 w-4" /> Durata: {secondsToTimestamp(duration)}</span>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  onClick={() => setFile(null)}
                >
                  Carica un altro
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Clip suggerite</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadCSV}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" /> CSV
                  </button>
                  <button
                    onClick={downloadSRT}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" /> SRT
                  </button>
                </div>
              </div>

              <ul className="space-y-3">
                {moments.map((m) => (
                  <li key={m.index} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white/60 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 font-semibold text-indigo-700">{m.index}</span>
                        <span>{m.label}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">{secondsToTimestamp(m.start)} → {secondsToTimestamp(m.end)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playFrom(m.start)}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 hover:bg-slate-50"
                        title="Riproduci dal punto"
                      >
                        <PlayCircle className="h-4 w-4" /> Play
                      </button>
                      <button
                        onClick={() => copyTimestamp(m.start)}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 hover:bg-slate-50"
                        title="Copia timestamp"
                      >
                        <Copy className="h-4 w-4" /> Copia
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

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
