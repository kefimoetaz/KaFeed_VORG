import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Trash2, Send, Bookmark, Copy, Check } from 'lucide-react';
import { postAPI, commentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';
import { useToast } from './Toast';
import ImageLightbox from './ImageLightbox';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showToast(isBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks', 'success');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRepost = async () => {
    try {
      await postAPI.repost(post._id, { text: post.text });
      showToast('Reposted to your profile!', 'success');
      setShowShareModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error reposting:', error);
      showToast('Failed to repost', 'error');
    }
  };

  const handleLike = async () => {
    try {
      await postAPI.like(post._id);
      onUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      try {
        await postAPI.delete(post._id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const fetchComments = async () => {
    if (!showComments) {
      try {
        const { data } = await commentAPI.get(post._id);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await commentAPI.create(post._id, { text: commentText });
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const isLiked = post.likes?.includes(user._id);

  return (
    <div className="card p-6 relative group hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${post.userId._id}`} className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group/profile">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden ring-2 ring-transparent group-hover/profile:ring-purple-300 transition-all">
            {post.userId.profilePictureURL ? (
              <img src={post.userId.profilePictureURL} alt={post.userId.username} className="w-full h-full object-cover group-hover/profile:scale-110 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {post.userId.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800 group-hover/profile:text-purple-600 transition-colors">{post.userId.username}</p>
              <span className="w-2 h-2 bg-green-500 rounded-full" title="Online"></span>
            </div>
            <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        {post.userId._id === user._id && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Repost Badge */}
      {post.originalUserId && (
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <Share2 size={14} />
          <span>
            Reposted from <Link to={`/profile/${post.originalUserId._id}`} className="text-purple-600 hover:text-purple-700 font-medium">@{post.originalUserId.username}</Link>
          </span>
        </div>
      )}

      {/* Content */}
      <p className="mb-4 text-gray-700 leading-relaxed">
        {post.text.split(' ').map((word, i) => {
          if (word.startsWith('#')) {
            return (
              <span key={i} className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">
                {word}{' '}
              </span>
            );
          }
          if (word.startsWith('@')) {
            return (
              <span key={i} className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                {word}{' '}
              </span>
            );
          }
          return word + ' ';
        })}
      </p>
      
      {/* Image */}
      {post.imageURL && (
        <>
          <div 
            className="mb-4 rounded-xl overflow-hidden group/image cursor-pointer"
            onClick={() => setShowLightbox(true)}
          >
            <img src={post.imageURL} alt="Post" className="w-full object-cover group-hover/image:scale-105 transition-transform duration-500" />
          </div>
          {showLightbox && (
            <ImageLightbox
              image={post.imageURL}
              alt="Post"
              user={post.userId.username}
              onClose={() => setShowLightbox(false)}
            />
          )}
        </>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
        <span>{post.likes?.length || 0} likes</span>
        <span>{comments.length} comments</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            handleLike();
          }}
          className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group/like ${
            isLiked 
              ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600' 
              : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} className={`${isLiked ? 'animate-pulse' : 'group-hover/like:scale-125'} transition-transform`} />
          Like
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            fetchComments();
          }}
          className="flex-1 py-2.5 rounded-xl font-medium hover:bg-gray-50 text-gray-600 transition-all flex items-center justify-center gap-2 group/comment"
        >
          <MessageCircle size={18} className="group-hover/comment:scale-125 transition-transform" />
          Comment
        </button>
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setShowShareModal(true);
          }}
          className="flex-1 py-2.5 rounded-xl font-medium hover:bg-gray-50 text-gray-600 transition-all flex items-center justify-center gap-2 group/share"
        >
          <Share2 size={18} className="group-hover/share:rotate-12 transition-transform" />
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <form onSubmit={handleComment} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
              {user.profilePictureURL ? (
                <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all">
                <Send size={18} />
              </button>
            </div>
          </form>
          
          {comments.map(comment => (
            <div key={comment._id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 overflow-hidden flex-shrink-0">
                {comment.userId.profilePictureURL ? (
                  <img src={comment.userId.profilePictureURL} alt={comment.userId.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    {comment.userId.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2">
                <p className="font-semibold text-sm text-gray-800">{comment.userId.username}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookmark Button */}
      <button
        type="button"
        onClick={handleBookmark}
        className="absolute top-4 right-12 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Bookmark 
          size={20} 
          className={`${isBookmarked ? 'fill-purple-600 text-purple-600' : 'text-gray-400 hover:text-purple-600'} transition-colors`}
        />
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Share Post</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text)}&url=${window.location.origin}/post/${post._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                <span className="text-xl">🐦</span>
                <span>Share on Twitter</span>
              </a>
              
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/post/${post._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                <span className="text-xl">📘</span>
                <span>Share on Facebook</span>
              </a>
              
              <Link
                to={`/messages?share=${post._id}`}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
                onClick={() => setShowShareModal(false)}
              >
                <MessageCircle size={20} />
                <span>Send in Message</span>
              </Link>
              
              <button
                onClick={handleRepost}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                <Share2 size={20} />
                <span>Repost to Your Profile</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
