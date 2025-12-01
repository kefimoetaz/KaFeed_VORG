import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI, postAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await userAPI.getProfile(id);
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await postAPI.getUserPosts(id);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await userAPI.follow(id);
      fetchProfile();
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await userAPI.unfollow(id);
      fetchProfile();
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">User not found</div>;

  const isOwnProfile = currentUser._id === id;
  const isFollowing = user.followers?.includes(currentUser._id);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            {user.profilePictureURL ? (
              <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-500">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{user.username}</h1>
              {isOwnProfile ? (
                <Link
                  to="/profile/edit"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                  className={`px-6 py-2 rounded ${
                    isFollowing ? 'bg-gray-300 hover:bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            <p className="text-gray-600 mb-3">{user.bio || 'No bio yet'}</p>
            <div className="flex gap-4 text-sm">
              <span><strong>{user.followers?.length || 0}</strong> Followers</span>
              <span><strong>{user.following?.length || 0}</strong> Following</span>
              <span><strong>{posts.length}</strong> Posts</span>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No posts yet</p>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />)
      )}
    </div>
  );
};

export default Profile;
