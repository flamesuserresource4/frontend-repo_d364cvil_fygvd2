import { useMemo, useRef, useState } from "react";
import { Download, RefreshCw, Image as ImageIcon } from "lucide-react";

// Utility: seeded PRNG for reproducible variants
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const palettes = [
  ["#0ea5e9", "#22d3ee", "#a78bfa"],
  ["#f97316", "#f43f5e", "#ef4444"],
  ["#22c55e", "#14b8a6", "#06b6d4"],
  ["#e879f9", "#6366f1", "#22d3ee"],
  ["#f59e0b", "#84cc16", "#06b6d4"],
  ["#8b5cf6", "#ec4899", "#ef4444"],
];

const emojis = ["🔥", "🎮", "⚡", "🏆", "💥", "🚀", "🎬", "✨", "🔊", "🎯"];

function drawCover(ctx, w, h, opts) {
  const { title, subtitle, badge, seed } = opts;
  const rnd = mulberry32(seed);
  const palette = palettes[Math.floor(rnd() * palettes.length)];

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, palette[0]);
  grad.addColorStop(0.6, palette[1]);
  grad.addColorStop(1, palette[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Noise overlay
  for (let i = 0; i < 80; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 40 + rnd() * 140;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.02 + rnd() * 0.05})`;
    ctx.fill();
  }

  // Big emoji/shape
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#ffffff";
  const e = emojis[Math.floor(rnd() * emojis.length)];
  ctx.font = `${Math.floor(h * 0.6)}px system-ui, Apple Color Emoji`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(e, w * (0.6 + rnd() * 0.2), h * (0.35 + rnd() * 0.2));
  ctx.restore();

  // Title block
  ctx.fillStyle = "#0b1020";
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  const line1 = title.toUpperCase();
  ctx.font = `900 ${Math.floor(h * 0.14)}px Inter, ui-sans-serif`;
  ctx.fillText(line1, w * 0.08, h * 0.55);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "#0b1020";
  ctx.font = `700 ${Math.floor(h * 0.07)}px Inter, ui-sans-serif`;
  ctx.fillText(subtitle, w * 0.08, h * 0.65);

  // Badge
  const badgeX = w * 0.08;
  const badgeY = h * 0.72;
  const padX = 20;
  const padY = 12;
  ctx.font = `700 ${Math.floor(h * 0.05)}px Inter, ui-sans-serif`;
  const textW = ctx.measureText(badge).width;
  const bw = textW + padX * 2;
  const bh = Math.floor(h * 0.08);
  // rounded rect
  ctx.beginPath();
  const r = 16;
  ctx.moveTo(badgeX + r, badgeY);
  ctx.lineTo(badgeX + bw - r, badgeY);
  ctx.quadraticCurveTo(badgeX + bw, badgeY, badgeX + bw, badgeY + r);
  ctx.lineTo(badgeX + bw, badgeY + bh - r);
  ctx.quadraticCurveTo(badgeX + bw, badgeY + bh, badgeX + bw - r, badgeY + bh);
  ctx.lineTo(badgeX + r, badgeY + bh);
  ctx.quadraticCurveTo(badgeX, badgeY + bh, badgeX, badgeY + bh - r);
  ctx.lineTo(badgeX, badgeY + r);
  ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fill();
  ctx.fillStyle = "#0b1020";
  ctx.fillText(badge, badgeX + padX, badgeY + bh * 0.66);
}

function CoverCard({ seed, title, subtitle, badge, onDownload }) {
  const canvasRef = useRef(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = 960;
    const h = 540; // 16:9
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    drawCover(ctx, w, h, { seed, title, subtitle, badge });
  };

  useMemo(draw, [seed, title, subtitle, badge]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white/60 p-3 shadow-sm">
      <canvas ref={canvasRef} className="mx-auto block rounded-lg" />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <ImageIcon className="h-4 w-4" />
          <span>Variant #{seed % 1000}</span>
        </div>
        <button
          onClick={() => onDownload(canvasRef.current)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" /> Scarica
        </button>
      </div>
    </div>
  );
}

export default function CoverGenerator() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [title, setTitle] = useState("EPIC HIGHLIGHTS");
  const [subtitle, setSubtitle] = useState("TOP PLAYS COMPILATION");
  const [badge, setBadge] = useState("YouTube Safe • 4K");

  const variants = useMemo(() => Array.from({ length: 6 }, (_, i) => seed + i + 1), [seed]);

  const downloadCanvas = (canvas, name = "cover.png") => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const downloadAll = () => {
    // Trigger downloads sequentially
    variants.forEach((v, i) => {
      const id = `cover-canvas-${v}`;
      const canvas = document.getElementById(id);
      if (canvas) downloadCanvas(canvas, `cover_${i + 1}.png`);
    });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Generatore Copertine</h2>
            <p className="text-sm text-slate-600">Scegli tra sei alternative, rigenerale tutte oppure scaricale in PNG.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 1e9))}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" /> Rigenera tutte
            </button>
            <button
              onClick={downloadAll}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> Scarica tutte
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {variants.map((v, idx) => (
            <div key={v}>
              <CoverCard
                seed={v}
                title={title}
                subtitle={subtitle}
                badge={badge}
                onDownload={(canvas) => downloadCanvas(canvas, `cover_${idx + 1}.png`)}
              />
              {/* Assign predictable id for group download */}
              <canvas id={`cover-canvas-${v}`} className="hidden" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Titolo</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Titolo principale"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Sottotitolo</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Sottotitolo"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Badge</label>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              placeholder="Es. YouTube Safe • 4K"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
