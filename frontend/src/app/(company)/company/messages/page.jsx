'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { companyNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockCompanyConversations } from '@/lib/mockCompanyData';
import {
  Send,
  Search,
  MessageSquare,
  Paperclip,
  CheckCheck,
  ArrowLeft,
  Calendar,
  FileCheck,
  Video,
  Phone,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function CompanyMessagesPage() {
  const [conversations, setConversations] = useState(mockCompanyConversations);
  const [activeConvId, setActiveConvId] = useState(mockCompanyConversations[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [viewMode, setViewMode] = useState('STANDARD'); // 'STANDARD' (Screen 41) or 'COMPACT' (Screen 46 alternate view)

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) =>
    c.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.candidate.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConvId) return;

    const newMsg = {
      id: `c-msg-${Date.now()}`,
      senderId: 'usr-rec-01',
      text: messageInput.trim(),
      time: 'Just now',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: newMsg.text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
    setMessageInput('');
  };

  return (
    <DashboardShell roleTitle="Recruiter Portal" navItems={companyNav}>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Control Bar with Alternate View Toggle (Reconciling Screens 41 & 46) */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Candidate Messages</h1>
            <Badge variant="outline" className="text-xs">
              {conversations.length} Active Conversations
            </Badge>
          </div>

          {/* Screen 41 vs 46 View Toggle */}
          <div className="inline-flex rounded-lg border border-border p-1 bg-white text-xs">
            <button
              type="button"
              onClick={() => setViewMode('STANDARD')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'STANDARD' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Standard View (Screen 41)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('COMPACT')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'COMPACT' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Compact View (Screen 46)
            </button>
          </div>
        </div>

        {/* Messaging Container */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden h-[calc(100vh-13rem)] min-h-[580px] flex">
          {/* Conversation List Sidebar */}
          <div
            className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col bg-slate-50/50 ${
              mobileThreadOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-border bg-white space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setMobileThreadOpen(true);
                    }}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50/70 border-l-4 border-l-primary'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border bg-white">
                        <Image
                          src={conv.candidate.avatar}
                          alt={conv.candidate.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {conv.candidate.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {conv.candidate.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.candidate.role}
                      </p>
                      <p className="text-xs text-slate-600 truncate font-normal">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          {activeConv ? (
            <div
              className={`flex-1 flex flex-col bg-white ${
                !mobileThreadOpen ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
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
                        src={activeConv.candidate.avatar}
                        alt={activeConv.candidate.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    {activeConv.candidate.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {activeConv.candidate.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeConv.candidate.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/company/talent/${activeConv.candidate.id}`}>
                    <Button variant="outline" className="text-xs py-1.5 h-auto">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {activeConv.messages.map((msg) => {
                  const isRecruiter = msg.senderId === 'usr-rec-01';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md sm:max-w-lg rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                          isRecruiter
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-border rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                        <span>{msg.time}</span>
                        {isRecruiter && <CheckCheck className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-border bg-white flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Attach job specification or take-home challenge"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.candidate.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50 focus:bg-white"
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
              <p className="text-sm">Select a conversation to begin chatting.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

