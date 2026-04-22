import React, { useState, useEffect } from 'react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { MessageSquare, Send, Check, CheckCheck, Search } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  message: string;
  createdAt: Timestamp;
  status: 'sent' | 'delivered' | 'read';
}

const ManagerChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const messagesRef = collection(db, 'collaborationMessages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || 'sent',
        } as ChatMessage);
      });
      setMessages(msgs);
      setAllMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'collaborationMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Manager',
        senderEmail: user.email,
        senderRole: 'manager',
        message: newMessage.trim(),
        createdAt: serverTimestamp(),
        status: 'sent',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredMessages = allMessages.filter(
    (msg) =>
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    if (status === 'read') return <CheckCheck size={14} className="text-blue-400" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-white/60" />;
    return <Check size={14} className="text-white/60" />;
  };

  return (
    <ManagerLayout>
      <div className="flex flex-col h-[calc(100vh-250px)] gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.1]">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-white/40" size={14} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-8 pr-3 py-1.5 bg-white/[0.08] border border-white/[0.15] rounded-full text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3]"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-white/40 py-8">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.senderId === user?.uid
                        ? 'bg-red-600 text-white rounded-br-none'
                        : 'bg-white/[0.15] text-white rounded-bl-none border border-white/[0.15]'
                    }`}
                  >
                    {msg.senderId !== user?.uid && (
                      <p className="text-xs font-semibold text-white mb-1">{msg.senderName}</p>
                    )}
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
      </div>
    </ManagerLayout>
  );
};

export default ManagerChat;
