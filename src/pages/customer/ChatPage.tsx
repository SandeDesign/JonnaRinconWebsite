import React, { useState, useEffect, useRef } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { MessageSquare, Send, User, Check, CheckCheck, Search } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, or } from 'firebase/firestore';
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

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
}

const CustomerChat: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  // Load ALL messages (sent and received)
  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'supportMessages');

    // Query for messages where user is sender OR recipient
    const q = query(
      messagesRef,
      or(
        where('senderId', '==', user.uid),
        where('recipientId', '==', user.uid)
      ),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setAllMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  // Build conversations from all messages
  useEffect(() => {
    if (!user || allMessages.length === 0) return;

    const conversationMap = new Map<string, Conversation>();

    allMessages.forEach((msg) => {
      // Determine the other person in the conversation
      const otherUserId = msg.senderId === user.uid ? msg.recipientId : msg.senderId;
      if (!otherUserId) return;

      const otherUserName = msg.senderId === user.uid ? 'Support' : msg.senderName;
      const otherUserEmail = msg.senderId === user.uid ? '' : msg.senderEmail;

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          userEmail: otherUserEmail,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      } else {
        const existing = conversationMap.get(otherUserId)!;
        // Update if this message is newer
        if ((msg.createdAt?.toMillis?.() || 0) > (existing.lastMessageTime?.toMillis?.() || 0)) {
          existing.lastMessage = msg.message;
          existing.lastMessageTime = msg.createdAt;
        }
      }
    });

    const convos = Array.from(conversationMap.values()).sort(
      (a, b) => (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0)
    );

    setConversations(convos);

    // Auto-select first conversation if none selected
    if (!selectedConversation && convos.length > 0) {
      setSelectedConversation(convos[0].userId);
    }
  }, [allMessages, user, selectedConversation]);

  // Filter messages for selected conversation
  useEffect(() => {
    if (!selectedConversation || !user) {
      setMessages([]);
      return;
    }

    const filtered = allMessages.filter(
      (msg) =>
        (msg.senderId === user.uid && msg.recipientId === selectedConversation) ||
        (msg.senderId === selectedConversation && msg.recipientId === user.uid) ||
        (msg.senderId === selectedConversation && !msg.recipientId) || // Messages from admin without recipient
        (msg.senderId === user.uid && !msg.recipientId) // Messages from user without recipient
    );

    setMessages(filtered);
  }, [selectedConversation, allMessages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Customer',
        senderEmail: user.email,
        senderRole: 'customer',
        recipientId: selectedConversation,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // If no conversations, show welcome screen
  if (conversations.length === 0) {
    return (
      <CustomerLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Support Chat</h1>
            <p className="text-white/40 mt-2">Get help from the Jonna Rincon team</p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl p-12 text-center">
            <MessageSquare size={64} className="mx-auto mb-4 text-white/20" />
            <h2 className="text-2xl font-bold text-white mb-2">No conversations yet</h2>
            <p className="text-white/40 mb-6">
              Start a conversation with our support team by sending a message below
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMessage.trim() || !user) return;

                try {
                  // Send message to general support (no specific recipient)
                  await addDoc(collection(db, 'supportMessages'), {
                    senderId: user.uid,
                    senderName: user.displayName || 'Customer',
                    senderEmail: user.email,
                    senderRole: 'customer',
                    message: newMessage.trim(),
                    createdAt: serverTimestamp(),
                  });
                  setNewMessage('');
                } catch (error) {
                  console.error('Failed to send message:', error);
                }
              }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to support..."
                  className="flex-1 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-red-500 focus:bg-white/[0.12] transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-6 py-3 rounded-full text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Chat</h1>
          <p className="text-white/40 mt-2">Get help from the Jonna Rincon team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations Sidebar */}
          <div className="lg:col-span-1 backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.1]">
              <h2 className="font-semibold text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              {conversations.map((convo) => (
                <button
                  key={convo.userId}
                  onClick={() => setSelectedConversation(convo.userId)}
                  className={`w-full px-4 py-3 text-left transition border-b border-white/[0.1] ${
                    selectedConversation === convo.userId
                      ? 'bg-white/[0.08] border-l-4 border-l-red-500'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                      {convo.userName[0] || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-white text-sm truncate">
                          {convo.userName}
                        </p>
                        <span className="text-xs text-white/40">
                          {convo.lastMessageTime?.toDate?.()?.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) || ''}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 truncate">{convo.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 300px)' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                  {conversations.find((c) => c.userId === selectedConversation)?.userName[0] || 'S'}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {conversations.find((c) => c.userId === selectedConversation)?.userName || 'Support'}
                  </p>
                  <p className="text-xs text-white/40">
                    {conversations.find((c) => c.userId === selectedConversation)?.userEmail || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages - WhatsApp Style */}
            <div className="flex-1 p-6 overflow-y-auto space-y-2 flex flex-col bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-white/40 py-12 m-auto">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl backdrop-blur-sm ${
                        msg.senderId === user?.uid
                          ? 'bg-gradient-to-br from-red-600 to-orange-600 text-white rounded-br-none shadow-lg'
                          : 'bg-gradient-to-br from-white/[0.15] to-white/[0.08] text-white rounded-bl-none border border-white/[0.15]'
                      }`}
                    >
                      {msg.senderId !== user?.uid && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-xs">
                            {msg.senderName}
                          </span>
                          {msg.senderRole && (
                            <span className="px-1.5 py-0.5 bg-white/[0.2] rounded text-[10px] capitalize">
                              {msg.senderRole}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm break-words">
                        {msg.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-70 justify-end">
                        <span>
                          {msg.createdAt?.toDate?.()?.toLocaleTimeString('nl-NL', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.senderId === user?.uid && (
                          <CheckCheck size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input - WhatsApp Style */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]">
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  placeholder="Type a message..."
                  className="flex-1 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.12] text-sm resize-none transition-all"
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
          </div>
        </div>

        {/* Info Box */}
        <div className="backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/10 border border-red-600/30 rounded-xl p-4">
          <p className="text-sm text-white/70">
            💬 <strong className="text-white">Support Hours:</strong> Our team typically responds within 24 hours during business days.
            For urgent matters, please include "URGENT" in your message.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerChat;
