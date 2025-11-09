import React, { useMemo } from 'react';

export default function PreviewPicker({ files, selected, onSelect }) {
  const previews = useMemo(() => {
    if (!files || files.length === 0) return [];
    return files.slice(0, 6).map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
  }, [files]);

  if (previews.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-2 text-lg font-semibold">Anteprime</h2>
        <p className="text-sm text-white/70">Carica dei file per generare anteprime.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-lg font-semibold">Anteprime</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {previews.map((p, idx) => (
          <button
            key={p.name + idx}
            onClick={() => onSelect(p.url)}
            className={`group relative overflow-hidden rounded-lg border ${selected === p.url ? 'border-indigo-400' : 'border-white/10'} bg-black/40`}
          >
            <video src={p.url} className="h-28 w-full object-cover" muted />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 text-left text-xs">
              <span className="line-clamp-1 opacity-80 group-hover:opacity-100">{p.name}</span>
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm text-white/80">Selezionato</h3>
          <video src={selected} controls className="w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
