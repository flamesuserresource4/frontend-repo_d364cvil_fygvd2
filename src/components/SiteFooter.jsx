export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-slate-600">
        <span>© {new Date().getFullYear()} AI Video Studio</span>
        <span>
          Backend su {import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8000`}
        </span>
      </div>
    </footer>
  );
}
