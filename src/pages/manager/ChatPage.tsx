import React, { useState, useEffect } from 'react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { MessageSquare, Send, Search, CheckCheck } from 'lucide-react';
import { db } from '../../lib/firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id?: string;
  collaborationId?: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  message: string;
  createdAt: Timestamp;
}

const ManagerChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, 'collaborationMessages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setMessages(msgs);
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
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Chat</h1>
          <p className="text-white/40 mt-2">Communicate with artists and team</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-12 pr-4 py-3 backdrop-blur-sm bg-white/[0.08] border border-white/[0.15] rounded-full text-white placeholder-white/40 focus:outline-none focus:border-white/[0.3] focus:bg-white/[0.12] transition-all"
          />
        </div>

        {/* Chat Container */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 400px)' }}>
          {/* Messages List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-2 flex flex-col bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-white/40 py-12 m-auto">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
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
                        <span className="font-semibold text-xs">{msg.senderName}</span>
                        {msg.senderRole && (
                          <span className="px-1.5 py-0.5 bg-white/[0.2] rounded text-[10px] capitalize">
                            {msg.senderRole}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs opacity-70 justify-end">
                      <span>
                        {msg.createdAt?.toDate?.()?.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === user?.uid && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.1] backdrop-blur-lg bg-gradient-to-t from-white/[0.08] to-white/[0.04]">
            <div className="flex gap-3 items-end">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e as any)}
                placeholder="Type your message..."
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
        </div>

        {/* Info Box */}
        <div className="backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/10 border border-red-600/30 rounded-xl p-4">
          <p className="text-sm text-white/70">
            💬 <strong className="text-white">Manager Chat Access:</strong> You can view and send messages across all collaborations. Use this to coordinate with artists and the team.
          </p>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerChat;
