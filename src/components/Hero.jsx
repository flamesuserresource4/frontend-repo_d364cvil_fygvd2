import { Rocket, Shield, Scissors, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <Rocket size={14} />
              AI Video Studio • Gaming Ready
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Carica i tuoi clip. L’AI li monta in un video epico da 15 minuti.
            </h1>
            <p className="mt-4 max-w-xl text-white/70">
              Unisci fino a decine di clip e ottieni un unico video ottimizzato per YouTube.
              Scegli formato, durata, musica, censura automatica e preset per giochi come
              Brawl Stars e Clash Royale.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm text-white/80 sm:max-w-lg">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Clock className="mt-0.5" size={18} />
                <div>
                  <dt className="font-medium">Da 1h a 15min</dt>
                  <dd>Riepilogo smart con highlight automatici.</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Scissors className="mt-0.5" size={18} />
                <div>
                  <dt className="font-medium">Tagli intelligenti</dt>
                  <dd>Ritmo veloce, transizioni e beat-matching.</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Shield className="mt-0.5" size={18} />
                <div>
                  <dt className="font-medium">Censura automatica</dt>
                  <dd>Filtra parolacce e bestemmie per YouTube.</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Rocket className="mt-0.5" size={18} />
                <div>
                  <dt className="font-medium">Prestazioni</dt>
                  <dd>Pipeline ottimizzata e caricamenti paralleli.</dd>
                </div>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-2xl border border-white/10 bg-gradient-to-tr from-fuchsia-600/30 via-blue-600/30 to-teal-500/30 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-white/10 ring-1 ring-white/15" />
                  <p className="text-sm text-white/70">Anteprima creativa</p>
                  <p className="text-xs text-white/50">La scena 3D può essere aggiunta in seguito</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
    </section>
  );
}
