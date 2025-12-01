import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Sparkles, Plus, X } from 'lucide-react';
import { userAPI, storyAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';

const RightSidebar = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);

  useEffect(() => {
    fetchSuggested();
    fetchStories();
  }, []);

  const fetchSuggested = async () => {
    try {
      const { data } = await userAPI.getSuggested();
      setSuggestedUsers(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const { data } = await storyAPI.getAll();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userAPI.follow(userId);
      fetchSuggested();
      showToast('User followed successfully!', 'success');
    } catch (error) {
      console.error('Error following user:', error);
      showToast('Failed to follow user', 'error');
    }
  };

  const handleCreateStory = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      await storyAPI.create(formData);
      showToast('Story created successfully!', 'success');
      fetchStories();
    } catch (error) {
      console.error('Error creating story:', error);
      showToast('Failed to create story', 'error');
    }
  };

  const viewStory = (storyGroup) => {
    setSelectedStory(storyGroup);
    setShowStoryModal(true);
  };

  const closeStoryModal = () => {
    setShowStoryModal(false);
    setSelectedStory(null);
  };

  const hasOwnStory = stories.some(s => s.user._id === user._id);

  const recommendations = [
    { id: 1, title: 'Music Lovers', tag: 'Music', members: '2.5k', color: 'bg-purple-100 text-purple-600' },
    { id: 2, title: 'Cooking Tips', tag: 'Cooking', members: '1.8k', color: 'bg-orange-100 text-orange-600' },
    { id: 3, title: 'Hiking Club', tag: 'Hiking', members: '3.2k', color: 'bg-green-100 text-green-600' },
    { id: 4, title: 'UI/UX Design', tag: 'UI/UX', members: '4.1k', color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <>
    <div className="fixed right-0 top-0 h-screen w-80 p-6 overflow-y-auto">
      {/* Stories */}
      <div className="card p-4 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">Stories</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCreateStory}
              />
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-0.5 ${hasOwnStory ? 'ring-2 ring-offset-2 ring-purple-400' : ''}`}>
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center group-hover:scale-95 transition-transform relative overflow-hidden">
                  {user.profilePictureURL ? (
                    <img src={user.profilePictureURL} alt="Your Story" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{user.username[0].toUpperCase()}</span>
                  )}
                  {!hasOwnStory && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Plus size={24} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center block">Your Story</span>
            </label>
          </div>

          {/* Other Stories */}
          {stories.filter(s => s.user._id !== user._id).map((storyGroup) => (
            <div 
              key={storyGroup.user._id} 
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => viewStory(storyGroup)}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-0.5 ring-2 ring-offset-2 ring-purple-400">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center group-hover:scale-95 transition-transform overflow-hidden">
                  {storyGroup.user.profilePictureURL ? (
                    <img src={storyGroup.user.profilePictureURL} alt={storyGroup.user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{storyGroup.user.username[0].toUpperCase()}</span>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600 truncate w-16 text-center">{storyGroup.user.username}</span>
            </div>
          ))}
        </div>
      </div>



      {/* Suggestions */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Suggestions</h3>
          <Link to="/explore" className="text-xs text-purple-600 hover:text-purple-700">See All</Link>
        </div>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden relative">
                {user.profilePictureURL ? (
                  <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.bio || 'New user'}</p>
              </div>
              <button
                onClick={() => handleFollow(user._id)}
                className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-all flex items-center gap-1"
              >
                <UserPlus size={14} />
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card p-4">
        <h3 className="font-bold text-gray-800 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm text-gray-800">{rec.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${rec.color}`}>
                  {rec.tag}
                </span>
              </div>
              <p className="text-xs text-gray-500">{rec.members} members</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Story Modal - Rendered at root level */}
    {showStoryModal && selectedStory && (
      <div 
        className="fixed bg-black/95 flex items-center justify-center p-4" 
        style={{ 
          zIndex: 99999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0
        }}
        onClick={closeStoryModal}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            closeStoryModal();
          }}
          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
        >
          <X size={28} />
        </button>
        <div className="max-w-md w-full mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-t-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
              {selectedStory.user.profilePictureURL ? (
                <img src={selectedStory.user.profilePictureURL} alt={selectedStory.user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {selectedStory.user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">{selectedStory.user.username}</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
          <div className="bg-black">
            <img 
              src={selectedStory.stories[0].imageURL} 
              alt="Story" 
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
          <div className="bg-white rounded-b-2xl p-4">
            <p className="text-sm text-gray-600">
              {selectedStory.stories.length} {selectedStory.stories.length === 1 ? 'story' : 'stories'}
            </p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default RightSidebar;
