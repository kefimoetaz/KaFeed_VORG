import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, Image, Compass, Settings, PlusCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { messageAPI } from '../services/api';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await messageAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'News Feed', path: '/' },
    { icon: MessageCircle, label: 'Messages', path: '/messages', badge: unreadCount },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: Image, label: 'Media', path: '/media' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 p-6 bg-white/80 backdrop-blur-lg border-r border-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Kafeed
        </h1>
      </div>

      <Link to={`/profile/${user._id}`} className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 mb-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/0 via-purple-100/50 to-purple-100/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden flex-shrink-0 ring-2 ring-purple-200 group-hover:ring-4 group-hover:ring-purple-300 transition-all">
          {user.profilePictureURL ? (
            <img src={user.profilePictureURL} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 relative z-10">
          <p className="font-semibold text-gray-800 truncate group-hover:text-purple-700 transition-colors">{user.username}</p>
          <p className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors">View Profile →</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => sessionStorage.setItem('isNavigating', 'true')}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Link to="/create" className="btn-primary w-full mt-6 text-center flex items-center justify-center gap-2 group">
        <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        <span>Create Post</span>
      </Link>
    </div>
  );
};

export default Sidebar;
