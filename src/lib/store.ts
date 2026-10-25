import fs from 'fs';
import path from 'path';
import { AppItem, CommentItem } from '../types/app';
import { INITIAL_APPS } from '../data/initialApps';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'apps.json');

// In-memory cache for serverless environments where disk might be ephemeral
let memoryApps: AppItem[] = [...INITIAL_APPS];

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_APPS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Filesystem access limited, using in-memory store:', err);
  }
}

export function getAllApps(): AppItem[] {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryApps = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading apps from disk, using memory cache:', err);
  }
  return memoryApps;
}

export function saveApps(apps: AppItem[]): boolean {
  memoryApps = apps;
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('Error saving apps to disk, updated in-memory store:', err);
    return true; // Still successful in memory
  }
}

export function getAppById(id: string): AppItem | undefined {
  const apps = getAllApps();
  return apps.find((a) => a.id === id);
}

export function addApp(newApp: AppItem): AppItem {
  const apps = getAllApps();
  const updated = [newApp, ...apps];
  saveApps(updated);
  return newApp;
}

export function updateApp(id: string, updates: Partial<AppItem>): AppItem | null {
  const apps = getAllApps();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const existing = apps[index];
  const updatedItem: AppItem = {
    ...existing,
    ...updates,
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };

  apps[index] = updatedItem;
  saveApps(apps);
  return updatedItem;
}

export function deleteApp(id: string): boolean {
  const apps = getAllApps();
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) return false;
  saveApps(filtered);
  return true;
}

export function addCommentToApp(appId: string, comment: CommentItem): AppItem | null {
  const apps = getAllApps();
  const index = apps.findIndex((a) => a.id === appId);
  if (index === -1) return null;

  const app = apps[index];
  const updatedComments = [comment, ...(app.comments || [])];
  
  // Recalculate average rating
  const totalStars = updatedComments.reduce((acc, c) => acc + c.rating, 0);
  const newRating = Number((totalStars / updatedComments.length).toFixed(1));

  // Update rating breakdown
  const breakdown = { ...(app.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }) };
  const starKey = Math.min(5, Math.max(1, Math.round(comment.rating))) as 1 | 2 | 3 | 4 | 5;
  breakdown[starKey] = (breakdown[starKey] || 0) + 1;

  const updatedApp: AppItem = {
    ...app,
    rating: newRating,
    ratingCount: (app.ratingCount || 0) + 1,
    ratingBreakdown: breakdown,
    comments: updatedComments,
  };

  apps[index] = updatedApp;
  saveApps(apps);
  return updatedApp;
}

export function incrementDownload(appId: string): AppItem | null {
  const apps = getAllApps();
  const index = apps.findIndex((a) => a.id === appId);
  if (index === -1) return null;

  const app = apps[index];
  const newCount = (app.downloadCount || 0) + 1;
  let formatted = `${newCount}`;
  if (newCount >= 1000000) {
    formatted = `${(newCount / 1000000).toFixed(1)}M+`;
  } else if (newCount >= 1000) {
    formatted = `${Math.floor(newCount / 1000)}K+`;
  }

  const updated: AppItem = {
    ...app,
    downloadCount: newCount,
    downloads: formatted,
  };

  apps[index] = updated;
  saveApps(apps);
  return updated;
}
