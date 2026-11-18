'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { mockConversations } from '@/lib/mockStudentData';
import { messagingApi } from '@/lib/api';
import {
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  CheckCheck,
  Circle,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';

export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState(mockConversations[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    async function loadConversations() {
      try {
        const res = await messagingApi.getConversations();
        if (res.data?.data && res.data.data.length > 0) {
          const liveConvs = res.data.data.map(msg => ({
            id: msg.conversationId,
            user: {
              id: msg.sender?.id,
              name: [msg.sender?.profile?.firstName, msg.sender?.profile?.lastName].filter(Boolean).join(' ') || 'User',
              role: 'Member',
              avatar: msg.sender?.profile?.avatar || '/images/default-avatar.png',
              isOnline: false,
            },
            lastMessage: msg.content,
            lastMessageTime: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unreadCount: msg.isRead ? 0 : 1,
            messages: [],
          }));
          setConversations(liveConvs);
          if (liveConvs.length > 0) setActiveConvId(liveConvs[0].id);
        }
      } catch {
        // Keep mock data
      }
    }
    loadConversations();
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    async function loadMessages() {
      try {
        const res = await messagingApi.getMessages(activeConvId);
        if (res.data?.data) {
          setConversations(prev =>
            prev.map(c => {
              if (c.id === activeConvId) {
                return {
                  ...c,
                  messages: res.data.data.map(m => ({
                    id: m.id,
                    senderId: m.senderId,
                    text: m.content,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  })),
                };
              }
              return c;
            })
          );
        }
      } catch {
        // Keep existing messages
      }
    }
    loadMessages();
  }, [activeConvId]);

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'usr-student-01',
      text: messageInput.trim(),
      time: 'Just now',
    };

    // Optimistic local update
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: newMessage.text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    const msgText = messageInput.trim();
    setMessageInput('');

    try {
      const recipientId = activeConv?.user?.id || activeConvId;
      await messagingApi.sendMessage(activeConvId, recipientId, msgText);
    } catch {
      // Message already shown optimistically
    }
  };

  const selectConversation = (id) => {
    setActiveConvId(id);
    setMobileThreadOpen(true);
    // Mark unread as 0
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Chat Application Container */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[580px] flex">
          {/* Conversation List Sidebar */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-slate-50/50 ${
              mobileThreadOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Sidebar Header & Search */}
            <div className="p-4 border-b border-border bg-white space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Messages
                </h1>
                <Badge variant="outline" className="text-xs">
                  {conversations.length} Active
                </Badge>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50/70 border-l-4 border-l-primary'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    {/* User Avatar with status indicator */}
                    <div className="relative flex-shrink-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border bg-white">
                        <Image
                          src={conv.user.avatar}
                          alt={conv.user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {conv.user.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {conv.user.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.user.role}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-600 truncate font-normal">
                          {conv.lastMessage}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Chat Thread */}
          {activeConv ? (
            <div
              className={`flex-1 flex flex-col bg-white ${
                !mobileThreadOpen ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Thread Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  {/* Back button for mobile */}
                  <button
                    type="button"
                    onClick={() => setMobileThreadOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border">
                      <Image
                        src={activeConv.user.avatar}
                        alt={activeConv.user.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {activeConv.user.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {activeConv.user.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeConv.user.online ? (
                        <span className="text-emerald-600 font-medium">Online</span>
                      ) : (
                        activeConv.user.lastSeen
                      )}{' '}
                      · {activeConv.user.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    title="Start Voice Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    title="Start Video Meeting"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                <div className="text-center my-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-border">
                    End-to-end encrypted direct message
                  </span>
                </div>

                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === 'usr-student-01';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-border rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Footer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-border bg-white flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.user.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 focus:bg-white transition-all"
                />

                <Button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="text-xs px-4 py-2.5 h-auto flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center p-8 text-center text-slate-400">
              <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

