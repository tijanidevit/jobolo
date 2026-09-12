export interface OpportunityFitScore {
  id: string;
  opportunityId: string;
  overallScore: number;
  technicalSkillsScore: number;
  experienceScore: number;
  seniorityScore: number;
  industryScore: number;
  locationScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  rationale: string;
  provider: 'ai' | 'local';
  createdAt: string;
}

export interface InterviewPreparation {
  id: string;
  opportunityId: string;
  likelyQuestions: string[];
  technicalQuestions: string[];
  behavioralQuestions: string[];
  systemDesignQuestions: string[];
  studyTopics: string[];
  provider: 'ai' | 'local';
  createdAt: string;
}

export interface InterviewMemory {
  id: string;
  opportunityId: string;
  interviewId: string;
  sourceText: string;
  interviewers: string[];
  questions: string[];
  topics: string[];
  commitments: string[];
  followUpActions: string[];
  weaknesses: string[];
  provider: 'ai' | 'local';
  createdAt: string;
}
