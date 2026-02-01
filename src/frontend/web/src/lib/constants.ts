import { RiskLevel } from './types';

export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
  { id: 'youtube', name: 'YouTube', icon: '📺', color: '#FF0000' },
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: '👤', color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
] as const;

export const VIOLATION_TYPES: Record<string, { 
  label: string; 
  description: string; 
  color: string;
  icon: string;
}> = {
  hate_speech: {
    label: 'Hate Speech',
    description: 'Content that attacks people based on protected characteristics',
    color: '#DC2626',
    icon: '🚫',
  },
  bullying: {
    label: 'Bullying',
    description: 'Targeted harassment or intimidation',
    color: '#EA580C',
    icon: '👊',
  },
  sexual_content: {
    label: 'Sexual Content',
    description: 'Nudity or sexually suggestive material',
    color: '#7C3AED',
    icon: '🔞',
  },
  violence: {
    label: 'Violence',
    description: 'Graphic violence or threats',
    color: '#991B1B',
    icon: '🔪',
  },
  // ... more violation types
};

export const RISK_LEVELS: Record<RiskLevel, {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  emoji: string;
}> = {
  low: {
    label: 'Low Risk',
    color: '#10b981',
    bgColor: 'bg-risk-low/10',
    description: 'Likely safe to post',
    emoji: '✅',
  },
  medium: {
    label: 'Medium Risk',
    color: '#f59e0b',
    bgColor: 'bg-risk-medium/10',
    description: 'Might get limited reach',
    emoji: '⚠️',
  },
  high: {
    label: 'High Risk',
    color: '#ef4444',
    bgColor: 'bg-risk-high/10',
    description: 'Likely to be removed',
    emoji: '🚨',
  },
  critical: {
    label: 'Critical',
    color: '#7c2d12',
    bgColor: 'bg-risk-critical/10',
    description: 'Will be removed, account risk',
    emoji: '⛔',
  },
};

export const FREE_TIER_LIMITS = {
  daily_checks: 5,
  max_text_length: 500,
  platforms: ['instagram', 'tiktok'],
  no_image_analysis: true,
  basic_suggestions: true,
} as const;

export const API_ENDPOINTS = {
  analyze: '/api/analyze',
  feedback: '/api/feedback',
  history: '/api/history',
  rules: '/api/rules',
  user: '/api/user',
} as const;