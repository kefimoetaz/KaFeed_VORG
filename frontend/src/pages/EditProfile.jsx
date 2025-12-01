import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EditProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await userAPI.getProfile(user._id);
      setBio(data.bio || '');
      setPreview(data.profilePictureURL || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profileImage) {
        formData.append('image', profileImage);
      }

      const { data } = await userAPI.updateProfile(formData);
      
      // Update user in context
      const updatedUser = { ...user, bio: data.bio, profilePictureURL: data.profilePictureURL };
      const token = localStorage.getItem('token');
      login(updatedUser, token);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate(`/profile/${user._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="flex-1"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-3 border rounded bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Bio</label>
          <textarea
            placeholder="Tell us about yourself..."
            className="w-full p-3 border rounded h-32"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${user._id}`)}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
