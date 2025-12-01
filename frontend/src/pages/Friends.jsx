import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserMinus, MessageCircle } from 'lucide-react';
import { userAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Friends = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getProfile(user._id);
      
      // Fetch full user details for followers
      const followersData = await Promise.all(
        data.followers.map(id => userAPI.getProfile(id))
      );
      setFollowers(followersData.map(res => res.data));

      // Fetch full user details for following
      const followingData = await Promise.all(
        data.following.map(id => userAPI.getProfile(id))
      );
      setFollowing(followingData.map(res => res.data));
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userAPI.unfollow(userId);
      showToast('Unfollowed successfully', 'success');
      fetchFriends();
    } catch (error) {
      console.error('Error unfollowing:', error);
      showToast('Failed to unfollow', 'error');
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userAPI.follow(userId);
      showToast('Followed successfully', 'success');
      fetchFriends();
    } catch (error) {
      console.error('Error following:', error);
      showToast('Failed to follow', 'error');
    }
  };

  const UserCard = ({ user: friendUser, isFollowing }) => (
    <div className="card p-4 hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${friendUser._id}`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
            {friendUser.profilePictureURL ? (
              <img src={friendUser.profilePictureURL} alt={friendUser.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                {friendUser.username[0].toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/profile/${friendUser._id}`}>
            <p className="font-semibold text-gray-800 hover:text-purple-600">{friendUser.username}</p>
          </Link>
          <p className="text-sm text-gray-500 truncate">{friendUser.bio || 'No bio yet'}</p>
          <p className="text-xs text-gray-400 mt-1">
            {friendUser.followers?.length || 0} followers · {friendUser.following?.length || 0} following
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/messages?user=${friendUser._id}`}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            title="Message"
          >
            <MessageCircle size={18} className="text-gray-600" />
          </Link>
          {isFollowing ? (
            <button
              onClick={() => handleUnfollow(friendUser._id)}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all flex items-center gap-2"
            >
              <UserMinus size={18} />
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => handleFollow(friendUser._id)}
              className="btn-primary flex items-center gap-2"
            >
              <UserPlus size={18} />
              Follow Back
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
          <Users size={28} className="text-purple-500" />
          Friends
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
            <p className="text-3xl font-bold text-purple-600">{followers.length}</p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">{following.length}</p>
            <p className="text-sm text-gray-600">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('followers')}
            className={`pb-3 px-4 font-semibold transition-all ${
              activeTab === 'followers'
                ? 'text-purple-600 border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`pb-3 px-4 font-semibold transition-all ${
              activeTab === 'following'
                ? 'text-purple-600 border-b-2 border-purple-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Following ({following.length})
          </button>
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'followers' ? (
            followers.length > 0 ? (
              followers.map(follower => (
                <UserCard 
                  key={follower._id} 
                  user={follower} 
                  isFollowing={following.some(f => f._id === follower._id)}
                />
              ))
            ) : (
              <div className="card p-8 text-center text-gray-500">
                No followers yet. Share your profile to get followers!
              </div>
            )
          ) : (
            following.length > 0 ? (
              following.map(followedUser => (
                <UserCard 
                  key={followedUser._id} 
                  user={followedUser} 
                  isFollowing={true}
                />
              ))
            ) : (
              <div className="card p-8 text-center text-gray-500">
                Not following anyone yet. Explore users to follow!
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
