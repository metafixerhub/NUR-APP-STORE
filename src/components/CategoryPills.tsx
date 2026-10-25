'use client';

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Wrench, 
  MessageSquare, 
  CheckSquare, 
  GraduationCap, 
  Gamepad2, 
  Film, 
  Grid 
} from 'lucide-react';
import { AppCategory } from '@/types/app';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: AppCategory) => void;
}

const CATEGORIES: { label: AppCategory; icon: any }[] = [
  { label: 'All', icon: Grid },
  { label: 'Islamic & Quran', icon: BookOpen },
  { label: 'Tools & Utilities', icon: Wrench },
  { label: 'Social & Chat', icon: MessageSquare },
  { label: 'Productivity', icon: CheckSquare },
  { label: 'Education', icon: GraduationCap },
  { label: 'Games', icon: Gamepad2 },
  { label: 'Media & Video', icon: Film },
];

export default function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 mb-6">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.label;

          return (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(cat.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                isSelected
                  ? 'bg-nur-gold text-nur-dark border-nur-gold shadow-md shadow-nur-gold/25 font-bold scale-[1.02]'
                  : 'bg-nur-navy/80 hover:bg-nur-surface text-slate-300 hover:text-white border-nur-border hover:border-slate-600'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-nur-dark' : 'text-nur-gold'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
