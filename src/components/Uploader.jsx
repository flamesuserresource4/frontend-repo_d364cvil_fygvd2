import { useRef } from "react";
import { Upload, Film, Image as ImageIcon } from "lucide-react";

export default function Uploader({ files, onAddFiles, onRemoveFile, onClear }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files || []);
    if (dropped.length) onAddFiles(dropped);
  };

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length) onAddFiles(selected);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Upload />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900">
            Carica clip video e immagini
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Trascina qui i tuoi file o scegli dal dispositivo. Puoi caricare più clip e unirle in un unico video.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              <Upload size={18} /> Seleziona file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="video/*,image/*"
              multiple
              onChange={handleSelect}
              className="hidden"
            />
            {files.length > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-800">
                Svuota elenco ({files.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-200">
          {files.map((f, idx) => (
            <li key={idx} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                {f.type.startsWith("video") ? (
                  <Film size={18} className="text-slate-500" />
                ) : (
                  <ImageIcon size={18} className="text-slate-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-800 line-clamp-1">{f.name}</p>
                  <p className="text-xs text-slate-500">{(f.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(idx)}
                className="text-xs text-slate-500 hover:text-red-600">
                Rimuovi
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
