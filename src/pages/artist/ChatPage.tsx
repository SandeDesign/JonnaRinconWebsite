import React, { useState, useEffect } from 'react';
import ArtistLayout from '../../components/artist/ArtistLayout';
import { MessageSquare, Send, Check, CheckCheck } from 'lucide-react';
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
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
}

const ArtistChat: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, 'supportMessages');
    const q = query(
      messagesRef,
      or(where('senderId', '==', user.uid), where('recipientId', '==', user.uid)),
      orderBy('createdAt', 'asc')
    );

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
  }, [user]);

  useEffect(() => {
    if (!user || allMessages.length === 0) return;

    const conversationMap = new Map<string, Conversation>();

    allMessages.forEach((msg) => {
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
        });
      } else {
        const existing = conversationMap.get(otherUserId)!;
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
  }, [allMessages, user]);

  useEffect(() => {
    if (!selectedUserId || !user) {
      setMessages([]);
      return;
    }

    const filtered = allMessages.filter(
      (msg) =>
        (msg.senderId === user.uid && msg.recipientId === selectedUserId) ||
        (msg.senderId === selectedUserId && msg.recipientId === user.uid) ||
        (msg.senderId === selectedUserId && !msg.recipientId) ||
        (msg.senderId === user.uid && !msg.recipientId)
    );

    setMessages(filtered);
  }, [selectedUserId, allMessages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUserId) return;

    try {
      await addDoc(collection(db, 'supportMessages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Artist',
        senderEmail: user.email,
        senderRole: 'artist',
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

  return (
    <ArtistLayout>
      <div className="grid grid-cols-5 h-[calc(100vh-250px)] gap-4">
        {/* Conversations */}
        <div className="backdrop-blur-xl bg-gradient-to-b from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/[0.1]">
            <h2 className="font-semibold text-white text-sm">Support</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {conversations.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-4">No messages</p>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.userId}
                  onClick={() => setSelectedUserId(convo.userId)}
                  className={`w-full p-2 rounded-lg text-left text-xs transition ${
                    selectedUserId === convo.userId
                      ? 'bg-white/[0.12] border border-red-600/40'
                      : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <p className="font-semibold text-white truncate">{convo.userName}</p>
                  <p className="text-white/40 truncate">{convo.lastMessage}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        {selectedUserId ? (
          <div className="lg:col-span-4 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/[0.1] backdrop-blur-lg bg-gradient-to-r from-red-600/15 to-orange-600/15">
              <p className="font-semibold text-white">
                {conversations.find((c) => c.userId === selectedUserId)?.userName}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-white/40 py-8">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Start the conversation</p>
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
          <div className="lg:col-span-4 backdrop-blur-xl bg-gradient-to-br from-white/[0.12] to-white/[0.05] border border-white/[0.2] rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </ArtistLayout>
  );
};

export default ArtistChat;
