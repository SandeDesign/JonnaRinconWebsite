import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MessageSquare, Send, Search, Filter, User } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  recipientId?: string;
  message: string;
  createdAt: Timestamp;
}

interface UserConversation {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
}

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'artist' | 'manager'>('all');

  // Load all messages
  useEffect(() => {
    const messagesRef = collection(db, 'supportMessages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setAllMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // Build conversations from messages
  useEffect(() => {
    if (allMessages.length === 0) return;

    const userMap = new Map<string, UserConversation>();

    allMessages.forEach((msg) => {
      // Skip messages sent by admin
      if (msg.senderRole === 'admin') return;

      const userId = msg.senderId;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          userName: msg.senderName,
          userEmail: msg.senderEmail,
          userRole: msg.senderRole,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      } else {
        const existing = userMap.get(userId)!;
        if (msg.createdAt.toMillis() > existing.lastMessageTime.toMillis()) {
          existing.lastMessage = msg.message;
          existing.lastMessageTime = msg.createdAt;
        }
      }
    });

    let convos = Array.from(userMap.values()).sort(
      (a, b) => b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis()
    );

    // Apply role filter
    if (roleFilter !== 'all') {
      convos = convos.filter((c) => c.userRole === roleFilter);
    }

    // Apply search filter
    if (searchTerm) {
      convos = convos.filter(
        (c) =>
          c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setConversations(convos);
  }, [allMessages, roleFilter, searchTerm]);

  // Filter messages for selected user
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const filtered = allMessages
      .filter(
        (msg) =>
          (msg.senderId === selectedUserId) ||
          (msg.recipientId === selectedUserId && msg.senderRole === 'admin')
      )
      .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

    setMessages(filtered);
  }, [selectedUserId, allMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUserId) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Admin',
        senderEmail: user.email,
        senderRole: 'admin',
        recipientId: selectedUserId,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Support Chat</h1>
          <p className="text-gray-400 mt-2">Manage customer, artist, and manager communications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Messages</p>
            <p className="text-2xl font-bold text-white mt-1">{allMessages.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Customers</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {allMessages.filter((m) => m.senderRole === 'customer').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Artists</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {allMessages.filter((m) => m.senderRole === 'artist').length}
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Managers</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">
              {allMessages.filter((m) => m.senderRole === 'manager').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="artist">Artists</option>
              <option value="manager">Managers</option>
            </select>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white">Conversations ({conversations.length})</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.userId}
                    onClick={() => setSelectedUserId(convo.userId)}
                    className={`w-full p-4 text-left transition border-b border-gray-700 ${
                      selectedUserId === convo.userId
                        ? 'bg-purple-900/30 border-l-4 border-l-purple-500'
                        : 'hover:bg-gray-750'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                          convo.userRole === 'customer'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : convo.userRole === 'artist'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-green-500 to-teal-500'
                        }`}
                      >
                        {convo.userName[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-white text-sm truncate">{convo.userName}</p>
                          <span className="text-xs text-gray-400">
                            {convo.lastMessageTime?.toDate?.()?.toLocaleDateString() || ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs capitalize ${
                              convo.userRole === 'customer'
                                ? 'bg-blue-900 text-blue-300'
                                : convo.userRole === 'artist'
                                ? 'bg-purple-900 text-purple-300'
                                : 'bg-cyan-900 text-cyan-300'
                            }`}
                          >
                            {convo.userRole}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div
            className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col"
            style={{ height: 'calc(100vh - 450px)' }}
          >
            {selectedUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-750">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const convo = conversations.find((c) => c.userId === selectedUserId);
                      return (
                        <>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                              convo?.userRole === 'customer'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                : convo?.userRole === 'artist'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                : 'bg-gradient-to-r from-green-500 to-teal-500'
                            }`}
                          >
                            {convo?.userName[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{convo?.userName || 'User'}</p>
                            <p className="text-xs text-gray-400">{convo?.userEmail || ''}</p>
                          </div>
                          <span
                            className={`ml-auto px-3 py-1 rounded text-xs capitalize ${
                              convo?.userRole === 'customer'
                                ? 'bg-blue-900 text-blue-300'
                                : convo?.userRole === 'artist'
                                ? 'bg-purple-900 text-purple-300'
                                : 'bg-cyan-900 text-cyan-300'
                            }`}
                          >
                            {convo?.userRole}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-lg ${
                          msg.senderRole === 'admin' ? 'bg-purple-900/30 ml-12' : 'bg-gray-700 mr-12'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold text-white">
                              {msg.senderRole === 'admin' ? 'You (Admin)' : msg.senderName}
                            </span>
                            <span
                              className={`ml-2 px-2 py-0.5 rounded text-xs capitalize ${
                                msg.senderRole === 'customer'
                                  ? 'bg-blue-600 text-blue-100'
                                  : msg.senderRole === 'artist'
                                  ? 'bg-purple-600 text-purple-100'
                                  : msg.senderRole === 'manager'
                                  ? 'bg-cyan-600 text-cyan-100'
                                  : 'bg-gray-600 text-gray-100'
                              }`}
                            >
                              {msg.senderRole}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {msg.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                          </span>
                        </div>
                        <p className="text-gray-300">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-750">
                  <div className="mb-2 text-sm text-gray-400">
                    Replying to:{' '}
                    <span className="text-white font-semibold">
                      {conversations.find((u) => u.userId === selectedUserId)?.userName}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={20} />
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-xl">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
