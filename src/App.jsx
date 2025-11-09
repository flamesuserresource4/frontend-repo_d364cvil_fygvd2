import { useMemo, useState } from "react";
import Uploader from "./components/Uploader";
import MainEditor from "./components/MainEditor";
import RealHighlightsExtractor from "./components/RealHighlightsExtractor";
import CoverGenerator from "./components/CoverGenerator";
import HeaderBar from "./components/HeaderBar";
import HeroBanner from "./components/HeroBanner";
import SidebarInfo from "./components/SidebarInfo";
import SiteFooter from "./components/SiteFooter";

function App() {
  const [files, setFiles] = useState([]);

  const handleAddFiles = (incoming) => {
    const map = new Map();
    [...files, ...incoming].forEach((f) => map.set(`${f.name}-${f.size}`, f));
    setFiles(Array.from(map.values()));
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => setFiles([]);

  const videoCount = useMemo(
    () => files.filter((f) => f.type.startsWith("video")).length,
    [files]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <HeaderBar />
      <HeroBanner />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Uploader
              files={files}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClear={handleClear}
            />
            <MainEditor files={files} />
            <RealHighlightsExtractor />
            <CoverGenerator />
          </div>
          <SidebarInfo files={files} videoCount={videoCount} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
