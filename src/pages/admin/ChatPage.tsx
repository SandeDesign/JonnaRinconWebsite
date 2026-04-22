import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MessageSquare, Send, Check, CheckCheck, Search, Filter } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  category?: string;
  recipientId?: string;
  message: string;
  createdAt: Timestamp;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
}

const AdminChat: React.FC = () => {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
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
        msgs.push({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || 'sent',
        } as ChatMessage);
      });
      setAllMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  // Build conversations
  useEffect(() => {
    if (allMessages.length === 0) return;

    const userMap = new Map<string, Conversation>();

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
          c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setConversations(convos);
  }, [allMessages, roleFilter, searchTerm]);

  // Load messages for selected user
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
        status: 'sent',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'read') return <CheckCheck size={14} className="text-blue-400" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-white/60" />;
    return <Check size={14} className="text-white/60" />;
  };

  const getRoleColor = (role: string) => {
    if (role === 'customer') return 'from-blue-500 to-cyan-500';
    if (role === 'artist') return 'from-purple-500 to-pink-500';
    return 'from-green-500 to-teal-500';
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-5 h-[calc(100vh-250px)] gap-4">
        {/* Conversations Panel - Links */}
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.1] space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/40" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 bg-white/[0.08] border border-white/[0.15] rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-2 py-1 bg-white/[0.08] border border-white/[0.15] rounded text-xs text-white focus:outline-none"
            >
              <option value="all">All</option>
              <option value="customer">Customers</option>
              <option value="artist">Artists</option>
              <option value="manager">Managers</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {conversations.map((convo) => (
              <button
                key={convo.userId}
                onClick={() => setSelectedUserId(convo.userId)}
                className={`w-full p-2 rounded-lg text-left text-xs transition ${
                  selectedUserId === convo.userId
                    ? 'bg-white/[0.12] border border-red-600/40'
                    : 'hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-r ${getRoleColor(convo.userRole)} flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0`}
                  >
                    {convo.userName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-xs">{convo.userName}</p>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 truncate">{convo.lastMessage}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel - Rechts */}
        {selectedUserId ? (
          <div className="lg:col-span-4 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRoleColor(
                      conversations.find((c) => c.userId === selectedUserId)?.userRole || ''
                    )} flex items-center justify-center text-white font-semibold`}
                  >
                    {conversations.find((c) => c.userId === selectedUserId)?.userName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {conversations.find((c) => c.userId === selectedUserId)?.userName}
                    </p>
                    <p className="text-xs text-white/40">
                      {conversations.find((c) => c.userId === selectedUserId)?.userEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.senderRole === 'admin'
                          ? 'bg-red-600 text-white rounded-br-none'
                          : 'bg-white/[0.15] text-white rounded-bl-none border border-white/[0.15]'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end text-xs opacity-70">
                        <span>
                          {msg.createdAt?.toDate?.()?.toLocaleTimeString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.senderRole === 'admin' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  placeholder="Type reply..."
                  className="flex-1 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3] text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-red-600 hover:bg-red-700 disabled:bg-white/[0.06] text-white rounded-full transition flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-4 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
