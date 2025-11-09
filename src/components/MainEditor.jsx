import { useMemo, useState } from "react";
import { Sparkles, Scissors, Subtitles, Film } from "lucide-react";
import EditorControls from "./EditorControls";
import VersionGrid from "./VersionGrid";

const effectsCatalog = ["tagli", "zoom dinamico", "flash", "color grade", "motion blur"];

export default function MainEditor({ files }) {
  const [options, setOptions] = useState({ aspect: "16:9", targetLength: 10, preset: "standard", censor: false });
  const [subtitleSegments, setSubtitleSegments] = useState([]);
  const [versions, setVersions] = useState([]);

  const mainVideo = useMemo(() => files.find((f) => f.type.startsWith("video")) || null, [files]);

  const onControlsSubmit = (cfg) => {
    setOptions(cfg);
    if (!mainVideo) return;

    // Build 6 version plans (no real rendering, but reflects combined editing pipeline)
    const base = [
      { title: "Cinematic", aspect: cfg.aspect, badge: "Pro", effects: [effectsCatalog[1], effectsCatalog[3], effectsCatalog[4]] },
      { title: "Punchy Shorts", aspect: "9:16", badge: "Short", effects: [effectsCatalog[0], effectsCatalog[2]] },
      { title: "Square Social", aspect: "1:1", badge: "Social", effects: [effectsCatalog[0], effectsCatalog[1]] },
      { title: "Clean Edit", aspect: cfg.aspect, badge: "Clean", effects: [effectsCatalog[0], effectsCatalog[3]] },
      { title: "Highlight Reel", aspect: cfg.aspect, badge: "Reel", effects: [effectsCatalog[0], effectsCatalog[2], effectsCatalog[1]] },
      { title: "Creator Pack", aspect: cfg.aspect, badge: "Pack", effects: [effectsCatalog[0], effectsCatalog[1], effectsCatalog[3]] },
    ];

    const plans = base.map((b, i) => ({
      ...b,
      slug: `${b.title.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
      targetDuration: Math.min(Math.max(cfg.targetLength, 5), 30),
      timeline: buildCuts(cfg.targetLength),
    }));

    setVersions(plans);
  };

  const buildCuts = (minutes) => {
    const total = minutes * 60;
    const cuts = [];
    let t = 0;
    while (t < total) {
      const len = Math.min(6 + Math.random() * 6, total - t);
      cuts.push({ start: t, end: t + len, label: "clip" });
      t += len + 0.3; // simulate hard cut
    }
    return cuts;
  };

  // Mock run of AI unclear speech detection merged into editor (not separate UI)
  const runSubtitleDetection = async () => {
    if (!mainVideo) return;
    const backend = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8000`;
    const form = new FormData();
    form.append("file", mainVideo, mainVideo.name);
    form.append("noise_db", "-28");
    form.append("min_duration", "0.35");
    const res = await fetch(`${backend}/detect-unclear`, { method: "POST", body: form });
    if (!res.ok) return;
    const data = await res.json();
    const segs = (data?.segments || []).map((s) => ({ start: s.start, end: s.end, label: s.label || "speech", confidence: s.confidence || 0.6 }));
    setSubtitleSegments(segs);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Film className="h-5 w-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-900">Editor Principale</h2>
      </div>

      {!mainVideo ? (
        <p className="text-sm text-slate-600">Carica un video per iniziare.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs"><Scissors className="h-3.5 w-3.5" />Tagli automatici</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs"><Sparkles className="h-3.5 w-3.5" />Effetti</span>
            <button onClick={runSubtitleDetection} className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-500"><Subtitles className="h-3.5 w-3.5" />Genera sottotitoli</button>
          </div>

          <EditorControls onSubmit={onControlsSubmit} />

          <VersionGrid sourceFile={mainVideo} versions={versions} subtitleSegments={subtitleSegments} />
        </div>
      )}
    </section>
  );
}
