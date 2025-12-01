import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useToast } from '../components/Toast';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (image) formData.append('image', image);

      await postAPI.create(formData);
      showToast('Post created successfully!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const maxLength = 500;
  const remaining = maxLength - text.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          ✨ Create New Post
        </h1>
        
        <form onSubmit={handleSubmit}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
              {user.profilePictureURL ? (
                <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">🌍 Public</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-4 border-0 focus:outline-none resize-none text-gray-700 text-lg mb-2"
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={maxLength}
            required
          />
          <div className="text-right mb-4">
            <span className={`text-xs ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
              {remaining} characters remaining
            </span>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-4 rounded-xl overflow-hidden">
              <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-all shadow-lg"
              >
                ✕
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:shadow-md transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                📷 {image ? 'Change' : 'Add'} Photo
              </label>
              <button type="button" className="px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all">
                😊 Emoji
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : '✨ Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
