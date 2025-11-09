import { useMemo, useState } from "react";
import Uploader from "./Uploader";
import MainEditor from "./MainEditor";
import RealHighlightsExtractor from "./RealHighlightsExtractor";
import CoverGenerator from "./CoverGenerator";
import SidebarInfo from "./SidebarInfo";

function MainWorkspace() {
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
    <section className="mx-auto max-w-7xl px-6 py-8">
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
    </section>
  );
}

export default MainWorkspace;
