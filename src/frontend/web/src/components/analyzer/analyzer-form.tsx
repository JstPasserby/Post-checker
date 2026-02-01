'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformSelector } from './platform-selector';
import { TextInput } from './text-input';
import { MediaUpload } from './media-upload';
import { useAnalyzer } from '@/hooks/useAnalyzer';
import { AnalysisResult, Platform } from '@/lib/types';
import { PLATFORMS } from '@/lib/constants';
import { AlertCircle, Sparkles, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const analysisSchema = z.object({
  text: z.string().max(2000, 'Text must be less than 2000 characters').optional(),
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin']),
  image: z.instanceof(File).optional(),
  schedule: z.object({
    enabled: z.boolean().default(false),
    time: z.string().optional(),
  }).optional(),
});

type AnalysisFormData = z.infer<typeof analysisSchema>;

interface AnalyzerFormProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  initialPlatform?: Platform;
}

export function AnalyzerForm({ onAnalysisComplete, initialPlatform = 'instagram' }: AnalyzerFormProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  
  const { analyze, isAnalyzing, error } = useAnalyzer();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      platform: initialPlatform,
      text: '',
    },
  });

  const selectedPlatform = watch('platform');
  const textContent = watch('text');

  const handleImageUpload = (file: File) => {
    setValue('image', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: AnalysisFormData) => {
    try {
      const formData = new FormData();
      formData.append('platform', data.platform);
      
      if (data.text) {
        formData.append('text', data.text);
      }
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const result = await analyze(formData);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleQuickAnalyze = () => {
    if (!textContent?.trim()) return;
    
    handleSubmit(onSubmit)();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Pre-Post Analyzer
        </CardTitle>
        <CardDescription>
          Check your content before posting to avoid violations and maximize reach
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Platform</label>
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              onPlatformChange={(platform) => setValue('platform', platform)}
              availablePlatforms={PLATFORMS}
            />
          </div>

          {/* Content Type Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <span>📝</span> Text
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <span>🖼️</span> Image
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <span>🎥</span> Video
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <TextInput
                value={textContent || ''}
                onChange={(value) => setValue('text', value)}
                placeholder={`What would you like to post on ${selectedPlatform}?`}
                maxLength={2000}
                platform={selectedPlatform}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {textContent?.length || 0} / 2000 characters
                </div>
                <Button
                  type="button"
                  onClick={handleQuickAnalyze}
                  disabled={!textContent?.trim() || isAnalyzing}
                  loading={isAnalyzing}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Quick Analyze
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4">
              <MediaUpload
                type="image"
                onFileSelect={handleImageUpload}
                preview={imagePreview}
                accept="image/*"
                maxSizeMB={5}
              />
              
              <TextInput
                value={textContent || ''}
                onChange={(value) => setValue('text', value)}
                placeholder="Add caption..."
                maxLength={2200}
                platform={selectedPlatform}
              />
            </TabsContent>
            
            <TabsContent value="video" className="space-y-4">
              <MediaUpload
                type="video"
                onFileSelect={handleVideoUpload}
                preview={videoPreview}
                accept="video/*"
                maxSizeMB={50}
              />
              
              <TextInput
                value={textContent || ''}
                onChange={(value) => setValue('text', value)}
                placeholder="Add description..."
                maxLength={5000}
                platform={selectedPlatform}
              />
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'Analysis failed. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <p className="font-medium mb-1">⚠️ Important Disclaimer:</p>
            <p>
              This tool provides predictions based on AI analysis and may not reflect actual platform moderation decisions.
              Always review platform guidelines before posting. We are not responsible for account actions taken by platforms.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              size="lg"
              loading={isAnalyzing}
              disabled={isAnalyzing || (!textContent?.trim() && !imagePreview && !videoPreview)}
              className="flex-1 gap-2"
            >
              <Upload className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}