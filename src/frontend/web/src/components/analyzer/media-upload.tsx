'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Hash, 
  AtSign, 
  Smile, 
  Zap, 
  Wand2, 
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  Trash2
} from 'lucide-react';
import { Platform } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  platform: Platform;
  className?: string;
  showAdvancedControls?: boolean;
  onAnalyze?: () => void;
  isLoading?: boolean;
}

export function TextInput({
  value,
  onChange,
  placeholder = 'Enter your post content...',
  maxLength = 2000,
  platform,
  className,
  showAdvancedControls = true,
  onAnalyze,
  isLoading = false,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [detectedHashtags, setDetectedHashtags] = useState<string[]>([]);
  const [detectedMentions, setDetectedMentions] = useState<string[]>([]);

  useEffect(() => {
    const count = value.length;
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    setCharacterCount(count);
    setWordCount(words);
    
    // Extract hashtags and mentions
    const hashtags = value.match(/#[\w\u0600-\u06FF]+/g) || [];
    const mentions = value.match(/@[\w\.]+/g) || [];
    
    setDetectedHashtags([...new Set(hashtags)].slice(0, 10));
    setDetectedMentions([...new Set(mentions)].slice(0, 10));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;
    onChange(newValue);
  };

  const insertAtCursor = (text: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = value.substring(0, start) + text + value.substring(end);
    
    onChange(newText);
    
    // Focus back and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + text.length, start + text.length);
      }
    }, 0);
  };

  const addHashtag = (hashtag: string = '') => {
    const tag = hashtag.trim() || 'trending';
    insertAtCursor(` #${tag}`);
  };

  const addMention = (mention: string = '') => {
    const user = mention.trim() || 'username';
    insertAtCursor(` @${user}`);
  };

  const addEmoji = (emoji: string = '😊') => {
    insertAtCursor(` ${emoji}`);
  };

  const clearText = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getOptimalLength = () => {
    const optimalLengths: Record<Platform, { min: number; max: number }> = {
      instagram: { min: 138, max: 150 },
      twitter: { min: 71, max: 100 },
      facebook: { min: 40, max: 80 },
      tiktok: { min: 100, max: 150 },
      youtube: { min: 0, max: 5000 },
      linkedin: { min: 25, max: 150 },
    };
    
    return optimalLengths[platform] || { min: 0, max: 500 };
  };

  const getLengthStatus = () => {
    const optimal = getOptimalLength();
    const percentage = (characterCount / optimal.max) * 100;
    
    if (characterCount === 0) return { status: 'empty', color: 'text-gray-400' };
    if (characterCount < optimal.min) return { status: 'too-short', color: 'text-amber-500' };
    if (characterCount > optimal.max) return { status: 'too-long', color: 'text-red-500' };
    if (percentage > 80) return { status: 'optimal', color: 'text-green-500' };
    return { status: 'good', color: 'text-blue-500' };
  };

  const lengthStatus = getLengthStatus();

  const emojiSuggestions = ['😊', '🔥', '🎉', '💯', '👏', '🙌', '✨', '💪', '🤩', '📈'];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Text Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'min-h-[200px] resize-y font-sans text-base leading-relaxed',
            'focus-visible:ring-2 focus-visible:ring-primary',
            isFocused && 'border-primary',
            lengthStatus.color === 'text-red-500' && 'border-red-300'
          )}
          rows={8}
        />
        
        {/* Character Counter */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <AnimatePresence>
            {lengthStatus.status === 'too-long' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text is too long for optimal engagement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </AnimatePresence>
          
          <span className={cn('text-sm font-medium', lengthStatus.color)}>
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Words:</span>
            <span className="font-medium">{wordCount}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Reading time:</span>
            <span className="font-medium">{Math.ceil(wordCount / 200)} min</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            disabled={!value.trim()}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearText}
            disabled={!value.trim()}
            className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {showPreview && value.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Preview</h4>
                  <Badge variant="outline" className="capitalize">
                    {platform}
                  </Badge>
                </div>
                <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                  {value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Bar */}
      {showAdvancedControls && (
        <Card>
          <CardContent className="p-3">
            <div className="space-y-3">
              {/* Emoji Suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Quick Emojis</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {emojiSuggestions.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => insertAtCursor(' 😂')}
                        >
                          <Wand2 className="h-3 w-3" />
                          More
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open emoji picker</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Detected Elements */}
              {(detectedHashtags.length > 0 || detectedMentions.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {detectedHashtags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Hashtags</span>
                        <Badge variant="secondary" className="text-xs">
                          {detectedHashtags.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {detectedHashtags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => insertAtCursor(` ${tag}`)}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {detectedMentions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AtSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Mentions</span>
                        <Badge variant="secondary" className="text-xs">
                          {detectedMentions.length}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {detectedMentions.map((mention, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => insertAtCursor(` ${mention}`)}
                          >
                            {mention}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addHashtag()}
                  className="gap-2"
                >
                  <Hash className="h-3 w-3" />
                  Add Hashtag
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addMention()}
                  className="gap-2"
                >
                  <AtSign className="h-3 w-3" />
                  Add Mention
                </Button>
                
                {onAnalyze && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={onAnalyze}
                    disabled={!value.trim() || isLoading}
                    className="gap-2 ml-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3" />
                        Quick Analyze
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform-Specific Guidance */}
      <AnimatePresence>
        {characterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Card className={cn(
              'border-l-4',
              lengthStatus.color === 'text-green-500' && 'border-l-green-500 bg-green-50',
              lengthStatus.color === 'text-amber-500' && 'border-l-amber-500 bg-amber-50',
              lengthStatus.color === 'text-red-500' && 'border-l-red-500 bg-red-50',
            )}>
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  {lengthStatus.status === 'too-long' ? (
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  ) : lengthStatus.status === 'too-short' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  ) : (
                    <Zap className="h-4 w-4 text-green-500 mt-0.5" />
                  )}
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">
                      {lengthStatus.status === 'too-long' && 'Text is too long'}
                      {lengthStatus.status === 'too-short' && 'Consider adding more content'}
                      {lengthStatus.status === 'good' && 'Good length'}
                      {lengthStatus.status === 'optimal' && 'Optimal length'}
                    </p>
                    <p className="text-muted-foreground">
                      {getPlatformSpecificAdvice(platform, characterCount, wordCount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getPlatformSpecificAdvice(platform: Platform, chars: number, words: number): string {
  const advice: Record<Platform, string[]> = {
    instagram: [
      'Instagram captions perform best between 138-150 characters',
      'Include 5-10 relevant hashtags',
      'Ask questions to boost engagement',
      'Use line breaks for readability',
    ],
    twitter: [
      'Tweets under 100 characters get 17% more engagement',
      'Use 1-2 hashtags maximum',
      'Include visuals when possible',
      'Engage with replies quickly',
    ],
    facebook: [
      '40-80 characters for optimal engagement',
      'Post when your audience is most active',
      'Use Facebook-native video when possible',
      'Tag relevant pages and people',
    ],
    tiktok: [
      'Descriptions under 100 characters perform best',
      'Use 3-5 trending hashtags',
      'Include a clear call-to-action',
      'Post during peak hours (6-10 PM)',
    ],
    youtube: [
      'Descriptions should be detailed for SEO',
      'Include timestamps for longer videos',
      'Use keywords in first 3 lines',
      'Add relevant links and resources',
    ],
    linkedin: [
      'Posts between 25-150 characters perform best',
      'Use professional language',
      'Include relevant industry hashtags',
      'Engage with comments professionally',
    ],
  };

  const platformAdvice = advice[platform] || advice.instagram;
  
  if (chars === 0) return platformAdvice[0];
  
  // Return advice based on character count
  if (chars < 50) return platformAdvice[0];
  if (chars < 100) return platformAdvice[1];
  if (chars < 200) return platformAdvice[2];
  return platformAdvice[3];
}