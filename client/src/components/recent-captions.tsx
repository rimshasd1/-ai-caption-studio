import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, Feather, Briefcase, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const toneIcons = {
  witty: Sparkles,
  poetic: Feather,
  professional: Briefcase,
  casual: MessageCircle,
};

const toneColors = {
  witty: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  poetic: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  professional: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  casual: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
};

export default function RecentCaptions() {
  const { toast } = useToast();

  const { data: captions, isLoading } = useQuery({
    queryKey: ['/api/captions'],
    enabled: true,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-primary mb-6 text-center">Recent Captions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const captionData = captions?.data || [];
  if (captionData.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-primary mb-6 text-center">Recent Captions</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {captionData.slice(0, 4).map((caption: any) => (
            <Card key={caption.id} className="card-hover group">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Original description:</p>
                  <p className="text-foreground font-medium">{caption.description}</p>
                </div>
                
                <div className="space-y-4">
                  {caption.results.map((result: any, idx: number) => {
                    const IconComponent = toneIcons[result.tone as keyof typeof toneIcons] || Sparkles;
                    
                    return (
                      <div key={idx} className="border border-border rounded-lg p-4 bg-card/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center",
                              toneColors[result.tone as keyof typeof toneColors] || "bg-gray-100 text-gray-600"
                            )}>
                              <IconComponent size={14} />
                            </div>
                            <span className="text-sm font-semibold text-primary capitalize">{result.tone}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result.text)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-foreground leading-relaxed mb-2">{result.text}</p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{result.characterCount} characters</span>
                          {result.suggestedHashtags && result.suggestedHashtags.length > 0 && (
                            <span className="flex items-center space-x-1">
                              <span>#</span>
                              <span>{result.suggestedHashtags.length} hashtags</span>
                            </span>
                          )}
                        </div>
                        
                        {result.suggestedHashtags && result.suggestedHashtags.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <div className="flex flex-wrap gap-1">
                              {result.suggestedHashtags.slice(0, 3).map((hashtag: string, hashIdx: number) => (
                                <span key={hashIdx} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                  #{hashtag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}