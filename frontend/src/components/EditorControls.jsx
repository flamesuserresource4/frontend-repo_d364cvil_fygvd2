import React, { useState } from 'react';

export default function EditorControls() {
  const [duration, setDuration] = useState(10);
  const [ratio, setRatio] = useState('16:9');
  const [preset, setPreset] = useState('generico');
  const [censor, setCensor] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-lg font-semibold">Impostazioni montaggio</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm text-white/80">Durata target (min)</span>
          <input
            type="number"
            min={5}
            max={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-white/80">Formato</span>
          <select
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-white/80">Preset gaming</span>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="generico">Generico</option>
            <option value="brawl-stars">Brawl Stars</option>
            <option value="clash-royale">Clash Royale</option>
            <option value="fps">FPS</option>
            <option value="moba">MOBA</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={censor} onChange={(e) => setCensor(e.target.checked)} />
          <span className="text-sm text-white/80">Censura automatica</span>
        </label>
      </div>
    </div>
  );
}
