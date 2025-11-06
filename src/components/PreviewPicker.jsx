import { useEffect, useState } from "react";
import { Play, RefreshCw } from "lucide-react";

export default function PreviewPicker({ previews, onRestart, onSelect }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(null);
  }, [previews]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Scegli una delle 6 anteprime</h3>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-800">
          <RefreshCw size={16} /> Ricomincia
        </button>
      </div>
      {previews.length === 0 ? (
        <p className="text-sm text-slate-600">Genera per vedere le anteprime.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((src, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelected(idx);
                onSelect?.(idx);
              }}
              className={`group relative aspect-video overflow-hidden rounded-xl border ${
                selected === idx ? "border-blue-600" : "border-slate-200"
              } bg-black`}
            >
              <video src={src} className="h-full w-full object-cover opacity-90 group-hover:opacity-100" muted />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play size={14} /> Anteprima
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
