import { Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-10">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Montaggio video con AI in un unico flusso</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-700">
              Carica un clip. L’editor applica tagli intelligenti, effetti, sottotitoli per parlato poco chiaro e genera 6 versioni pronte da confrontare.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Automazione assistita da AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
