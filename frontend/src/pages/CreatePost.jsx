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
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="card p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
            <span className="animate-float">✨</span>
            Create New Post
          </h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden ring-2 ring-purple-200 animate-pulse-glow">
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
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>🌍</span> Public
              </p>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              placeholder="What's on your mind? Share something amazing... ✨"
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-purple-300 focus:ring-4 focus:ring-purple-100 resize-none text-gray-700 text-lg transition-all"
              rows="8"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={maxLength}
              required
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className={`relative w-10 h-10 ${remaining < 50 ? 'animate-pulse' : ''}`}>
                <svg className="transform -rotate-90 w-10 h-10">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (remaining / maxLength)}`}
                    className={`transition-all ${remaining < 50 ? 'text-red-500' : 'text-purple-500'}`}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${remaining < 50 ? 'text-red-500' : 'text-gray-600'}`}>
                  {remaining}
                </span>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden animate-bounce-in group">
              <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg flex items-center justify-center font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                📷 Image attached
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t-2 border-gray-100">
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-medium">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <span className="text-xl">📷</span>
                <span className="hidden sm:inline">{image ? 'Change Photo' : 'Add Photo'}</span>
              </label>
              <button 
                type="button" 
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-600 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-medium"
              >
                <span className="text-xl">😊</span>
                <span className="hidden sm:inline">Emoji</span>
              </button>
              <button 
                type="button" 
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-medium"
              >
                <span className="text-xl">📍</span>
                <span className="hidden sm:inline">Location</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <span className="animate-float">✨</span>
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>
              <strong>Pro tip:</strong> Use hashtags (#) to reach more people and @ to mention friends!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
