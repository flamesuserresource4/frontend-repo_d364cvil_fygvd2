import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4tF2R8eDR5m3u2kE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10 px-6 py-16 md:px-10 lg:px-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-inset ring-white/10">
          <Rocket size={14} />
          <span>AI Video Toolkit</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Monta, analizza e trova i momenti migliori
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
          Carica i tuoi clip o un video già montato. L'AI suggerisce highlights, genera anteprime e ti aiuta a preparare contenuti YouTube/TikTok-safe.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
    </section>
  );
}
