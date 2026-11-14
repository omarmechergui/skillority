'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { mockProfileDetails } from '@/lib/mockStudentData';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Coins,
  Flame,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Edit3,
  Share2,
  CheckCircle,
  Code2,
  Share,
} from 'lucide-react';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(mockProfileDetails);
  const [activeTab, setActiveTab] = useState('ABOUT');

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Cover Photo & Hero Header */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-border shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 w-full bg-slate-800">
            <Image
              src={profile.coverPhoto}
              alt="Profile Cover"
              fill
              className="object-cover opacity-90"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          {/* Profile Overview Bar */}
          <div className="px-6 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                {/* Avatar */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {profile.name}
                    </h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white" title="Verified Learner">
                      <CheckCircle className="w-4 h-4 fill-blue-500 text-white" />
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 max-w-xl">
                    {profile.headline}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Joined {profile.joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link href="/student/settings" className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full text-xs font-semibold flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </Button>
                </Link>
                <Button variant="secondary" className="text-xs font-semibold flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border">
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-700 rounded-lg">
                  <Coins className="w-4 h-4 fill-amber-500 text-amber-700" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">Coin Balance</p>
                  <p className="text-base font-extrabold text-amber-950">{profile.coinsBalance} Coins</p>
                </div>
              </div>

              <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 text-orange-700 rounded-lg">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-700" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-orange-800 uppercase tracking-wider">Study Streak</p>
                  <p className="text-base font-extrabold text-orange-950">{profile.streakDays} Days</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-700 rounded-lg">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-blue-800 uppercase tracking-wider">Certificates</p>
                  <p className="text-base font-extrabold text-blue-950">{profile.certificatesCount} Verified</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-700 rounded-lg">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider">Career Status</p>
                  <p className="text-base font-extrabold text-emerald-950">Active Candidate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border text-sm font-medium gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('ABOUT')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'ABOUT'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Bio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PORTFOLIO')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'PORTFOLIO'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Projects & Skills
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('EXPERIENCE')}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeTab === 'EXPERIENCE'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Experience & Education
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'ABOUT' && (
              <>
                {/* Bio Card */}
                <Card className="p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                </Card>

                {/* Featured Project */}
                <Card className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Featured Capstone Project</h2>
                    <a
                      href={profile.featuredProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View Repository
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {profile.featuredProject.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {profile.featuredProject.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {profile.featuredProject.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'PORTFOLIO' && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Technical Skills</h2>
                  <p className="text-xs text-slate-500">Skills certified through course completions and assessments</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Areas of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs font-medium">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'EXPERIENCE' && (
              <div className="space-y-6">
                {/* Work Experience */}
                <Card className="p-6 space-y-5">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Work Experience
                  </h2>

                  <div className="space-y-6">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-slate-200 space-y-1">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                        <h3 className="text-sm font-bold text-slate-900">{exp.title}</h3>
                        <p className="text-xs font-semibold text-primary">{exp.company} · {exp.location}</p>
                        <p className="text-[11px] text-slate-400">{exp.period}</p>
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Education */}
                <Card className="p-6 space-y-5">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education
                  </h2>

                  <div className="space-y-6">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-slate-200 space-y-1">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white" />
                        <h3 className="text-sm font-bold text-slate-900">{edu.school}</h3>
                        <p className="text-xs font-semibold text-emerald-700">{edu.degree}</p>
                        <p className="text-[11px] text-slate-400">{edu.period}</p>
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar (1 col): Contact & Social Links */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Contact Details</h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {profile.website.replace('https://', '')}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900">Social & Code Profiles</h2>

              <div className="space-y-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="flex items-center gap-2.5">
                    <Code2 className="w-4 h-4 text-slate-800" />
                    GitHub Profile
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    LinkedIn Network
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="flex items-center gap-2.5">
                    <Share className="w-4 h-4 text-sky-500" />
                    Twitter / X
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
