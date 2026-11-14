'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/layout/DashboardShell';
import { instructorNav } from '@/components/layout/navigationConfig';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Award,
  Eye,
  CheckCircle,
} from 'lucide-react';

export default function AssessmentBuilderPage({ params }) {
  const [passingScore, setPassingScore] = useState(80);
  const [saved, setSaved] = useState(false);

  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      question: 'Which Next.js API revalidates tagged cache data across edge points?',
      options: ['revalidatePath()', 'revalidateTag()', 'cache.clear()', 'purgeCache()'],
      correctIndex: 1,
      points: 20,
    },
    {
      id: 'q2',
      question: 'What is the primary architectural benefit of React Server Components?',
      options: [
        'Eliminates client bundle footprint for zero-runtime dependencies',
        'Forces all state to be stored in localStorage',
        'Requires all components to run synchronously',
        'Replaces CSS-in-JS entirely',
      ],
      correctIndex: 0,
      points: 20,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        question: 'New question prompt...',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: 0,
        points: 20,
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardShell roleTitle="Instructor Portal" navItems={instructorNav}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/instructor/courses/${params.id}/curriculum`}>
              <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <Badge variant="primary" className="text-[10px]">Certification Exam</Badge>
              <h1 className="text-2xl font-bold text-slate-900">Course Assessment Builder</h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/instructor/courses/${params.id}/assessment/preview`}>
              <Button variant="outline" className="text-xs font-semibold flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            <Button onClick={handleSave} className="text-xs font-semibold flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Assessment
            </Button>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Final assessment criteria and question bank saved!
          </div>
        )}

        <Card className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-slate-900">Passing Grade Threshold</h3>
            <p className="text-[11px] text-slate-500">Student must achieve this score for final credential issuance</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="60"
              max="100"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-20 text-center font-bold"
            />
            <span className="text-xs font-bold text-slate-700">%</span>
          </div>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Exam Questions ({questions.length})</h2>
            <Button onClick={addQuestion} variant="outline" className="text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </Button>
          </div>

          {questions.map((q, idx) => (
            <Card key={q.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase text-primary">Question {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Question Prompt</label>
                <Input value={q.question} onChange={(e) => {
                  const updated = [...questions];
                  updated[idx].question = e.target.value;
                  setQuestions(updated);
                }} />
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700">Answer Options (Select correct radio)</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === oIdx}
                      onChange={() => {
                        const updated = [...questions];
                        updated[idx].correctIndex = oIdx;
                        setQuestions(updated);
                      }}
                      className="text-primary"
                    />
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].options[oIdx] = e.target.value;
                        setQuestions(updated);
                      }}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

