import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { reactions } from './ReactionPicker';

const ReactionsModal = ({ isOpen, onClose, postReactions = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  // Group reactions by type
  const reactionsByType = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = postReactions.filter(r => r.type === reaction.type);
    return acc;
  }, {});

  const filteredReactions = activeTab === 'all' 
    ? postReactions 
    : reactionsByType[activeTab] || [];

  // Count for each tab
  const tabCounts = {
    all: postReactions.length,
    ...reactions.reduce((acc, reaction) => {
      acc[reaction.type] = reactionsByType[reaction.type].length;
      return acc;
    }, {})
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Reactions</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-3 border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All {tabCounts.all > 0 && `(${tabCounts.all})`}
          </button>
          
          {reactions.map((reaction) => (
            tabCounts[reaction.type] > 0 && (
              <button
                key={reaction.type}
                onClick={() => setActiveTab(reaction.type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                  activeTab === reaction.type
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span>{tabCounts[reaction.type]}</span>
              </button>
            )
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredReactions.length > 0 ? (
            <div className="space-y-3">
              {filteredReactions.map((reaction) => (
                <Link
                  key={reaction.userId._id}
                  to={`/profile/${reaction.userId._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
                    {reaction.userId.profilePictureURL ? (
                      <img
                        src={reaction.userId.profilePictureURL}
                        alt={reaction.userId.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold">
                        {reaction.userId.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                      {reaction.userId.username}
                    </p>
                  </div>
                  <span className="text-2xl">
                    {reactions.find(r => r.type === reaction.type)?.emoji}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No reactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactionsModal;
