import { useState, useEffect, useContext } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { postAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Media = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await postAPI.getUserPosts(user._id);
      // Filter only posts with images
      const postsWithImages = data.filter(post => post.imageURL);
      setPosts(postsWithImages);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const openImage = (post) => {
    setSelectedImage(post);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
          <ImageIcon size={28} className="text-purple-500" />
          My Media
        </h1>
        <p className="text-gray-600">All your photos and images in one place</p>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="animate-pulse">Loading media...</div>
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="mb-4">No media yet. Start sharing photos!</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-2xl text-purple-600">{posts.length}</span> photos
              </p>
              <p className="text-sm text-gray-500">
                Total likes: <span className="font-semibold">{posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}</span>
              </p>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="card overflow-hidden cursor-pointer group relative aspect-square"
                onClick={() => openImage(post)}
              >
                <img
                  src={post.imageURL}
                  alt={post.text}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                    <p className="font-semibold">❤️ {post.likes?.length || 0}</p>
                    <p className="text-sm">💬 View Post</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-t-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
                  {user.profilePictureURL ? (
                    <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-500">{selectedImage.text}</p>
                </div>
              </div>
            </div>
            <img
              src={selectedImage.imageURL}
              alt={selectedImage.text}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="bg-white rounded-b-2xl p-4">
              <p className="text-sm text-gray-600">
                ❤️ {selectedImage.likes?.length || 0} likes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
