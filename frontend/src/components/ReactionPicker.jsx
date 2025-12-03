import { useState } from 'react';

const reactions = [
  { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-500' },
  { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'laugh', emoji: '😂', label: 'Laugh', color: 'text-yellow-500' },
  { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-purple-500' },
  { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-blue-400' },
  { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-orange-500' }
];

const ReactionPicker = ({ onReact, currentReaction, show }) => {
  if (!show) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-2xl border border-gray-100 px-2 py-2 flex gap-1 animate-bounce-in z-10">
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onReact(reaction.type)}
          className={`group relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-all hover:scale-125 ${
            currentReaction === reaction.type ? 'bg-purple-50 scale-110' : ''
          }`}
          title={reaction.label}
        >
          <span className="text-2xl">{reaction.emoji}</span>
          
          {/* Tooltip */}
          <span className="absolute bottom-full mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {reaction.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
export { reactions };
