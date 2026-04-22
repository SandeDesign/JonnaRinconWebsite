import React, { useState, useEffect, useRef } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { MessageSquare, Send, Plus, Check, CheckCheck, Info, Briefcase, Headphones } from 'lucide-react';
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

const recipientGroups: Record<RecipientGroup, { name: string; description: string }> = {
  jonna: {
    name: 'Jonna Rincon',
    description: 'Direct contact — artiest is veel bezig, verwacht geen snel antwoord!',
  },
  manager: {
    name: 'Manager',
    description: 'Business inquiries, collaborations & partnerships',
  },
  support: {
    name: 'Support Team',
    description: 'Questions, help and support',
  },
};

const categoryOptions: Record<string, string[]> = {
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
  const [tooltipOpen, setTooltipOpen] = useState<RecipientGroup | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

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
          category: data.category || 'General',
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
      (msg) => msg.category === selectedThread && msg.recipientGroup === selectedGroup
    );

    setMessages(filtered);
  }, [selectedThread, selectedGroup, allMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowCategoryPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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

  const ContactAvatar = ({ group }: { group: RecipientGroup }) => {
    if (group === 'jonna') {
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
          <img src="/JEIGHTENESIS.jpg" alt="Jonna Rincon" className="w-full h-full object-cover object-top" />
        </div>
      );
    }
    if (group === 'manager') {
      return (
        <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center">
          <Briefcase size={20} className="text-white/70" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full flex-shrink-0 bg-gradient-to-br from-red-900/60 to-neutral-900 border border-red-500/20 flex items-center justify-center">
        <Headphones size={20} className="text-red-400/80" />
      </div>
    );
  };

  return (
    <CustomerLayout>
      <div className="grid grid-cols-12 h-[calc(100vh-120px)] gap-3">

        {/* Column 1: Contacts */}
        <div className="col-span-2 backdrop-blur-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.08] flex-shrink-0">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Contacts</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {(Object.entries(recipientGroups) as [RecipientGroup, any][]).map(([key, group]) => (
              <div key={key} className="relative">
                <button
                  onClick={() => {
                    setSelectedGroup(key);
                    setSelectedThread(null);
                    setTooltipOpen(null);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 group ${
                    selectedGroup === key
                      ? 'bg-red-600/20 border border-red-600/30'
                      : 'hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <ContactAvatar group={key} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{group.name}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTooltipOpen(tooltipOpen === key ? null : key);
                    }}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Info size={14} className="text-white/40 hover:text-white/70" />
                  </button>
                </button>

                {/* Tooltip */}
                {tooltipOpen === key && (
                  <div className="absolute left-full top-0 ml-2 z-50 w-52 bg-black/90 backdrop-blur-xl border border-white/[0.15] rounded-xl p-3 shadow-2xl">
                    <p className="text-xs font-semibold text-white mb-1">{group.name}</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">{group.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Threads */}
        <div className="col-span-3 backdrop-blur-xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.08] flex items-center justify-between flex-shrink-0">
            <p className="text-sm font-semibold text-white">{recipientGroups[selectedGroup].name}</p>
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowCategoryPicker(!showCategoryPicker)}
                className="w-7 h-7 rounded-full bg-red-600/20 hover:bg-red-600/40 border border-red-600/30 flex items-center justify-center transition-colors"
              >
                <Plus size={14} className="text-red-400" />
              </button>

              {showCategoryPicker && (
                <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/[0.15] rounded-xl p-2 z-50 w-44 shadow-2xl">
                  {Object.entries(categoryOptions).map(([group, items]) => (
                    <div key={group}>
                      <p className="text-[10px] text-white/30 px-2 py-1.5 font-semibold uppercase tracking-widest">{group}</p>
                      {items.map((item) => (
                        <button
                          key={item}
                          onClick={() => handleNewChat(item)}
                          className="block w-full text-left px-2 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/[0.08] rounded-lg transition"
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
              <div className="p-4 text-center text-white/30 py-10">
                <MessageSquare size={24} className="mx-auto mb-3 opacity-40" />
                <p className="text-[11px] font-semibold uppercase tracking-widest leading-relaxed">
                  Start een<br />nieuwe chat
                </p>
              </div>
            ) : (
              <div className="py-1">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full px-3 py-3 text-left transition-all border-b border-white/[0.04] ${
                      selectedThread === thread.id
                        ? 'bg-white/[0.08]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      {selectedThread === thread.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                      <p className="text-xs font-semibold text-white truncate">{thread.category}</p>
                    </div>
                    <p className="text-[11px] text-white/40 truncate pl-3.5">{thread.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Chat window */}
        {selectedThread ? (
          <div className="col-span-7 backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.12] rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center gap-3 flex-shrink-0 bg-white/[0.04]">
              <ContactAvatar group={selectedGroup} />
              <div>
                <p className="font-semibold text-white text-sm">{recipientGroups[selectedGroup].name}</p>
                <p className="text-[11px] text-white/40">{selectedThread}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-white/30 py-16">
                  <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-sm px-3 py-2 rounded-xl text-sm ${
                        msg.senderId === user?.uid
                          ? 'bg-red-600 text-white rounded-br-sm'
                          : 'bg-white/[0.1] text-white rounded-bl-sm border border-white/[0.1]'
                      }`}
                    >
                      <p className="break-words leading-relaxed">{msg.message}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className="text-[10px] opacity-60">
                          {msg.createdAt?.toDate?.()?.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.senderId === user?.uid && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.03] flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-full px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/[0.25] text-sm"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-9 h-9 bg-red-600 hover:bg-red-700 disabled:bg-white/[0.06] text-white rounded-full transition flex items-center justify-center flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="col-span-7 backdrop-blur-xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border border-white/[0.12] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto mb-3 text-white/10" />
              <p className="text-white/30 text-sm">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default CustomerChat;
