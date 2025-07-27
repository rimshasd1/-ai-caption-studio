import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateCaptionRequestSchema, type GenerateCaptionRequest, type CaptionResult } from "@shared/schema";
import { Sparkles, Upload, Copy, Download, RotateCcw, Smile, Feather, Briefcase, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const toneOptions = [
  { id: "witty", label: "Witty", icon: Smile, color: "yellow" },
  { id: "poetic", label: "Poetic", icon: Feather, color: "purple" },
  { id: "professional", label: "Professional", icon: Briefcase, color: "blue" },
  { id: "casual", label: "Casual", icon: MessageCircle, color: "green" },
];

const toneColors = {
  witty: "bg-yellow-100 text-yellow-600",
  poetic: "bg-purple-100 text-purple-600",
  professional: "bg-blue-100 text-blue-600",
  casual: "bg-green-100 text-green-600",
};

export default function CaptionGenerator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<CaptionResult[]>([]);
  const { toast } = useToast();

  const form = useForm<GenerateCaptionRequest>({
    resolver: zodResolver(generateCaptionRequestSchema),
    defaultValues: {
      description: "",
      tones: ["witty", "poetic", "professional"],
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateCaptionRequest & { file?: File }) => {
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('tones', JSON.stringify(data.tones));
      
      if (data.file) {
        formData.append('image', data.file);
      }

      const response = await fetch('/api/captions/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate captions');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.data.results);
      toast({
        title: "Captions Generated!",
        description: `Generated ${data.data.results.length} caption variations.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GenerateCaptionRequest) => {
    generateMutation.mutate({ ...data, file: selectedFile || undefined });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "Image uploaded",
        description: `${file.name} ready for processing.`,
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Caption copied successfully!",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exportCaptions = () => {
    const content = results.map(result => 
      `${result.tone.toUpperCase()}:\n${result.text}\n\nHashtags: ${result.suggestedHashtags?.join(' ') || 'None'}\n\n`
    ).join('---\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-captions.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Captions exported",
      description: "All captions saved to file.",
    });
  };

  return (
    <section id="generator" className="py-16 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-border overflow-hidden">
          {/* Form Section */}
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">Create Your Caption</h2>
              <p className="text-muted-foreground">Describe your image or upload a photo to get started</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Description Input */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-primary">
                  Describe your image or scene
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  className="focus-ring resize-none"
                  placeholder="A sunset over the mountains with a person silhouetted against the golden sky, feeling peaceful and contemplative..."
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-primary">
                  Or upload an image (optional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-secondary transition-all duration-300 cursor-pointer group">
                  <input
                    type="file"
                    className="hidden"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <div className="icon-container bg-muted group-hover:bg-secondary/10 mx-auto mb-4 transition-colors">
                      <Upload className="text-muted-foreground group-hover:text-secondary transition-colors" size={24} />
                    </div>
                    <p className="text-foreground font-medium mb-1">
                      {selectedFile ? selectedFile.name : "Click to upload an image"}
                    </p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              </div>

              {/* Tone Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-primary">
                  Select caption tones (choose 1-3)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {toneOptions.map((tone) => {
                    const IconComponent = tone.icon;
                    return (
                      <div key={tone.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tone.id}
                          checked={form.watch("tones").includes(tone.id)}
                          onCheckedChange={(checked) => {
                            const currentTones = form.getValues("tones");
                            if (checked) {
                              if (currentTones.length < 3) {
                                form.setValue("tones", [...currentTones, tone.id]);
                              }
                            } else {
                              form.setValue("tones", currentTones.filter(t => t !== tone.id));
                            }
                          }}
                        />
                        <Label htmlFor={tone.id} className="flex items-center space-x-1 cursor-pointer">
                          <IconComponent size={16} />
                          <span className="text-sm font-medium">{tone.label}</span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
                {form.formState.errors.tones && (
                  <p className="text-sm text-destructive">{form.formState.errors.tones.message}</p>
                )}
              </div>

              {/* Generate Button */}
              <Button
                type="submit"
                disabled={generateMutation.isPending}
                className="w-full btn-gradient py-4 text-lg"
              >
                {generateMutation.isPending ? (
                  <div className="loading-dots mr-2">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <Sparkles className="mr-2" size={20} />
                )}
                {generateMutation.isPending ? "Generating..." : "Generate Captions"}
              </Button>
            </form>
          </CardContent>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="bg-muted/50 p-8 md:p-12 border-t border-border">
              <h3 className="text-2xl font-bold text-primary mb-6 text-center">Your Generated Captions</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                {results.map((result, index) => {
                  const toneOption = toneOptions.find(t => t.id === result.tone);
                  const IconComponent = toneOption?.icon || Sparkles;
                  
                  return (
                    <div key={index} className="caption-card group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            toneColors[result.tone as keyof typeof toneColors] || "bg-gray-100 text-gray-600"
                          )}>
                            <IconComponent size={16} />
                          </div>
                          <span className="font-semibold text-primary capitalize">{result.tone}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(result.text)}
                          className="copy-button"
                          title="Copy to clipboard"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                      <p className="text-foreground leading-relaxed mb-4">{result.text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{result.characterCount} characters</span>
                        <span className="flex items-center space-x-1">
                          <span>#</span>
                          <span>{result.suggestedHashtags?.length || 0} hashtags suggested</span>
                        </span>
                      </div>
                      {result.suggestedHashtags && result.suggestedHashtags.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Suggested hashtags:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.suggestedHashtags.map((hashtag, idx) => (
                              <span key={idx} className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <Button
                  onClick={exportCaptions}
                  variant="outline"
                  className="font-medium"
                >
                  <Download className="mr-2" size={16} />
                  Export All Captions
                </Button>
                <Button
                  onClick={() => {
                    setResults([]);
                    form.reset();
                    setSelectedFile(null);
                  }}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium"
                >
                  <RotateCcw className="mr-2" size={16} />
                  Generate New Variations
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
