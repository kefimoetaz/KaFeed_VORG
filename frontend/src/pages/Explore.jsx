import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Sparkles, Compass } from 'lucide-react';
import { userAPI } from '../services/api';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuggested();
  }, []);

  const fetchSuggested = async () => {
    try {
      const { data } = await userAPI.getSuggested();
      setSuggestedUsers(data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data } = await userAPI.search(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userAPI.follow(userId);
      fetchSuggested();
      if (searchQuery) {
        const { data } = await userAPI.search(searchQuery);
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const UserCard = ({ user }) => (
    <div className="card p-4 mb-3 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <Link to={`/profile/${user._id}`} className="flex items-center flex-1 gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
            {user.profilePictureURL ? (
              <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">{user.username}</p>
            <p className="text-sm text-gray-500 truncate">{user.bio || 'No bio yet'}</p>
            <p className="text-xs text-gray-400 mt-1">
              {user.followers?.length || 0} followers
            </p>
          </div>
        </Link>
        <button
          onClick={() => handleFollow(user._id)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus size={18} />
          Follow
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
          <Compass size={24} className="text-purple-500" />
          Discover People
        </h1>
        
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-3 pl-10 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Search Results</h2>
          {searchResults.map(user => <UserCard key={user._id} user={user} />)}
        </div>
      ) : searchQuery ? (
        <div className="card p-8 text-center text-gray-500">
          No users found for "{searchQuery}"
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-500" />
            Suggested for You
          </h2>
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map(user => <UserCard key={user._id} user={user} />)
          ) : (
            <div className="card p-8 text-center text-gray-500">
              No suggestions available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
