import { useEffect, useMemo, useRef } from "react";

function toWebVTT(segments) {
  // segments: [{start, end, label}] seconds
  const lines = ["WEBVTT", ""]; 
  const fmt = (t) => {
    const h = Math.floor(t / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((t % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    const ms = Math.round((t - Math.floor(t)) * 1000)
      .toString()
      .padStart(3, "0");
    return `${h}:${m}:${s}.${ms}`; // WebVTT uses dot separator
  };
  segments.forEach((s, idx) => {
    lines.push(`${idx + 1}`);
    lines.push(`${fmt(s.start)} --> ${fmt(s.end)}`);
    lines.push(s.label || "...");
    lines.push("");
  });
  return lines.join("\n");
}

export default function VersionGrid({ sourceFile, versions, subtitleSegments }) {
  const url = useMemo(() => (sourceFile ? URL.createObjectURL(sourceFile) : null), [sourceFile]);
  const vttBlob = useMemo(() => new Blob([toWebVTT(subtitleSegments || [])], { type: "text/vtt" }), [subtitleSegments]);
  const vttUrl = useMemo(() => URL.createObjectURL(vttBlob), [vttBlob]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
      if (vttUrl) URL.revokeObjectURL(vttUrl);
    };
  }, [url, vttUrl]);

  if (!sourceFile || !versions?.length) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {versions.map((v, i) => (
        <VersionCard key={i} url={url} vttUrl={vttUrl} version={v} />
      ))}
    </div>
  );
}

function VersionCard({ url, vttUrl, version }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handler = () => {
      if (version.timeline?.length) {
        const first = version.timeline[0];
        el.currentTime = first.start;
      }
    };
    el.addEventListener("loadedmetadata", handler);
    return () => el.removeEventListener("loadedmetadata", handler);
  }, [version]);

  const aspectClass = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
  }[version.aspect] || "aspect-video";

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm">
      <div className={`relative ${aspectClass} overflow-hidden rounded-lg bg-black`}>
        <video ref={videoRef} className="h-full w-full object-cover" src={url} controls>
          <track default kind="subtitles" src={vttUrl} srcLang="it" label="Sottotitoli" />
        </video>
        {version.badge ? (
          <div className="pointer-events-none absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium text-slate-800 shadow">
            {version.badge}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{version.title}</div>
          <div className="text-xs text-slate-600">
            {version.aspect} • {version.targetDuration}m • effetti: {version.effects.join(", ")}
          </div>
        </div>
        <a
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(version, null, 2)
          )}`}
          download={`${version.slug || "version"}.json`}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
        >
          Scarica piano
        </a>
      </div>
    </div>
  );
}
