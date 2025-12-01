import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Search } from 'lucide-react';
import { messageAPI, userAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { timeAgo } from '../utils/timeAgo';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const userId = searchParams.get('user');
    if (userId) {
      loadConversation(userId);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await messageAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const loadConversation = async (userId) => {
    try {
      const { data: userData } = await userAPI.getProfile(userId);
      setSelectedUser(userData);
      
      const { data: messagesData } = await messageAPI.getConversation(userId);
      setMessages(messagesData);
      
      setSearchParams({ user: userId });
      fetchConversations(); // Refresh to update unread counts
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    try {
      const { data } = await messageAPI.send({
        receiverId: selectedUser._id,
        text: messageText
      });
      
      setMessages([...messages, data]);
      setMessageText('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const { data } = await userAPI.search(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* Conversations List */}
      <div className="w-80 card p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Messages</h2>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2">Search Results:</p>
            {searchResults.map(searchUser => (
              <button
                key={searchUser._id}
                onClick={() => {
                  loadConversation(searchUser._id);
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
                  {searchUser.profilePictureURL ? (
                    <img src={searchUser.profilePictureURL} alt={searchUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {searchUser.username[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{searchUser.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">No conversations yet. Search for users to start chatting!</p>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.user._id}
                onClick={() => loadConversation(conv.user._id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedUser?._id === conv.user._id
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden relative">
                  {conv.user.profilePictureURL ? (
                    <img src={conv.user.profilePictureURL} alt={conv.user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {conv.user.username[0].toUpperCase()}
                    </div>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm">{conv.user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage.text}</p>
                </div>
                <span className="text-xs text-gray-400">{timeAgo(conv.lastMessage.createdAt)}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 overflow-hidden">
                {selectedUser.profilePictureURL ? (
                  <img src={selectedUser.profilePictureURL} alt={selectedUser.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {selectedUser.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{selectedUser.username}</p>
                <p className="text-xs text-gray-500">{selectedUser.bio || 'No bio'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isSent = msg.senderId._id === user._id;
                return (
                  <div key={msg._id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${isSent ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        isSent 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${isSent ? 'text-right' : 'text-left'}`}>
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg mb-2">Select a conversation</p>
              <p className="text-sm">Choose from your existing conversations or search for someone new</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
