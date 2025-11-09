import React, { useState } from 'react';
import Hero from './components/Hero.jsx';
import Uploader from './components/Uploader.jsx';
import EditorControls from './components/EditorControls.jsx';
import PreviewPicker from './components/PreviewPicker.jsx';
import AIChat from './components/AIChat.jsx';
import HighlightsExtractor from './components/HighlightsExtractor.jsx';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedPreview, setSelectedPreview] = useState(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Hero />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Uploader files={files} setFiles={setFiles} />
            <EditorControls />
            <PreviewPicker files={files} selected={selectedPreview} onSelect={setSelectedPreview} />
          </div>
          <div className="space-y-6">
            <AIChat />
            <HighlightsExtractor />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
