import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

export default function Uploader({ files, setFiles }) {
  const inputRef = useRef(null);

  const onDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    addFiles(dropped);
  };

  const addFiles = (newFiles) => {
    const deduped = [...files];
    newFiles.forEach((f) => {
      const exists = deduped.some((d) => d.name === f.name && d.size === f.size);
      if (!exists) deduped.push(f);
    });
    setFiles(deduped);
  };

  const removeFile = (idx) => {
    const copy = [...files];
    copy.splice(idx, 1);
    setFiles(copy);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-lg font-semibold">Carica clip</h2>
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-black/20 p-8 text-white/70"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mb-2" />
        <p>Trascina qui i file o clicca per selezionare</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files || []))}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
              <span className="truncate">
                {f.name} <span className="text-white/50">({Math.round(f.size / 1024)} KB)</span>
              </span>
              <button
                className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
                onClick={() => removeFile(idx)}
                aria-label="Rimuovi"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
