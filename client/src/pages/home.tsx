import Header from "@/components/header";
import Hero from "@/components/hero";
import CaptionGenerator from "@/components/caption-generator";
import Examples from "@/components/examples";
import RecentCaptions from "@/components/recent-captions";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <CaptionGenerator />
      <RecentCaptions />
      <Examples />
      <Footer />
    </div>
  );
}
