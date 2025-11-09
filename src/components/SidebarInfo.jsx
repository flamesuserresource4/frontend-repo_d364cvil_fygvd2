export default function SidebarInfo({ files, videoCount }) {
  return (
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
  );
}
