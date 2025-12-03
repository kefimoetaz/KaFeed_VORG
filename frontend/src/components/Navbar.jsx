import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, LogOut, User, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const { data } = await userAPI.search(searchQuery);
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 lg:left-64 right-0 xl:right-80 bg-white/95 backdrop-blur-lg border-b border-gray-100 z-30 px-4 lg:px-8 py-3 lg:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Logo */}
        <h1 className="lg:hidden text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Kafeed
        </h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="w-full px-4 py-2 lg:py-2.5 pl-10 pr-10 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <Link
                      key={result._id}
                      to={`/profile/${result._id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden flex-shrink-0">
                        {result.profilePictureURL ? (
                          <img
                            src={result.profilePictureURL}
                            alt={result.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold">
                            {result.username[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {result.username}
                        </p>
                        {result.bio && (
                          <p className="text-xs text-gray-500 truncate">
                            {result.bio}
                          </p>
                        )}
                      </div>
                      <User size={16} className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <User size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No users found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try searching for a different username
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-all relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden xl:inline">Logout</span>
          </button>
          <button 
            onClick={handleLogout}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <LogOut size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
