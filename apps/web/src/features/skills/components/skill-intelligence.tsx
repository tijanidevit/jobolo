'use client';

import { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Check, Pencil, Plus, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { getErrorMessage } from '@/features/opportunities/utils/opportunity.utils';
import { useSkillIntelligence } from '../hooks/use-skill-intelligence';
import { useUpdateSkillProfile } from '../hooks/use-update-skill-profile';
import type { UserSkill } from '../types';

export function SkillIntelligence() {
  const { intelligence, isLoading, error, refetch } = useSkillIntelligence();
  const { updateProfile, isUpdating, error: updateError } = useUpdateSkillProfile();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const profileLoaded = useRef(false);

  useEffect(() => {
    if (intelligence && !profileLoaded.current) {
      setSkills(intelligence.profile);
      profileLoaded.current = true;
    }
  }, [intelligence]);

  if (isLoading) return <LoadingState variant="page" message="Loading skill intelligence..." />;
  if (error || !intelligence) return <ErrorState variant="page" title="Unable to load skill intelligence" message="Your skill intelligence could not be loaded." onRetry={() => void refetch()} />;

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill || skills.some((item) => item.skill.toLowerCase() === skill.toLowerCase())) return;
    setSkills((current) => [...current, { id: `new-${Date.now()}`, skill, proficiency: 50 }]);
    setNewSkill('');
  };
  const startEditing = (skill: UserSkill) => { setEditingSkillId(skill.id); setEditingName(skill.skill); };
  const cancelEditing = () => { setEditingSkillId(null); setEditingName(''); };
  const commitEditing = () => {
    const name = editingName.trim();
    if (!editingSkillId || !name || skills.some((item) => item.id !== editingSkillId && item.skill.toLowerCase() === name.toLowerCase())) return;
    setSkills((current) => current.map((item) => item.id === editingSkillId ? { ...item, skill: name } : item));
    cancelEditing();
  };
  const updateProficiency = (id: string, proficiency: number) => setSkills((current) => current.map((item) => item.id === id ? { ...item, proficiency } : item));
  const save = async () => { await updateProfile(skills.map(({ skill, proficiency }) => ({ skill, proficiency }))); };

  return <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8"><header><p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Intelligence</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Skill intelligence</h1><p className="mt-2 max-w-2xl text-slate-500">Compare the skills requested in your saved opportunities with your current proficiency.</p></header><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-5 w-5 text-blue-600" />Market demand</CardTitle><CardDescription>Based on {intelligence.analyzedOpportunities} opportunity descriptions.</CardDescription></CardHeader><CardContent>{intelligence.skills.length === 0 ? <p className="text-sm text-slate-500">Add opportunities with job descriptions to start seeing demand.</p> : <div className="space-y-4">{intelligence.skills.map((item) => <div key={item.skill}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{item.skill}</span><span className="text-slate-500">{item.demandPercentage}% <span className="text-xs">({item.demandCount})</span></span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(item.demandPercentage, 100)}%` }} /></div>{item.proficiency !== null && <p className="mt-1 text-xs text-slate-400">Your proficiency: {item.proficiency}%{item.gap !== null && item.gap > 0 ? ` • gap ${item.gap}%` : ''}</p>}</div>)}</div>}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">Your proficiency</CardTitle><CardDescription>Keep this profile current to make gaps useful.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex gap-2"><Input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addSkill(); } }} placeholder="Add a skill" /><Button type="button" size="icon" variant="outline" onClick={addSkill} aria-label="Add skill"><Plus className="h-4 w-4" /></Button></div>{skills.length === 0 ? <p className="text-sm text-slate-500">No skills added yet.</p> : <div className="space-y-3">{skills.map((item) => <div key={item.id} className="space-y-1.5"><div className="flex items-center justify-between gap-2">{editingSkillId === item.id ? <div className="flex min-w-0 flex-1 items-center gap-1"><Input value={editingName} onChange={(event) => setEditingName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); commitEditing(); } if (event.key === 'Escape') cancelEditing(); }} aria-label={`Edit ${item.skill}`} autoFocus /><button type="button" onClick={commitEditing} className="text-green-600 hover:text-green-700" aria-label="Save skill name"><Check className="h-4 w-4" /></button><button type="button" onClick={cancelEditing} className="text-slate-400 hover:text-slate-700" aria-label="Cancel skill name edit"><X className="h-4 w-4" /></button></div> : <><span className="text-sm font-medium text-slate-700">{item.skill}</span><div className="flex items-center gap-2"><button type="button" onClick={() => startEditing(item)} className="text-slate-400 hover:text-blue-600" aria-label={`Edit ${item.skill}`}><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setSkills((current) => current.filter((skill) => skill.id !== item.id))} className="text-slate-400 hover:text-red-600" aria-label={`Remove ${item.skill}`}><X className="h-4 w-4" /></button></div></>}</div><div className="flex items-center gap-2"><Input id={`skill-${item.id}`} type="number" min="0" max="100" value={item.proficiency} onChange={(event) => updateProficiency(item.id, Math.max(0, Math.min(100, Number(event.target.value))))} /><span className="text-xs text-slate-400">%</span></div></div>)}</div>}<Button type="button" className="w-full" onClick={() => void save()} disabled={isUpdating}><Save className="mr-2 h-4 w-4" />{isUpdating ? 'Saving...' : 'Save profile'}</Button>{updateError && <p className="text-sm text-red-600">{getErrorMessage(updateError, 'Unable to save your skill profile.')}</p>}</CardContent></Card></div></div>;
}
