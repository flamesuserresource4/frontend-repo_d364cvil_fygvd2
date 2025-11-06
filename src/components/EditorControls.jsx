import { useState } from "react";
import { Scissors, Settings2, VolumeX, Youtube } from "lucide-react";

export default function EditorControls({ onSubmit }) {
  const [targetLength, setTargetLength] = useState(15);
  const [aspect, setAspect] = useState("16:9");
  const [preset, setPreset] = useState("generico");
  const [censor, setCensor] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ targetLength, aspect, preset, censor });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center gap-3 text-slate-800">
        <Scissors />
        <h3 className="text-lg font-semibold">Impostazioni di montaggio</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-600">Durata finale (minuti)</span>
          <input
            type="number"
            min={5}
            max={30}
            value={targetLength}
            onChange={(e) => setTargetLength(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Formato video</span>
          <select
            value={aspect}
            onChange={(e) => setAspect(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none">
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Preset gioco</span>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none">
            <option value="generico">Generico</option>
            <option value="brawl-stars">Brawl Stars</option>
            <option value="clash-royale">Clash Royale</option>
            <option value="fps">FPS</option>
            <option value="moba">MOBA</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={censor}
            onChange={(e) => setCensor(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700 inline-flex items-center gap-2"><VolumeX size={16}/> Censura linguaggio (YouTube safe)</span>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Settings2 size={18} /> Genera anteprime
        </button>
        <div className="inline-flex items-center gap-2 text-xs text-slate-500">
          <Youtube size={16}/> Output ottimizzato per YouTube
        </div>
      </div>
    </form>
  );
}
