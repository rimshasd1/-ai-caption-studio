import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
              <Camera className="text-white text-sm" size={16} />
            </div>
            <span className="text-xl font-bold text-primary">AI Caption Studio</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('generator')}
              className="text-foreground hover:text-secondary transition-colors font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('generator')}
              className="text-foreground hover:text-secondary transition-colors font-medium"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('examples')}
              className="text-foreground hover:text-secondary transition-colors font-medium"
            >
              Examples
            </button>
            <Button 
              onClick={() => scrollToSection('generator')}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium shadow-sm hover:shadow-md transition-all duration-300"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}>
          <div className="flex flex-col space-y-4 py-4">
            <button 
              onClick={() => scrollToSection('generator')}
              className="text-foreground hover:text-secondary transition-colors font-medium text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('generator')}
              className="text-foreground hover:text-secondary transition-colors font-medium text-left"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('examples')}
              className="text-foreground hover:text-secondary transition-colors font-medium text-left"
            >
              Examples
            </button>
            <Button 
              onClick={() => scrollToSection('generator')}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium w-full"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
