'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { studentNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { careerApi } from '@/lib/api';
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  Briefcase,
  Loader2,
} from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Software Engineering',
  'Mobile Engineering',
  'Product Design',
  'Data & Analytics',
  'Artificial Intelligence',
  'Security & Operations',
  'Cloud & Infrastructure',
  'Quality Assurance',
  'Product & Strategy',
];

const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function CareerPathsCatalogPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [myGoals, setMyGoals] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [pathsRes, goalsRes] = await Promise.all([
          careerApi.getCareerPaths({
            category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
            difficulty: selectedDifficulty !== 'ALL' ? selectedDifficulty : undefined,
            search: search.trim() || undefined,
          }),
          careerApi.getMyCareerGoals().catch(() => ({ data: [] })),
        ]);

        if (pathsRes?.data?.paths) {
          setPaths(pathsRes.data.paths);
        } else if (Array.isArray(pathsRes?.data)) {
          setPaths(pathsRes.data);
        }
        if (goalsRes?.data) {
          setMyGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
        }
      } catch (err) {
        console.error('Failed to load career paths:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, selectedDifficulty, search]);

  const primaryGoal = myGoals.find((g) => g.isPrimary);

  return (
    <DashboardShell role="STUDENT" navItems={studentNav}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/student/dashboard" className="hover:text-primary transition-colors">
              Student Workspace
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900">Career Development</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Link href="/student/careers">
              <Button variant="outline" size="sm" className="text-xs">
                <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Internship Marketplace
              </Button>
            </Link>
            <Link href="/student/careers/paths">
              <Button variant="primary" size="sm" className="text-xs">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                Career Paths
              </Button>
            </Link>
            <Link href="/student/careers/dashboard">
              <Button variant="outline" size="sm" className="text-xs">
                <Target className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                My Career Dashboard
              </Button>
            </Link>
            <Link href="/student/careers/applications">
              <Button variant="outline" size="sm" className="text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                My Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                Data-Driven Roadmap
              </Badge>
              <span className="text-xs text-slate-400">13 Industry Standard Professions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Career Paths & Skill Blueprints
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Understand the core competencies, recommended coursework, and verified skill milestones required for high-demand technology roles.
            </p>
          </div>

          {primaryGoal && (
            <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 shrink-0 max-w-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="w-4 h-4" /> Current Target Profession
              </div>
              <p className="text-sm font-extrabold text-slate-900">{primaryGoal.careerPath?.title}</p>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Readiness Score:</span>
                <span className="font-bold text-emerald-600">{primaryGoal.progress?.readinessScore || 0}%</span>
              </div>
              <Link href="/student/careers/dashboard">
                <Button variant="outline" size="sm" className="w-full text-xs mt-2 bg-white">
                  Open Career Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search career paths by profession, required skill, or keyword..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-xs bg-slate-50 border border-border rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'All Difficulties' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-50 border border-border text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Domains' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Career Paths Grid */}
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-500">Loading career blueprints...</p>
          </div>
        ) : paths.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Career Paths Match Your Filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to see all 13 standard professions.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedDifficulty('ALL');
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => {
              const isSelected = myGoals.some((g) => g.careerPathId === path.id);
              const isPrimarySelected = primaryGoal?.careerPathId === path.id;
              const requiredSkills = Array.isArray(path.requiredSkills) ? path.requiredSkills : [];

              return (
                <Card
                  key={path.id || path.slug}
                  className="p-6 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-5 border-border"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] py-0.5 text-slate-600">
                        {path.category}
                      </Badge>
                      <Badge
                        variant={
                          path.difficultyLevel === 'BEGINNER'
                            ? 'success'
                            : path.difficultyLevel === 'ADVANCED'
                            ? 'warning'
                            : 'primary'
                        }
                        className="text-[10px] py-0.5"
                      >
                        {path.difficultyLevel}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                        <Link href={`/student/careers/paths/${path.slug}`}>
                          {path.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-1.5">
                        {path.description}
                      </p>
                    </div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{path.estimatedDuration || '6-9 months'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{path.salaryRange || 'Competitive'}</span>
                      </div>
                    </div>

                    {/* Core Skills Tags */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500">Core Required Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {requiredSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-200/60"
                          >
                            {typeof skill === 'object' ? skill.name : skill}
                          </span>
                        ))}
                        {requiredSkills.length > 4 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 text-slate-400">
                            +{requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                    {isPrimarySelected ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Target Goal
                      </span>
                    ) : isSelected ? (
                      <span className="text-xs font-semibold text-slate-500">Selected Interest</span>
                    ) : (
                      <span className="text-xs text-slate-400">{path.jobOutlook || 'High Demand'}</span>
                    )}

                    <Link href={`/student/careers/paths/${path.slug}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Blueprint <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
