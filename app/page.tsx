import Hero from "./components/Hero";
import SideBySide from "./components/SideBySide";
import Playground from "./components/Playground";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <SideBySide />
      <Playground />
      <Footer />
    </main>
  );
}
