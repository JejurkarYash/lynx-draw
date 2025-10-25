/* filepath: e:\projects\NextJs-Projects\lynx-draw\apps\lynxdraw-frontend\app\page.tsx */
import NavBar from "./(landing)/components/NavBar";
import Hero from "./(landing)/components/Hero";
import Features from "./(landing)/components/Features";
import Benefits from "./(landing)/components/Benefits";
import HowItWorks from "./(landing)/components/HowItWorks";
import Cta from "./(landing)/components/cta";
import Footer from "./(landing)/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="cta">
        <Cta />
      </div>
      <Footer />
    </div>
  );
}