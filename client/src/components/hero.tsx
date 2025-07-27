import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Zap } from "lucide-react";

export default function Hero() {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
          Generate Smart, Stylish<br />
          <span className="text-gradient">Captions Instantly</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Transform your creative vision into captivating captions. Our AI understands context, tone, and style to craft the perfect words for your visual stories.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border card-hover">
            <div className="icon-container bg-secondary/10 mx-auto mb-4">
              <Sparkles className="text-secondary" size={24} />
            </div>
            <h3 className="font-semibold text-primary mb-2">AI-Powered</h3>
            <p className="text-muted-foreground text-sm">Advanced algorithms analyze your content to generate contextually relevant captions</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border card-hover">
            <div className="icon-container bg-accent/10 mx-auto mb-4">
              <Palette className="text-accent" size={24} />
            </div>
            <h3 className="font-semibold text-primary mb-2">Multiple Tones</h3>
            <p className="text-muted-foreground text-sm">Choose from witty, poetic, professional, and more to match your brand voice</p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border card-hover">
            <div className="icon-container bg-purple-100 mx-auto mb-4">
              <Zap className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-primary mb-2">Instant Results</h3>
            <p className="text-muted-foreground text-sm">Get multiple caption variations in seconds, ready to copy and use</p>
          </div>
        </div>

        <Button 
          onClick={scrollToGenerator}
          size="lg"
          className="btn-gradient px-8 py-4 text-lg"
        >
          <Sparkles className="mr-2" size={20} />
          Start Creating Captions
        </Button>
      </div>
    </section>
  );
}
