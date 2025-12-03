import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingActionButton = () => {
  return (
    <Link
      to="/create"
      className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all z-40 group animate-bounce-in"
      style={{ animationDelay: '0.5s' }}
    >
      <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Create Post
      </span>
    </Link>
  );
};

export default FloatingActionButton;
