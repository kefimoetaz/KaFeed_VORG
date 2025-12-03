import { useState, useEffect, useRef } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { timeAgo } from '../utils/timeAgo';

const Notifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    // Mock data - replace with real API call
    {
      id: 1,
      type: 'like',
      user: { username: 'johndoe', profilePictureURL: '' },
      message: 'liked your post',
      time: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: 2,
      type: 'comment',
      user: { username: 'janedoe', profilePictureURL: '' },
      message: 'commented on your post',
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: 3,
      type: 'follow',
      user: { username: 'mike', profilePictureURL: '' },
      message: 'started following you',
      time: new Date(Date.now() - 1000 * 60 * 60),
      read: true
    }
  ]);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={16} className="text-green-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-full hover:bg-gray-100 transition-all relative"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 lg:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[32rem] overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[28rem]">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-purple-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
                      {notif.user.profilePictureURL ? (
                        <img
                          src={notif.user.profilePictureURL}
                          alt={notif.user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          {notif.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        <Link
                          to={`/profile/${notif.user.id}`}
                          className="font-semibold hover:text-purple-600"
                        >
                          {notif.user.username}
                        </Link>{' '}
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {timeAgo(notif.time)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  We'll notify you when something happens
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
