import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MessageSquare, Send, Search, Filter, CheckCheck } from 'lucide-react';
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

const roleColor = (role: string) => {
  if (role === 'customer') return 'from-blue-500 to-cyan-500';
  if (role === 'artist') return 'from-purple-500 to-pink-500';
  return 'from-green-500 to-teal-500';
};

const roleBadge = (role: string) => {
  if (role === 'customer') return 'bg-blue-900/60 text-blue-300';
  if (role === 'artist') return 'bg-purple-900/60 text-purple-300';
  return 'bg-cyan-900/60 text-cyan-300';
};

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'artist' | 'manager'>('all');

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

  useEffect(() => {
    if (allMessages.length === 0) return;

    const userMap = new Map<string, UserConversation>();

    allMessages.forEach((msg) => {
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
        if ((msg.createdAt?.toMillis?.() || 0) > (existing.lastMessageTime?.toMillis?.() || 0)) {
          existing.lastMessage = msg.message;
          existing.lastMessageTime = msg.createdAt;
        }
      }
    });

    let convos = Array.from(userMap.values()).sort(
      (a, b) => (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0)
    );

    if (roleFilter !== 'all') convos = convos.filter((c) => c.userRole === roleFilter);
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

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    const filtered = allMessages
      .filter(
        (msg) =>
          msg.senderId === selectedUserId ||
          (msg.recipientId === selectedUserId && msg.senderRole === 'admin')
      )
      .sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0));

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
        <div>
          <h1 className="text-3xl font-bold text-white">Support Chat</h1>
          <p className="text-white/40 mt-2">Manage customer, artist, and manager communications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Messages', value: allMessages.length, color: 'text-white' },
            { label: 'Customers', value: allMessages.filter((m) => m.senderRole === 'customer').length, color: 'text-blue-400' },
            { label: 'Artists', value: allMessages.filter((m) => m.senderRole === 'artist').length, color: 'text-purple-400' },
            { label: 'Managers', value: allMessages.filter((m) => m.senderRole === 'manager').length, color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="backdrop-blur-lg bg-gradient-to-br from-white/[0.1] to-white/[0.04] border border-white/[0.15] rounded-xl p-4">
              <p className="text-white/40 text-sm">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.12] transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full pl-12 pr-4 py-3 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full text-white focus:outline-none focus:border-white/[0.3] appearance-none transition-all"
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
          <div className="lg:col-span-1 backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.1]">
              <h2 className="font-semibold text-white">Conversations ({conversations.length})</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 550px)' }}>
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-white/40">
                  <MessageSquare size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations found</p>
                </div>
              ) : (
                conversations.map((convo) => (
                  <button
                    key={convo.userId}
                    onClick={() => setSelectedUserId(convo.userId)}
                    className={`w-full px-4 py-3 text-left transition border-b border-white/[0.1] ${
                      selectedUserId === convo.userId
                        ? 'bg-white/[0.08] border-l-4 border-l-red-500'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleColor(convo.userRole)} flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm`}>
                        {convo.userName[0] || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-white text-sm truncate">{convo.userName}</p>
                          <span className="text-xs text-white/40">
                            {convo.lastMessageTime?.toDate?.()?.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) || ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs capitalize ${roleBadge(convo.userRole)}`}>
                            {convo.userRole}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 truncate">{convo.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 550px)' }}>
            {selectedUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const convo = conversations.find((c) => c.userId === selectedUserId);
                      return (
                        <>
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleColor(convo?.userRole || '')} flex items-center justify-center text-white font-semibold text-sm`}>
                            {convo?.userName[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{convo?.userName || 'User'}</p>
                            <p className="text-xs text-white/40">{convo?.userEmail || ''}</p>
                          </div>
                          <span className={`ml-auto px-3 py-1 rounded-full text-xs capitalize ${roleBadge(convo?.userRole || '')}`}>
                            {convo?.userRole}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-2 flex flex-col bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
                  {messages.length === 0 ? (
                    <div className="text-center text-white/40 py-12 m-auto">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'} mb-2`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-sm ${
                            msg.senderRole === 'admin'
                              ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-br-none shadow-lg'
                              : 'bg-gradient-to-br from-white/[0.15] to-white/[0.08] text-white rounded-bl-none border border-white/[0.15]'
                          }`}
                        >
                          {msg.senderRole !== 'admin' && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs">{msg.senderName}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] capitalize ${roleBadge(msg.senderRole)}`}>
                                {msg.senderRole}
                              </span>
                            </div>
                          )}
                          <p className="text-sm break-words">{msg.message}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs opacity-70 justify-end">
                            <span>
                              {msg.createdAt?.toDate?.()?.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) || 'Nu'}
                            </span>
                            {msg.senderRole === 'admin' && <CheckCheck size={12} />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]">
                  <div className="mb-2 text-xs text-white/40">
                    Replying to: <span className="text-white/70 font-semibold">{conversations.find((u) => u.userId === selectedUserId)?.userName}</span>
                  </div>
                  <div className="flex gap-3 items-end">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                      placeholder="Type your reply..."
                      className="flex-1 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.12] text-sm transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-white/[0.06] disabled:text-white/40 text-white rounded-full transition-all flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/40">
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
