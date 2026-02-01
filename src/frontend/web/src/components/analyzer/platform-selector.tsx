'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Crown, Lock, Sparkles } from 'lucide-react';
import { Platform } from '@/lib/types';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  availablePlatforms: typeof PLATFORMS;
  isPremium?: boolean;
  className?: string;
}

export function PlatformSelector({
  selectedPlatform,
  onPlatformChange,
  availablePlatforms,
  isPremium = false,
  className,
}: PlatformSelectorProps) {
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  const getPlatformStatus = (platformId: Platform) => {
    const isAvailable = availablePlatforms.some(p => p.id === platformId);
    const isSelected = selectedPlatform === platformId;
    const requiresPremium = ['youtube', 'linkedin'].includes(platformId) && !isPremium;

    return {
      isAvailable,
      isSelected,
      requiresPremium,
      isComingSoon: !isAvailable && !requiresPremium,
    };
  };

  const handlePlatformClick = (platformId: Platform) => {
    const status = getPlatformStatus(platformId);
    
    if (!status.isAvailable || status.requiresPremium) {
      return;
    }
    
    onPlatformChange(platformId);
  };

  const displayedPlatforms = showAllPlatforms 
    ? availablePlatforms 
    : availablePlatforms.slice(0, 4);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Platform Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {displayedPlatforms.map((platform) => {
          const status = getPlatformStatus(platform.id as Platform);
          
          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: status.isAvailable ? 1.05 : 1 }}
              whileTap={{ scale: status.isAvailable ? 0.95 : 1 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-200 overflow-hidden',
                  'border-2 hover:border-primary/50',
                  status.isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-accent/50',
                  (!status.isAvailable || status.requiresPremium) && 'opacity-60 cursor-not-allowed'
                )}
                onClick={() => handlePlatformClick(platform.id as Platform)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-3">
                  {/* Platform Icon */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <span style={{ color: platform.color }}>{platform.icon}</span>
                  </div>

                  {/* Platform Name */}
                  <div className="text-center">
                    <div className="font-medium text-sm">{platform.name}</div>
                    
                    {/* Status Indicators */}
                    <div className="mt-1 flex items-center justify-center gap-1">
                      {status.isSelected && (
                        <Badge variant="default" className="h-4 px-1 text-[10px]">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                      
                      {status.requiresPremium && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px] bg-amber-50">
                          <Crown className="h-3 w-3 mr-1 text-amber-600" />
                          Premium
                        </Badge>
                      )}
                      
                      {status.isComingSoon && (
                        <Badge variant="outline" className="h-4 px-1 text-[10px]">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {availablePlatforms.length > 4 && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllPlatforms(!showAllPlatforms)}
            className="text-sm"
          >
            {showAllPlatforms ? 'Show Less' : `Show ${availablePlatforms.length - 4} More`}
          </Button>
        </div>
      )}

      {/* Platform-Specific Tips */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <span className="text-xl">{PLATFORMS.find(p => p.id === selectedPlatform)?.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Tips
                  </h4>
                  <PlatformTips platform={selectedPlatform} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PlatformTips({ platform }: { platform: Platform }) {
  const tips: Record<Platform, { do: string[]; dont: string[] }> = {
    instagram: {
      do: [
        'Use relevant hashtags (5-10 recommended)',
        'Engage with your audience in comments',
        'Post high-quality images/videos',
      ],
      dont: [
        'Use banned hashtags',
        'Post repetitive comments',
        'Engage in follow/unfollow patterns',
      ],
    },
    tiktok: {
      do: [
        'Use trending sounds',
        'Keep videos under 60 seconds',
        'Add captions for accessibility',
      ],
      dont: [
        'Use copyrighted music without license',
        'Post dangerous challenges',
        'Spam comments',
      ],
    },
    youtube: {
      do: [
        'Add timestamps in description',
        'Use custom thumbnails',
        'Engage with comments in first 24h',
      ],
      dont: [
        'Use misleading thumbnails/titles',
        'Post excessively long intros',
        'Include unlicensed content',
      ],
    },
    twitter: {
      do: [
        'Use relevant hashtags',
        'Thread longer thoughts',
        'Engage with trending topics',
      ],
      dont: [
        'Tweet duplicate content',
        'Engage in harassment',
        'Share unverified information',
      ],
    },
    facebook: {
      do: [
        'Post in relevant groups',
        'Use Facebook Stories',
        'Engage with community',
      ],
      dont: [
        'Post clickbait content',
        'Share false information',
        'Spam friend requests',
      ],
    },
    linkedin: {
      do: [
        'Share professional insights',
        'Connect with industry peers',
        'Engage with company pages',
      ],
      dont: [
        'Post overly personal content',
        'Spam connection requests',
        'Share confidential information',
      ],
    },
  };

  const platformTips = tips[platform] || tips.instagram;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="font-medium text-green-600 mb-1">✅ Do</div>
        <ul className="space-y-1">
          {platformTips.do.map((tip, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-medium text-red-600 mb-1">❌ Don't</div>
        <ul className="space-y-1">
          {platformTips.dont.map((tip, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}