import { useState } from 'react';
import { reactions } from './ReactionPicker';

const ReactionSummary = ({ postReactions = [], onViewReactions }) => {
  // Count reactions by type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    const count = postReactions.filter(r => r.type === reaction.type).length;
    if (count > 0) {
      acc.push({ ...reaction, count });
    }
    return acc;
  }, []);

  const totalReactions = postReactions.length;

  if (totalReactions === 0) return null;

  return (
    <button
      onClick={onViewReactions}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors group"
    >
      {/* Show top 3 reaction emojis */}
      <div className="flex -space-x-1">
        {reactionCounts.slice(0, 3).map((reaction, index) => (
          <span
            key={reaction.type}
            className="inline-flex items-center justify-center w-6 h-6 bg-white rounded-full border-2 border-white group-hover:scale-110 transition-transform"
            style={{ zIndex: 3 - index }}
          >
            <span className="text-sm">{reaction.emoji}</span>
          </span>
        ))}
      </div>
      
      {/* Count */}
      <span className="font-medium group-hover:underline">
        {totalReactions}
      </span>
    </button>
  );
};

export default ReactionSummary;
