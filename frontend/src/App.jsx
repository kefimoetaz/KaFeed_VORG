import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Explore from './pages/Explore';
import EditProfile from './pages/EditProfile';
import Messages from './pages/Messages';
import Friends from './pages/Friends';
import Media from './pages/Media';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top when pathname changes (navigation)
    // Don't scroll on state updates
    const isNavigating = sessionStorage.getItem('isNavigating');
    if (isNavigating === 'true') {
      window.scrollTo(0, 0);
      sessionStorage.removeItem('isNavigating');
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Sidebar />
                    <Navbar />
                    <RightSidebar />
                    <main className="lg:ml-64 xl:mr-80 pt-16 lg:pt-20 px-4 lg:px-8 pb-20 lg:pb-8">
                      <Routes>
                        <Route path="/" element={<Feed />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/profile/edit" element={<EditProfile />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/friends" element={<Friends />} />
                        <Route path="/media" element={<Media />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
