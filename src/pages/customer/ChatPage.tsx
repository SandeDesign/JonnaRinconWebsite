import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { MessageSquare, Send, Plus, HelpCircle, Check, CheckCheck, X } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, or, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  category: string;
  recipientGroup: 'jonna' | 'manager' | 'support';
  message: string;
  createdAt: Timestamp;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatThread {
  id: string;
  category: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
}

type RecipientGroup = 'jonna' | 'manager' | 'support';

const recipientGroups: Record<RecipientGroup, { name: string; icon: string; description: string }> = {
  jonna: {
    name: 'Jonna Rincon',
    icon: '🎵',
    description: 'Direct contact (artiest is druk, verwacht geen snel antwoord!)',
  },
  manager: {
    name: 'Manager',
    icon: '💼',
    description: 'Business inquiries, collaborations',
  },
  support: {
    name: 'Support Team',
    icon: '🆘',
    description: 'Questions, help and support',
  },
};

const categories = ['CATALOGUE', 'SHOP', 'SOCIAL MEDIA', 'DASHBOARD'];

const catalogueItems = ['Tracks', 'Remixes', 'Support'];
const shopItems = ['Beats', 'Services', 'Merchandise', 'Art'];
const socialMediaItems = ['Content', 'Collaboration'];
const dashboardItems = ['Orders', 'Downloads'];

const CustomerChat: React.FC = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup>('support');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  // Load all messages for this user
  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'supportMessages');
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
        const data = doc.data();
        msgs.push({
          id: doc.id,
          ...data,
          category: data.category || 'SUPPORT',
          recipientGroup: data.recipientGroup || 'support',
          status: data.status || 'sent',
        } as ChatMessage);
      });
      setAllMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  // Build threads for selected group
  useEffect(() => {
    if (!user) return;

    const groupMessages = allMessages.filter((msg) => msg.recipientGroup === selectedGroup);
    const threadMap = new Map<string, ChatThread>();

    groupMessages.forEach((msg) => {
      const threadId = msg.category;
      if (!threadMap.has(threadId)) {
        threadMap.set(threadId, {
          id: threadId,
          category: threadId,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.status !== 'read' && msg.senderId !== user.uid ? 1 : 0,
        });
      } else {
        const thread = threadMap.get(threadId)!;
        if ((msg.createdAt?.toMillis?.() || 0) > (thread.lastMessageTime?.toMillis?.() || 0)) {
          thread.lastMessage = msg.message;
          thread.lastMessageTime = msg.createdAt;
        }
        if (msg.status !== 'read' && msg.senderId !== user.uid) {
          thread.unreadCount++;
        }
      }
    });

    const sortedThreads = Array.from(threadMap.values()).sort(
      (a, b) => (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0)
    );

    setThreads(sortedThreads);
  }, [allMessages, selectedGroup, user]);

  // Load messages for selected thread
  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }

    const filtered = allMessages.filter(
      (msg) =>
        msg.category === selectedThread &&
        msg.recipientGroup === selectedGroup &&
        ((msg.senderId === user?.uid && msg.recipientGroup === selectedGroup) ||
          (msg.senderId !== user?.uid && msg.recipientGroup === selectedGroup))
    );

    setMessages(filtered);
  }, [selectedThread, selectedGroup, allMessages, user]);

  const handleSendMessage = async (e: React.FormEvent, category: string) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Customer',
        senderEmail: user.email,
        senderRole: 'customer',
        recipientGroup: selectedGroup,
        category: category,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        status: 'sent',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const createNewChat = (category: string) => {
    setSelectedThread(category);
    setShowCategoryPicker(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'read') return <CheckCheck size={14} className="text-blue-400" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-white/60" />;
    return <Check size={14} className="text-white/60" />;
  };

  return (
    <CustomerLayout>
      <div className="grid grid-cols-5 h-[calc(100vh-150px)] gap-4">
        {/* Personen Panel - Links */}
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.1]">
            <h2 className="font-semibold text-white text-sm">Chat With</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-3">
            {(Object.entries(recipientGroups) as [RecipientGroup, any][]).map(([key, group]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedGroup(key);
                  setSelectedThread(null);
                }}
                className={`w-full p-3 rounded-lg text-left transition ${
                  selectedGroup === key
                    ? 'bg-red-600/20 border border-red-600/40'
                    : 'bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-lg">{group.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-xs truncate">{group.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(group.description);
                    }}
                    className="p-0.5 hover:bg-white/[0.1] rounded-full transition"
                    title={group.description}
                  >
                    <HelpCircle size={12} className="text-white/40" />
                  </button>
                </div>
                <p className="text-[10px] text-white/40 line-clamp-2">{group.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Onderwerpen Panel - Midden */}
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.1] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Chats</h2>
            <div className="relative">
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="p-2 rounded-full hover:bg-white/[0.1] transition"
                title="Start new chat"
              >
                <Plus size={16} className="text-white/60" />
              </button>

              {showCategoryPicker && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/[0.2] rounded-lg p-2 z-50 min-w-max">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => createNewChat(cat)}
                      className="block w-full text-left px-3 py-2 text-xs text-white hover:bg-white/[0.1] rounded transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-xs">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
                <p>START EEN NIEUWE CHAT</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full p-2 rounded-lg text-left text-xs transition ${
                      selectedThread === thread.id
                        ? 'bg-white/[0.12] border border-white/[0.2]'
                        : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <p className="font-semibold text-white truncate">{thread.category}</p>
                    <p className="text-white/40 truncate">{thread.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Venster - Rechts */}
        {selectedThread ? (
          <div className="lg:col-span-3 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">
                    {recipientGroups[selectedGroup].name}
                  </p>
                  <p className="text-xs text-white/40">{selectedThread}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg ${
                        msg.senderId === user?.uid
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
                        {msg.senderId === user?.uid && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => handleSendMessage(e, selectedThread)}
              className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]"
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any, selectedThread)}
                  placeholder="Type a message..."
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
          <div className="lg:col-span-3 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerChat;
