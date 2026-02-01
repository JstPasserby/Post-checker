// Platform types
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ViolationType = 
  | 'hate_speech'
  | 'bullying'
  | 'sexual_content'
  | 'violence'
  | 'harassment'
  | 'scam_fraud'
  | 'regulated_goods'
  | 'copyright'
  | 'privacy_violation'
  | 'spam'
  | 'false_information'
  | 'terrorism'
  | 'self_harm'
  | 'animal_abuse'
  | 'child_safety';

export interface Violation {
  type: ViolationType;
  confidence: number;
  source: 'text' | 'image' | 'video' | 'audio';
  description: string;
  platform_specific_rule?: string;
  suggestion?: string;
  highlighted_text?: string;
  bounding_boxes?: Array<{x: number, y: number, width: number, height: number}>;
}

export interface AnalysisResult {
  id: string;
  risk_score: number;
  risk_level: RiskLevel;
  violations: Violation[];
  warnings: string[];
  suggestions: string[];
  confidence: number;
  platform: Platform;
  analyzed_at: string;
  raw_data?: any;
}

export interface PostContent {
  text?: string;
  image_url?: string;
  image_base64?: string;
  video_url?: string;
  thumbnail_url?: string;
  hashtags?: string[];
  mentions?: string[];
  platform: Platform;
  scheduled_time?: string;
}

export interface UserFeedback {
  analysis_id: string;
  was_posted: boolean;
  actual_outcome?: 'no_issue' | 'reduced_reach' | 'warning' | 'removed' | 'banned';
  platform_action_reason?: string;
  time_to_action?: string;
  user_comments?: string;
  reported_at: string;
}

export interface PlatformRule {
  id: string;
  platform: Platform;
  section: string;
  subsection: string;
  rule_text: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  examples: string[];
  last_updated: string;
  region_specific?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: {
    tier: 'free' | 'pro' | 'business';
    checks_remaining: number;
    checks_total: number;
    expires_at?: string;
  };
  preferences: {
    default_platform: Platform;
    risk_threshold: number;
    receive_email_alerts: boolean;
  };
}