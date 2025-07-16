import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ArrowLeft, MoreVertical, Send, Search, X, Clock } from 'lucide-react';
import BottomNavBar from '../components/BottomNavBar';
import { useFriends } from '../context/FriendsProvider';
import { usePremium } from '../context/PremiumProvider';

const initialChats = [
  {
    id: 1,
    name: 'Aman Kumar',
    lastMessage: 'What\'s up? How are you doing today?',
    time: '10:24 AM',
    unreadCount: 3,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isFriend: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: 2,
    name: 'Priya Sharma',
    lastMessage: 'Haha 😂 That was so funny!',
    time: 'Yesterday',
    unreadCount: 0,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isFriend: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    name: 'Stranger #314',
    lastMessage: 'Let\'s connect again soon 💕',
    time: 'Monday',
    unreadCount: 1,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isFriend: false,
    lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 4,
    name: 'Rahul Singh',
    lastMessage: 'Nice talking to you!',
    time: 'Tuesday',
    unreadCount: 2,
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isFriend: false,
    lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];

type Chat = typeof initialChats[number];

const ChatPageWrapper = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const { friends } = useFriends();

  // Merge friends into chats
  useEffect(() => {
    const friendChats = friends.map(friend => ({
      id: parseInt(friend.id) || Math.random(),
      name: friend.name,
      lastMessage: friend.isOnline ? 'Online now' : 'Tap to start chatting',
      time: friend.isOnline ? 'Online' : 'Offline',
      unreadCount: 0,
      avatar: friend.avatar,
      isFriend: true,
      lastSeen: friend.lastSeen || new Date(),
    }));

    setChats([...friendChats, ...initialChats]);
  }, [friends]);

  if (selectedChat) {
    return (
      <PersonalChat
        chat={selectedChat}
        onBack={() => setSelectedChat(null)}
        setChats={setChats}
      />
    );
  }

  return <ChatPageContent onChatClick={setSelectedChat} chats={chats} setChats={setChats} />;
};

const PersonalChat = ({
  chat,
  onBack,
  setChats,
}: {
  chat: Chat;
  onBack: () => void;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) => {
  const [messages, setMessages] = useState([
    { fromMe: false, text: chat.lastMessage, time: chat.time },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages([{ fromMe: false, text: chat.lastMessage, time: chat.time }]);
    // Mark chat as read
    setChats(prev =>
      prev.map(c => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  }, [chat, setChats]);

  const handleSend = () => {
    if (input.trim()) {
      const newMsg = {
        fromMe: true,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMsg]);
      setInput('');

      const updatedChat = {
        ...chat,
        lastMessage: input,
        time: newMsg.time,
        unreadCount: 0,
      };
      setChats(prev =>
        prev.map(c => (c.id === chat.id ? updatedChat : c))
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 shadow-xl overflow-hidden flex flex-col relative pb-20">
      {/* Enhanced Header */}
      <div className="p-4 bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-600 flex items-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-gold-100/20 to-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold-200/10 to-transparent"></div>
        <button 
          onClick={onBack} 
          className="mr-3 text-white hover:scale-110 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <img 
          src={chat.avatar}
          alt={`${chat.name} avatar`} 
          className="w-12 h-12 rounded-full object-cover mr-3 border-4 border-white shadow-lg" 
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg block">{chat.name}</span>
            {chat.isFriend && (
              <span className="bg-green-400 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                Friend
              </span>
            )}
          </div>
          <span className="text-rose-100 text-xs">
            {chat.isFriend && chat.time === 'Online' ? 'Online' : 'Last seen recently'}
          </span>
        </div>
        <button className="text-white hover:scale-110 transition-transform">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-rose-50 to-pink-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-xs shadow-md ${
                msg.fromMe
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white text-gray-800 border border-rose-200'
              }`}
            >
              <div className="leading-relaxed">{msg.text}</div>
              <div className={`text-xs text-right mt-1 ${msg.fromMe ? 'text-rose-100' : 'text-gray-400'}`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Input */}
      <div className="p-4 bg-white flex items-center border-t border-rose-100 shadow-lg">
        <input
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-sm"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          className="ml-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

const ChatPageContent = ({
  onChatClick,
  chats,
  setChats,
}: {
  onChatClick: (chat: Chat) => void;
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) => {
  const [search, setSearch] = useState('');
  const [longPressedChatId, setLongPressedChatId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  const handleLongPress = (chatId: number) => {
    setLongPressedChatId(chatId);
  };

  const handleDelete = (chatId: number) => {
    setLongPressedChatId(null);
    setChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Separate friends and regular chats
  const friendChats = filteredChats.filter(chat => chat.isFriend);
  const regularChats = filteredChats.filter(chat => !chat.isFriend);

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 shadow-xl overflow-hidden flex flex-col relative pb-20">
      {/* Enhanced Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-crimson-500 via-rose-500 to-pink-600 text-white shadow-lg relative overflow-hidden">
        {/* Header Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-gold-100/20 to-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gold-200/10 to-transparent"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')} 
              className="mr-3 hover:scale-110 transition-transform"
              aria-label="Go to home"
            >
              <ArrowLeft size={24} />
            </button> 
            <h1 className="flex-grow text-center text-2xl font-extrabold tracking-wide">Chats</h1>
          </div>
          {totalUnreadCount > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-sm font-semibold">{totalUnreadCount} new</span>
            </div>
          )}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-200 h-4 w-4" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats and messages..." 
            className="w-full pl-10 pr-10 py-3 rounded-full border-0 bg-white/30 backdrop-blur-sm text-white placeholder-rose-200 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rose-200 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Friends Section */}
        {friendChats.length > 0 && (
          <>
            <div className="px-4 py-3 bg-green-50 border-b border-green-100">
              <h3 className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Friends ({friendChats.length})
              </h3>
            </div>
            {friendChats.map((chat) => (
              <ChatItem
                key={`friend-${chat.id}`}
                chat={chat}
                onChatClick={onChatClick}
                onLongPress={handleLongPress}
                onDelete={handleDelete}
                longPressedChatId={longPressedChatId}
                setLongPressedChatId={setLongPressedChatId}
                isPremium={isPremium}
                formatLastSeen={formatLastSeen}
              />
            ))}
          </>
        )}

        {/* Regular Chats Section */}
        {regularChats.length > 0 && (
          <>
            {friendChats.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Recent Chats</h3>
              </div>
            )}
            {regularChats.map((chat) => (
              <ChatItem
                key={`regular-${chat.id}`}
                chat={chat}
                onChatClick={onChatClick}
                onLongPress={handleLongPress}
                onDelete={handleDelete}
                longPressedChatId={longPressedChatId}
                setLongPressedChatId={setLongPressedChatId}
                isPremium={isPremium}
                formatLastSeen={formatLastSeen}
              />
            ))}
          </>
        )}

        {/* No Results */}
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-8 py-12">
            <div className="relative mb-6">
              <div className="text-8xl mb-2 animate-bounce">
                {search ? '🔍' : '💬'}
              </div>
              {!search && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200 shadow-2xl max-w-sm">
              <h3 className="text-xl font-bold text-gray-700 mb-3">
                {search ? 'No chats found' : 'No chats yet'}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {search 
                  ? `No results for "${search}". Try a different search term.`
                  : 'Start a conversation to see your chats appear here! Connect with new people and build meaningful conversations.'
                }
              </p>
              {!search && (
                <Button 
                  onClick={() => navigate('/video-chat')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transform hover:scale-105 transition-all duration-200"
                >
                  Start Your First Chat
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

const ChatItem = ({
  chat,
  onChatClick,
  onLongPress,
  onDelete,
  longPressedChatId,
  setLongPressedChatId,
  isPremium,
  formatLastSeen,
}: {
  chat: Chat;
  onChatClick: (chat: Chat) => void;
  onLongPress: (chatId: number) => void;
  onDelete: (chatId: number) => void;
  longPressedChatId: number | null;
  setLongPressedChatId: (id: number | null) => void;
  isPremium: boolean;
  formatLastSeen: (date: Date) => string;
}) => {
  return (
    <div 
      className={`flex items-center p-4 cursor-pointer relative border-b border-rose-100 transition-all duration-200 rounded-xl hover:bg-rose-50/50 hover:shadow-lg transform hover:scale-[1.02] ${
        chat.isFriend ? 'bg-green-50/50' : ''
      } ${
        chat.unreadCount > 0 ? 'bg-rose-50 border-l-4 border-rose-500 shadow-lg' : ''
      }`}
      onClick={() => {
        if (longPressedChatId !== chat.id) onChatClick(chat); 
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress(chat.id);
      }}
    >
      <div className="relative">
        <img
          src={chat.avatar}
          alt={`${chat.name} avatar`}
          className={`w-14 h-14 rounded-full object-cover shadow-md transition-all duration-200 border-4 border-white ${
            chat.unreadCount > 0 ? 'border-rose-400' : 'border-white'
          }`}
        />
        {chat.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
          </div>
        )}
        {chat.isFriend && chat.time === 'Online' && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <h2 className={`truncate transition-colors duration-200 ${
              chat.unreadCount > 0 ? 'font-bold text-rose-700 text-lg' : 'font-semibold text-gray-800'
            }`}>
              {chat.name}
            </h2>
            {chat.isFriend && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                Friend
              </span>
            )}
          </div>
          <span className={`text-xs flex-shrink-0 ml-2 ${
            chat.unreadCount > 0 ? 'text-rose-600 font-semibold' : 'text-gray-500'
          }`}>
            {chat.time}
          </span>
        </div>
        
        <p className={`text-sm truncate transition-colors duration-200 ${
          chat.unreadCount > 0 ? 'text-gray-800 font-semibold' : 'text-gray-600'
        }`}>
          {chat.lastMessage}
        </p>
        
        {/* Premium Feature: Last Seen */}
        {isPremium && chat.lastSeen && chat.time !== 'Online' && (
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-400">
              Last seen {formatLastSeen(chat.lastSeen)}
            </span>
          </div>
        )}
      </div>

      {longPressedChatId === chat.id && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={e => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={e => {
              e.stopPropagation();
              setLongPressedChatId(null);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatPageWrapper;