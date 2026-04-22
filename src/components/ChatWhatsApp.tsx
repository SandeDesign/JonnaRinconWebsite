import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Check, CheckCheck, Plus, ChevronRight, MessageCircle, HelpCircle, Settings } from 'lucide-react';
import { ChatConversation, ChatMessage, ChatPersonality } from '../lib/firebase/types';

const PERSONALITIES: Record<ChatPersonality, { name: string; description: string; avatar?: string; color: string }> = {
  jonna: {
    name: 'Jonna Rincon',
    description: 'Direct contact (ik ben druk bezig, dus verwacht geen snel antwoord!)',
    avatar: '/JEIGHTENESIS.png', // Assuming this exists
    color: 'from-red-600 to-orange-600',
  },
  manager: {
    name: 'Manager',
    description: 'Business inquiries & professional requests',
    color: 'from-blue-600 to-cyan-600',
  },
  support: {
    name: 'Support Team',
    description: 'Questions, help and support',
    color: 'from-green-600 to-emerald-600',
  },
};

interface ChatWhatsAppProps {
  currentUser?: { uid: string; email: string; displayName?: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatWhatsApp: React.FC<ChatWhatsAppProps> = ({ currentUser, isOpen, onClose }) => {
  const [selectedPersonality, setSelectedPersonality] = useState<ChatPersonality>('support');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations by personality
  const filteredConversations = conversations.filter(
    (conv) => conv.personalities.includes(selectedPersonality) &&
             (conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              conv.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: 'admin',
      senderName: PERSONALITIES[selectedPersonality].name,
      personality: selectedPersonality,
      content: newMessage,
      timestamp: new Date() as any,
      status: 'sent',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const renderMessageStatus = (status: string) => {
    if (status === 'read') return <CheckCheck size={14} className="text-blue-400" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-white/40" />;
    return <Check size={14} className="text-white/40" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[90vh] bg-white/[0.08] backdrop-blur-2xl border border-white/[0.1] rounded-3xl overflow-hidden flex">
        {/* Left Sidebar - Personalities */}
        <div className="w-64 border-r border-white/[0.1] bg-white/[0.04] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/[0.1]">
            <h2 className="text-lg font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-full text-sm text-white placeholder-white/40 outline-none"
              />
            </div>
          </div>

          {/* Personalities List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(PERSONALITIES).map(([key, personality]) => (
              <button
                key={key}
                onClick={() => setSelectedPersonality(key as ChatPersonality)}
                className={`w-full px-4 py-3 border-b border-white/[0.06] text-left transition-all ${
                  selectedPersonality === key
                    ? 'bg-white/[0.1] border-l-4 border-l-red-500'
                    : 'hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {personality.avatar ? (
                    <img src={personality.avatar} alt={personality.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${personality.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold text-xs">{personality.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{personality.name}</p>
                    <p className="text-xs text-white/40 truncate">{personality.description}</p>
                  </div>
                  <HelpCircle size={14} className="text-white/40 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-t border-white/[0.1]">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={18} />
              START NIEUWE CHAT
            </button>
          </div>
        </div>

        {/* Middle Section - Conversations List */}
        <div className="w-72 border-r border-white/[0.1] bg-white/[0.06] flex flex-col max-h-full">
          <div className="p-4 border-b border-white/[0.1]">
            <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">
              {PERSONALITIES[selectedPersonality].name.toUpperCase()}
            </p>
            <p className="text-xs text-white/40 mt-1">{filteredConversations.length} conversations</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-white/40 text-sm">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                <p>No conversations yet</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full px-4 py-3 border-b border-white/[0.06] text-left transition-all ${
                    selectedConversation?.id === conv.id
                      ? 'bg-white/[0.1]'
                      : 'hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.1] flex-shrink-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{conv.userName?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{conv.userName || conv.userEmail}</p>
                      <p className="text-xs text-white/40 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      <p className="text-[10px] text-white/30 mt-1">{conv.category}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{conv.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Section - Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-white/[0.1] bg-white/[0.06] px-6 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{selectedConversation.userName || selectedConversation.userEmail}</p>
                  <p className="text-xs text-white/40 mt-1">{selectedConversation.category}</p>
                </div>
                <button className="p-2 hover:bg-white/[0.1] rounded-lg transition-all">
                  <MoreVertical size={18} className="text-white/40 hover:text-white" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <MessageCircle size={40} className="mx-auto text-white/20 mb-2" />
                      <p className="text-white/40 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                          msg.senderId === 'admin'
                            ? 'bg-red-600 text-white rounded-br-none'
                            : 'bg-white/[0.1] text-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          msg.senderId === 'admin' ? 'text-white/60' : 'text-white/40'
                        }`}>
                          <span>
                            {new Date((msg.timestamp as any).seconds * 1000).toLocaleTimeString('nl-NL', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {msg.senderId === 'admin' && renderMessageStatus(msg.status)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="h-20 border-t border-white/[0.1] bg-white/[0.04] px-6 py-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white/[0.06] border border-white/[0.1] rounded-full px-4 py-2 text-white placeholder-white/40 outline-none text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-red-600 hover:bg-red-700 disabled:bg-white/[0.06] disabled:text-white/40 text-white rounded-full transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <MessageCircle size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/40">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/[0.1] rounded-full text-white/60 hover:text-white transition-all z-10"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ChatWhatsApp;
