import { Video, Sparkles, Github } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <Video className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold">AI Video Studio</span>
            <span className="text-xs text-slate-600">Tagli, effetti, sottotitoli, 6 versioni</span>
          </div>
        </div>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Github className="h-4 w-4" />
          Star
        </a>
      </div>
    </header>
  );
}
