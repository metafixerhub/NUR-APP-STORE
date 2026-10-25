export interface CommentItem {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  likes: number;
  verified?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  developer: string;
  developerEmail?: string;
  category: AppCategory;
  rating: number; // 1.0 to 5.0
  ratingCount: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  downloads: string; // e.g. "50K+"
  downloadCount: number;
  size: string; // e.g. "24 MB"
  version: string; // e.g. "1.2.0"
  updatedAt: string;
  requiresAndroid: string; // e.g. "Android 7.0 and up"
  iconUrl: string;
  apkUrl: string;
  apkFileName?: string;
  shortDescription: string;
  fullDescription: string;
  screenshots: string[];
  featured?: boolean;
  editorsChoice?: boolean;
  tags?: string[];
  whatsNew?: string;
  comments: CommentItem[];
  createdAt: string;
}

export type AppCategory = 
  | 'All'
  | 'Islamic & Quran'
  | 'Tools & Utilities'
  | 'Productivity'
  | 'Social & Chat'
  | 'Education'
  | 'Games'
  | 'Entertainment'
  | 'Media & Video';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}
