import HeaderBar from "./components/HeaderBar";
import HeroBanner from "./components/HeroBanner";
import MainWorkspace from "./components/MainWorkspace";
import SiteFooter from "./components/SiteFooter";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <HeaderBar />
      <HeroBanner />
      <MainWorkspace />
      <SiteFooter />
    </div>
  );
}

export default App;
