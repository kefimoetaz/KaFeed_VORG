import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-64 right-80 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-40 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts, people, tags..."
              className="w-full px-4 py-2.5 pl-10 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-all relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
