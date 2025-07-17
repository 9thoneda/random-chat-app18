import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Search,
  X,
  Clock,
  Users,
  MessageCircle,
  Star,
  Heart,
} from "lucide-react";
import BottomNavBar from "../components/BottomNavBar";
import { useFriends } from "../context/FriendsProvider";
import { usePremium } from "../context/PremiumProvider";

const initialChats = [
  {
    id: 1,
    name: "Aman Kumar",
    lastMessage: "What's up? How are you doing today?",
    time: "10:24 AM",
    unreadCount: 3,
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    isFriend: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isTyping: false,
  },
  {
    id: 2,
    name: "Priya Sharma",
    lastMessage: "Haha 😂 That was so funny!",
    time: "Yesterday",
    unreadCount: 0,
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    isFriend: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isTyping: false,
  },
  {
    id: 3,
    name: "Stranger #314",
    lastMessage: "Let's connect again soon 💕",
    time: "Monday",
    unreadCount: 1,
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    isFriend: false,
    lastSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isTyping: false,
  },
  {
    id: 4,
    name: "Rahul Singh",
    lastMessage: "Nice talking to you!",
    time: "Tuesday",
    unreadCount: 2,
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    isFriend: false,
    lastSeen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isTyping: true,
  },
];

type Chat = (typeof initialChats)[number];

const ChatPageWrapper = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const { friends } = useFriends();

  // Merge friends into chats
  useEffect(() => {
    const friendChats = friends.map((friend) => ({
      id: parseInt(friend.id) || Math.random(),
      name: friend.name,
      lastMessage: friend.isOnline ? "Online now" : "Tap to start chatting",
      time: friend.isOnline ? "Online" : "Offline",
      unreadCount: 0,
      avatar: friend.avatar,
      isFriend: true,
      lastSeen: friend.lastSeen || new Date(),
      isTyping: false,
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

  return (
    <ChatPageContent
      onChatClick={setSelectedChat}
      chats={chats}
      setChats={setChats}
    />
  );
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
  const [input, setInput] = useState("");

  useEffect(() => {
    setMessages([{ fromMe: false, text: chat.lastMessage, time: chat.time }]);
    // Mark chat as read
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
    );
  }, [chat, setChats]);

  const handleSend = () => {
    if (input.trim()) {
      const newMsg = {
        fromMe: true,
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setInput("");

      const updatedChat = {
        ...chat,
        lastMessage: input,
        time: newMsg.time,
        unreadCount: 0,
      };
      setChats((prev) => prev.map((c) => (c.id === chat.id ? updatedChat : c)));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 shadow-xl overflow-hidden flex flex-col relative pb-20">
      {/* Enhanced Header */}
      <div className="p-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 flex items-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>

        <button
          onClick={onBack}
          className="mr-3 text-white hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-white/20"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <img
          src={chat.avatar}
          alt={`${chat.name} avatar`}
          className="w-12 h-12 rounded-full object-cover mr-3 border-3 border-white/50 shadow-lg backdrop-blur-sm"
        />
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg">{chat.name}</span>
            {chat.isFriend && (
              <span className="bg-emerald-400/20 backdrop-blur-sm text-emerald-100 text-xs px-2 py-1 rounded-full font-semibold border border-emerald-300/30">
                Friend
              </span>
            )}
          </div>
          <span className="text-indigo-100 text-xs">
            {chat.isFriend && chat.time === "Online" ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Online
              </div>
            ) : (
              "Last seen recently"
            )}
          </span>
        </div>
        <button className="text-white hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-white/20">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-xs shadow-sm transition-all duration-200 hover:shadow-md ${
                msg.fromMe
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-800 border border-gray-100"
              }`}
            >
              <div className="leading-relaxed">{msg.text}</div>
              <div
                className={`text-xs text-right mt-1 ${msg.fromMe ? "text-purple-100" : "text-gray-400"}`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Input */}
      <div className="p-4 bg-white/90 backdrop-blur-sm flex items-center border-t border-gray-100 shadow-lg">
        <input
          className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-200"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          className="ml-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
  const [search, setSearch] = useState("");
  const [longPressedChatId, setLongPressedChatId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  const handleLongPress = (chatId: number) => {
    setLongPressedChatId(chatId);
  };

  const handleDelete = (chatId: number) => {
    setLongPressedChatId(null);
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUnreadCount = chats.reduce(
    (sum, chat) => sum + chat.unreadCount,
    0,
  );

  // Separate friends and regular chats
  const friendChats = filteredChats.filter((chat) => chat.isFriend);
  const regularChats = filteredChats.filter((chat) => !chat.isFriend);

  const formatLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 shadow-xl overflow-hidden flex flex-col relative pb-20">
      {/* Enhanced Header */}
      <div className="px-6 py-6 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-300/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-300/10 to-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-300/10 to-pink-400/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="mr-4 hover:scale-110 transition-all duration-200 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                aria-label="Go to home"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-8 w-8 text-white/90" />
                <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
              </div>
            </div>
            {totalUnreadCount > 0 && (
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                <span className="text-sm font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {totalUnreadCount} new
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-focus-within:text-white/80 transition-colors duration-200" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-0 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all duration-300 text-base font-medium shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex justify-between items-center mt-4 text-white/80 text-sm">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {chats.length} conversation{chats.length !== 1 ? "s" : ""}
            </span>
            {friendChats.length > 0 && (
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-300" />
                {friendChats.length} friend{friendChats.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Friends Section */}
        {friendChats.length > 0 && (
          <>
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50/80 to-green-50/80 border-b border-emerald-100/50 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <Heart className="h-4 w-4" />
                Friends ({friendChats.length})
              </h3>
            </div>
            <div className="space-y-1">
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
            </div>
          </>
        )}

        {/* Regular Chats Section */}
        {regularChats.length > 0 && (
          <>
            {friendChats.length > 0 && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-b border-gray-100/50 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-3">
                  <MessageCircle className="h-4 w-4" />
                  Recent Chats ({regularChats.length})
                </h3>
              </div>
            )}
            <div className="space-y-1">
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
            </div>
          </>
        )}

        {/* Enhanced Empty State */}
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-center px-8 py-16">
            <div className="relative mb-8">
              <div className="text-8xl mb-4 transform hover:scale-110 transition-transform duration-300">
                {search ? "🔍" : "💬"}
              </div>
              {!search && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
              )}
            </div>
            <div className="bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm rounded-3xl p-8 border border-purple-100/50 shadow-xl max-w-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {search ? "No chats found" : "Start Your Journey"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {search
                  ? `No results for "${search}". Try searching with different keywords.`
                  : "Ready to meet amazing people? Your first conversation is just a tap away!"}
              </p>
              {!search && (
                <Button
                  onClick={() => navigate("/video-chat")}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Start Chatting
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
      className={`flex items-center p-5 cursor-pointer relative transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-50/60 hover:to-purple-50/60 hover:shadow-md transform hover:scale-[1.01] active:scale-[0.99] ${
        chat.isFriend
          ? "bg-gradient-to-r from-emerald-50/40 to-green-50/40"
          : "bg-white/60 backdrop-blur-sm"
      } ${
        chat.unreadCount > 0
          ? "bg-gradient-to-r from-violet-50/80 to-purple-50/80 border-l-4 border-violet-400 shadow-sm"
          : "border-b border-gray-100/30"
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
          className={`w-16 h-16 rounded-full object-cover shadow-md transition-all duration-300 border-3 ${
            chat.unreadCount > 0 ? "border-violet-300/50" : "border-white/70"
          }`}
        />

        {/* Unread Badge */}
        {chat.unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
            {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
          </div>
        )}

        {/* Online Status */}
        {chat.isFriend && chat.time === "Online" && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
        )}

        {/* Typing Indicator */}
        {chat.isTyping && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-sm">
            <div className="w-full h-full rounded-full bg-blue-400 animate-ping"></div>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h2
              className={`truncate transition-colors duration-200 ${
                chat.unreadCount > 0
                  ? "font-bold text-violet-700"
                  : "font-semibold text-gray-800"
              }`}
            >
              {chat.name}
            </h2>
            {chat.isFriend && (
              <span className="bg-gradient-to-r from-emerald-100/80 to-green-100/80 text-emerald-700 text-xs px-2 py-1 rounded-full font-semibold border border-emerald-200/50 backdrop-blur-sm flex-shrink-0">
                Friend
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ml-3 flex-shrink-0 ${
              chat.unreadCount > 0
                ? "text-violet-600 font-bold"
                : "text-gray-500"
            }`}
          >
            {chat.time}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {chat.isTyping ? (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm font-medium">typing...</span>
            </div>
          ) : (
            <p
              className={`text-sm truncate transition-colors duration-200 ${
                chat.unreadCount > 0
                  ? "text-gray-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              {chat.lastMessage}
            </p>
          )}
        </div>

        {/* Premium Feature: Last Seen */}
        {isPremium &&
          chat.lastSeen &&
          chat.time !== "Online" &&
          !chat.isTyping && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatLastSeen(chat.lastSeen)}
              </span>
            </div>
          )}
      </div>

      {/* Long Press Actions */}
      {longPressedChatId === chat.id && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className="text-xs font-semibold"
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setLongPressedChatId(null);
            }}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatPageWrapper;
