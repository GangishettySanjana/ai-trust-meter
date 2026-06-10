import Hero from "./components/Hero";
import TeardownSection from "./components/TeardownSection";
import IncidentSection from "./components/IncidentSection";
import DesignRequirements from "./components/DesignRequirements";
import SideBySide from "./components/SideBySide";
import DesignSystemDocs from "./components/DesignSystemDocs";
import Playground from "./components/Playground";
import ReflectionSection from "./components/ReflectionSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <div id="teardown">
        <TeardownSection />
      </div>
      <IncidentSection />
      <DesignRequirements />
      <DesignSystemDocs />
      <SideBySide />
      <Playground />
      <ReflectionSection />
      <Footer />
    </main>
  );
}
