import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function Examples() {
  return (
    <section id="examples" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">See It In Action</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how AI Caption Studio transforms simple descriptions into engaging, platform-ready captions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card className="border-accent/20 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Input Description</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      "A cozy coffee shop corner with vintage books, warm lighting, and steam rising from a ceramic mug"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-secondary/5 to-accent/5 border-secondary/20">
              <CardContent className="p-6">
                <h4 className="font-semibold text-primary mb-4 flex items-center">
                  <Sparkles className="text-secondary mr-2" size={20} />
                  AI-Generated Results
                </h4>
                <div className="space-y-4">
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-2">WITTY TONE</div>
                      <p className="text-sm text-foreground">
                        "Current mood: Caffeinated intellectual with a side of cozy vibes ☕📚"
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-2">POETIC TONE</div>
                      <p className="text-sm text-foreground">
                        "Where stories brew alongside coffee, and every page turns with the whisper of steam"
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Cozy coffee shop corner with vintage books and warm lighting" 
              className="rounded-2xl shadow-xl w-full h-auto animate-float" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Additional Examples */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <h4 className="font-semibold text-primary mb-3">Travel Photography</h4>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">INPUT</div>
                <p className="text-sm text-foreground mb-4">
                  "Mountain landscape at sunrise with fog in the valley"
                </p>
                <div className="text-xs text-muted-foreground">WITTY OUTPUT</div>
                <p className="text-sm text-accent">
                  "When Mother Nature hits the snooze button and creates this magical haze ⛰️✨"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <h4 className="font-semibold text-primary mb-3">Food Photography</h4>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">INPUT</div>
                <p className="text-sm text-foreground mb-4">
                  "Gourmet pasta dish with fresh basil and parmesan"
                </p>
                <div className="text-xs text-muted-foreground">PROFESSIONAL OUTPUT</div>
                <p className="text-sm text-secondary">
                  "Artisanal craftsmanship meets culinary excellence in every perfectly twirled bite"
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <h4 className="font-semibold text-primary mb-3">Lifestyle Content</h4>
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">INPUT</div>
                <p className="text-sm text-foreground mb-4">
                  "Person reading in a hammock on a sunny afternoon"
                </p>
                <div className="text-xs text-muted-foreground">POETIC OUTPUT</div>
                <p className="text-sm text-purple-600">
                  "Suspended between earth and dreams, where golden hours unfold through pages of possibility"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
