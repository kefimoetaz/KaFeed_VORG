import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Lock, Bell, Eye, Shield, Trash2, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('account');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    { id: 'account', icon: User, label: 'Account' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Lock, label: 'Security' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6 mb-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
          <SettingsIcon size={28} className="text-purple-500" />
          Settings
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 card p-4">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="col-span-3 card p-6">
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">Username</p>
                      <p className="text-sm text-gray-500">{user.username}</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold">Profile</p>
                      <p className="text-sm text-gray-500">Edit your profile information</p>
                    </div>
                    <button 
                      onClick={() => navigate('/profile/edit')}
                      className="btn-primary"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition-all">
                    <div className="flex items-center gap-3">
                      <Trash2 size={20} />
                      <div className="text-left">
                        <p className="font-semibold">Delete Account</p>
                        <p className="text-sm">Permanently delete your account and all data</p>
                      </div>
                    </div>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut size={20} />
                      <div className="text-left">
                        <p className="font-semibold">Logout</p>
                        <p className="text-sm">Sign out of your account</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Private Account</p>
                    <p className="text-sm text-gray-500">Only followers can see your posts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Show Online Status</p>
                    <p className="text-sm text-gray-500">Let others see when you're online</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Likes</p>
                    <p className="text-sm text-gray-500">Get notified when someone likes your post</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Comments</p>
                    <p className="text-sm text-gray-500">Get notified when someone comments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">New Followers</p>
                    <p className="text-sm text-gray-500">Get notified when someone follows you</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password regularly</p>
                  </div>
                  <button className="btn-primary">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="btn-secondary">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
