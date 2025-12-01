import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users } from 'lucide-react';
import { postAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('explore');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchFeed(1);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 100
        && !loading && hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchFeed(page);
    }
  }, [page]);

  const fetchFeed = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = activeTab === 'following' 
        ? await postAPI.getFeed() 
        : await postAPI.getExploreFeed();
      
      if (pageNum === 1) {
        setPosts(data);
      } else {
        setPosts(prev => [...prev, ...data]);
      }
      
      if (data.length < 50) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId) => {
    try {
      // Fetch only the updated post
      const allPosts = activeTab === 'following' 
        ? await postAPI.getFeed() 
        : await postAPI.getExploreFeed();
      
      const updatedPost = allPosts.data.find(p => p._id === postId);
      if (updatedPost) {
        setPosts(prevPosts => 
          prevPosts.map(p => p._id === postId ? updatedPost : p)
        );
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Create Post Card */}
      <div className="card p-4 mb-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden ring-2 ring-purple-100 animate-pulse-glow">
            {user.profilePictureURL ? (
              <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <Link 
            to="/create"
            className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-gray-50 to-purple-50 text-gray-500 hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 hover:shadow-md transition-all cursor-pointer group"
          >
            <span className="group-hover:translate-x-1 inline-block transition-transform">
              What's on your mind, {user.username}? ✨
            </span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'explore' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles size={20} className={activeTab === 'explore' ? 'text-purple-500' : ''} />
            For You
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'following' 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={20} className={activeTab === 'following' ? 'text-purple-500' : ''} />
            Following
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading && posts.length === 0 ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-500 mb-4">
            {activeTab === 'following' 
              ? '👥 No posts from people you follow yet!' 
              : '🎉 Be the first to post!'}
          </p>
          <Link to="/create" className="btn-primary inline-block">
            Create Post
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map(post => <PostCard key={post._id} post={post} onUpdate={() => updatePost(post._id)} />)}
          </div>
          
          {/* Loading More */}
          {loading && posts.length > 0 && (
            <div className="card p-8 text-center mt-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}
          
          {/* End of Feed */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>🎉 You're all caught up!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Feed;
