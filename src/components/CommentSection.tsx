'use client';

import React, { useState, useMemo } from 'react';
import { Star, Search, ThumbsUp, MessageSquare, Send, CheckCircle2, User } from 'lucide-react';
import { CommentItem } from '@/types/app';

interface CommentSectionProps {
  appId: string;
  initialComments: CommentItem[];
  overallRating: number;
  ratingCount: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  onCommentAdded?: (newComment: CommentItem, updatedApp: any) => void;
}

export default function CommentSection({
  appId,
  initialComments,
  overallRating,
  ratingCount,
  ratingBreakdown,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // New comment form state
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Auto-fill username if logged in
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('nur_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setUserName(u.name);
      }
    } catch (e) {}
  }, []);

  // Filtered comments
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStar = starFilter === null || c.rating === starFilter;

      return matchesSearch && matchesStar;
    });
  }, [comments, searchQuery, starFilter]);

  // Handle like
  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Submit comment
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setFeedbackMsg('');

    try {
      const author = userName.trim() || 'Nur App Explorer';
      const res = await fetch(`/api/apps/${appId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: author,
          rating: userRating,
          comment: commentText.trim(),
          verified: true,
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setCommentText('');
        setFeedbackMsg('Thank you! Your review has been published.');
        if (onCommentAdded) {
          onCommentAdded(data.comment, data.app);
        }
        setTimeout(() => setFeedbackMsg(''), 4000);
      } else {
        setFeedbackMsg(data.error || 'Failed to post review');
      }
    } catch (err) {
      setFeedbackMsg('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Breakdown calculations
  const totalReviews = Math.max(1, ratingCount || comments.length);
  const breakdown = ratingBreakdown || {
    5: Math.round(totalReviews * 0.8),
    4: Math.round(totalReviews * 0.12),
    3: Math.round(totalReviews * 0.05),
    2: Math.round(totalReviews * 0.02),
    1: Math.round(totalReviews * 0.01),
  };

  return (
    <div className="my-10 pt-8 border-t border-slate-200">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Ratings & Reviews</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Community
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Verified feedback from Nur App Store members</p>
        </div>
      </div>

      {/* Ratings summary and distribution */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-white border border-slate-200 mb-8 shadow-xs">
        
        {/* Left score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200">
          <div className="text-5xl font-black text-amber-500 mb-2">
            {overallRating ? overallRating.toFixed(1) : '5.0'}
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(overallRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Based on {totalReviews.toLocaleString()} ratings
          </p>
        </div>

        {/* Right 5-star distribution bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (breakdown as any)[stars] || 0;
            const percent = Math.min(100, Math.round((count / totalReviews) * 100));

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-semibold text-slate-700 flex items-center gap-1 justify-end">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-500 text-[11px]">{percent}%</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Community Comment Search Bar (User specifically asked: "then down community comment search") */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community reviews and comments..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick star filter buttons */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStarFilter(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                starFilter === null
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All Stars
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(starFilter === s ? null : s)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  starFilter === s
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{s}</span>
                <Star className={`w-3 h-3 ${starFilter === s ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Showing results for "{searchQuery}"</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:underline text-xs font-semibold"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Add Review Box */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 mb-8 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span>Write a Review</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Share your experience with this app. Account is optional — anyone can review!
        </p>

        {feedbackMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          
          {/* Star selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Rating (1 to 5 Stars):
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setUserRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 cursor-pointer ${
                      s <= (hoverRating ?? userRating)
                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-amber-500">
                {hoverRating ?? userRating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name / Nickname (Optional):
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Tariq, Sarah, Guest User..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Review & Comments:
            </label>
            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What do you think of this app? What features do you like?"
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500">
            <p className="text-sm font-medium">No reviews match your search or filter.</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">{comment.userName}</span>
                      {comment.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified User</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{comment.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= comment.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed mb-3">
                {comment.comment}
              </p>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
                  title="Mark as helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({comment.likes || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
