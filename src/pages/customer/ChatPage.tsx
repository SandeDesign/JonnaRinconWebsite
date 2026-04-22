import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { MessageSquare, Send, Plus, Check, CheckCheck } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp, or } from 'firebase/firestore';
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
}

type RecipientGroup = 'jonna' | 'manager' | 'support';

const recipientGroups: Record<RecipientGroup, { name: string; emoji: string; description: string }> = {
  jonna: {
    name: 'Jonna Rincon',
    emoji: '🎵',
    description: 'Direct contact (artiest is druk, verwacht geen snel antwoord!)',
  },
  manager: {
    name: 'Manager',
    emoji: '💼',
    description: 'Business inquiries, collaborations',
  },
  support: {
    name: 'Support Team',
    emoji: '🆘',
    description: 'Questions, help and support',
  },
};

const categoryOptions = {
  CATALOGUE: ['Tracks', 'Remixes', 'Support'],
  SHOP: ['Beats', 'Services', 'Merchandise', 'Art'],
  'SOCIAL MEDIA': ['Content', 'Collaboration'],
  DASHBOARD: ['Orders', 'Downloads'],
};

const CustomerChat: React.FC = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup>('support');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

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
        });
      } else {
        const thread = threadMap.get(threadId)!;
        if ((msg.createdAt?.toMillis?.() || 0) > (thread.lastMessageTime?.toMillis?.() || 0)) {
          thread.lastMessage = msg.message;
          thread.lastMessageTime = msg.createdAt;
        }
      }
    });

    const sortedThreads = Array.from(threadMap.values()).sort(
      (a, b) => (b.lastMessageTime?.toMillis?.() || 0) - (a.lastMessageTime?.toMillis?.() || 0)
    );

    setThreads(sortedThreads);
  }, [allMessages, selectedGroup, user]);

  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }

    const filtered = allMessages.filter(
      (msg) =>
        msg.category === selectedThread &&
        msg.recipientGroup === selectedGroup &&
        ((msg.senderId === user?.uid) || (msg.senderId !== user?.uid))
    );

    setMessages(filtered);
  }, [selectedThread, selectedGroup, allMessages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedThread) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Customer',
        senderEmail: user.email,
        senderRole: 'customer',
        recipientGroup: selectedGroup,
        category: selectedThread,
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        status: 'sent',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewChat = (category: string) => {
    setSelectedThread(category);
    setShowCategoryPicker(false);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'read') return <CheckCheck size={12} className="text-blue-400" />;
    if (status === 'delivered') return <CheckCheck size={12} className="text-white/60" />;
    return <Check size={12} className="text-white/60" />;
  };

  return (
    <CustomerLayout>
      <div className="grid grid-cols-12 h-[calc(100vh-150px)] gap-3">
        {/* Kolom 1: Contactenlijst - 1 kolom */}
        <div className="col-span-1 backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.1]">
            <h2 className="font-semibold text-white text-xs">Contacts</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {(Object.entries(recipientGroups) as [RecipientGroup, any][]).map(([key, group]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedGroup(key);
                  setSelectedThread(null);
                }}
                className={`w-full p-3 rounded-lg text-center transition ${
                  selectedGroup === key
                    ? 'bg-red-600/30 border border-red-600/40'
                    : 'bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08]'
                }`}
                title={group.name}
              >
                <div className="text-2xl mb-1">{group.emoji}</div>
                <p className="text-[10px] text-white truncate">{group.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Kolom 2: Chats - 3 kolommen */}
        <div className="col-span-3 backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.1] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Chats</h2>
            <div className="relative">
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="p-1.5 rounded-full hover:bg-white/[0.1] transition"
                title="New chat"
              >
                <Plus size={16} className="text-white/60" />
              </button>

              {showCategoryPicker && (
                <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/[0.2] rounded-lg p-1 z-50 min-w-max">
                  {Object.entries(categoryOptions).map(([category, items]) => (
                    <div key={category}>
                      <p className="text-xs text-white/40 px-2 py-1 font-semibold">{category}</p>
                      {items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleNewChat(item)}
                          className="block w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/[0.1] rounded transition"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-xs">
                <MessageSquare size={20} className="mx-auto mb-2 opacity-50" />
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
                        ? 'bg-white/[0.12] border border-red-600/40'
                        : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <p className="font-semibold text-white truncate">{thread.category}</p>
                    <p className="text-white/40 truncate text-[11px]">{thread.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kolom 3: Chat Window - 8 kolommen */}
        {selectedThread ? (
          <div className="col-span-8 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
              <p className="font-semibold text-white">{recipientGroups[selectedGroup].name}</p>
              <p className="text-xs text-white/40">{selectedThread}</p>
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
                  <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
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
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  placeholder="Type message..."
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
          <div className="col-span-8 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl flex items-center justify-center">
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
