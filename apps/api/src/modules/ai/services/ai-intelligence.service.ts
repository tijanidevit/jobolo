import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../../opportunities/entities/opportunity.entity.js';
import { Interview } from '../../interviews/entities/interview.entity.js';
import { UserSkill } from '../../skills/entities/user-skill.entity.js';
import { SKILL_CATALOG } from '../../skills/constants/skill-catalog.js';
import { OpportunityFitScore } from '../entities/opportunity-fit-score.entity.js';
import { InterviewPreparation } from '../entities/interview-preparation.entity.js';
import { InterviewMemory } from '../entities/interview-memory.entity.js';
import type { CreateInterviewMemoryDto } from '../dto/create-interview-memory.dto.js';

type Provider = 'ai' | 'local';

@Injectable()
export class AiIntelligenceService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Opportunity)
    private readonly opportunities: Repository<Opportunity>,
    @InjectRepository(Interview)
    private readonly interviews: Repository<Interview>,
    @InjectRepository(UserSkill) private readonly skills: Repository<UserSkill>,
    @InjectRepository(OpportunityFitScore)
    private readonly fitScores: Repository<OpportunityFitScore>,
    @InjectRepository(InterviewPreparation)
    private readonly preparations: Repository<InterviewPreparation>,
    @InjectRepository(InterviewMemory)
    private readonly memories: Repository<InterviewMemory>,
  ) {}

  async scoreOpportunity(userId: string, opportunityId: string) {
    const opportunity = await this.getOpportunity(userId, opportunityId);
    const userSkills = await this.skills.find({ where: { userId } });
    const result = await this.generateFitScore(
      opportunity,
      userSkills.map((item) => item.skill),
    );
    return this.fitScores.save(
      this.fitScores.create({ userId, opportunityId, ...result }),
    );
  }

  async latestFitScore(userId: string, opportunityId: string) {
    await this.getOpportunity(userId, opportunityId);
    return this.fitScores.findOne({
      where: { userId, opportunityId },
      order: { createdAt: 'DESC' },
    });
  }

  async prepareInterview(userId: string, opportunityId: string) {
    const opportunity = await this.getOpportunity(userId, opportunityId);
    const interviews = await this.interviews.find({
      where: { userId, opportunityId },
      order: { scheduledAt: 'DESC' },
    });
    const result = await this.generatePreparation(opportunity, interviews);
    return this.preparations.save(
      this.preparations.create({ userId, opportunityId, ...result }),
    );
  }

  async latestPreparation(userId: string, opportunityId: string) {
    await this.getOpportunity(userId, opportunityId);
    return this.preparations.findOne({
      where: { userId, opportunityId },
      order: { createdAt: 'DESC' },
    });
  }

  async rememberInterview(
    userId: string,
    opportunityId: string,
    interviewId: string,
    dto: CreateInterviewMemoryDto,
  ) {
    await this.getOpportunity(userId, opportunityId);
    const interview = await this.interviews.findOne({
      where: { id: interviewId, userId, opportunityId },
    });
    if (!interview) throw new NotFoundException('Interview not found');
    const result = await this.generateMemory(dto.sourceText);
    return this.memories.save(
      this.memories.create({
        userId,
        opportunityId,
        interviewId,
        sourceText: dto.sourceText.trim(),
        ...result,
      }),
    );
  }

  async latestMemory(
    userId: string,
    opportunityId: string,
    interviewId: string,
  ) {
    await this.getOpportunity(userId, opportunityId);
    const interview = await this.interviews.findOne({
      where: { id: interviewId, userId, opportunityId },
    });
    if (!interview) throw new NotFoundException('Interview not found');
    return this.memories.findOne({
      where: { userId, opportunityId, interviewId },
      order: { createdAt: 'DESC' },
    });
  }

  private async getOpportunity(userId: string, opportunityId: string) {
    const opportunity = await this.opportunities.findOne({
      where: { id: opportunityId, userId },
    });
    if (!opportunity) throw new NotFoundException('Opportunity not found');
    return opportunity;
  }

  private async generateFitScore(
    opportunity: Opportunity,
    userSkills: string[],
  ) {
    const description = opportunity.jobDescription ?? '';
    const requiredSkills = SKILL_CATALOG.filter((skill) =>
      skill.aliases.some((alias) =>
        this.containsTerm(description.toLowerCase(), alias),
      ),
    ).map((skill) => skill.name);
    const normalizedUserSkills = userSkills.map((skill) => skill.toLowerCase());
    const matchedSkills = requiredSkills.filter((skill) =>
      normalizedUserSkills.includes(skill.toLowerCase()),
    );
    const missingSkills = requiredSkills.filter(
      (skill) => !matchedSkills.includes(skill),
    );
    const technicalSkillsScore = requiredSkills.length
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 50;
    const experienceScore = /\b(?:senior|lead|principal|staff)\b/i.test(
      opportunity.jobTitle,
    )
      ? 70
      : 80;
    const seniorityScore = /\b(?:senior|lead|principal|staff)\b/i.test(
      opportunity.jobTitle,
    )
      ? 70
      : 85;
    const industryScore = opportunity.companyIndustry ? 75 : 50;
    const locationScore =
      opportunity.location || opportunity.workArrangement ? 80 : 50;
    const overallScore = Math.round(
      technicalSkillsScore * 0.4 +
        experienceScore * 0.2 +
        seniorityScore * 0.15 +
        industryScore * 0.1 +
        locationScore * 0.15,
    );
    const fallback = {
      overallScore,
      technicalSkillsScore,
      experienceScore,
      seniorityScore,
      industryScore,
      locationScore,
      matchedSkills,
      missingSkills,
      rationale: missingSkills.length
        ? `Your profile matches ${matchedSkills.length} of ${requiredSkills.length || 'the detected'} requested skills. Consider strengthening: ${missingSkills.join(', ')}.`
        : 'Your saved skills match the technical requirements detected for this opportunity.',
      provider: 'local' as Provider,
    };
    const ai = await this.requestJson<Partial<typeof fallback>>(
      'Compare the candidate profile with the opportunity. Return JSON only with overallScore, technicalSkillsScore, experienceScore, seniorityScore, industryScore, locationScore, matchedSkills, missingSkills, and rationale. Scores must be integers from 0 to 100. Do not confuse fit with interest, confidence, or priority.',
      JSON.stringify({ opportunity, userSkills }),
    );
    if (!ai) return fallback;
    return {
      ...fallback,
      ...this.scoreValues(ai, fallback),
      matchedSkills: this.stringArray(ai.matchedSkills, fallback.matchedSkills),
      missingSkills: this.stringArray(ai.missingSkills, fallback.missingSkills),
      rationale: this.stringValue(ai.rationale) ?? fallback.rationale,
      provider: 'ai' as Provider,
    };
  }

  private async generatePreparation(
    opportunity: Opportunity,
    interviews: Interview[],
  ) {
    const skills = SKILL_CATALOG.filter((skill) =>
      skill.aliases.some((alias) =>
        this.containsTerm(
          (opportunity.jobDescription ?? '').toLowerCase(),
          alias,
        ),
      ),
    )
      .map((skill) => skill.name)
      .slice(0, 6);
    const previousQuestions = interviews
      .flatMap((interview) => this.lines(interview.notes))
      .slice(0, 5);
    const fallback = {
      likelyQuestions: [
        `Walk us through your experience relevant to ${opportunity.jobTitle}.`,
        `Why are you interested in ${opportunity.companyName}?`,
        ...previousQuestions,
      ].slice(0, 8),
      technicalQuestions: skills.map(
        (skill) => `How have you used ${skill} in production?`,
      ),
      behavioralQuestions: [
        'Tell us about a difficult problem you solved.',
        'Tell us about a time you received challenging feedback.',
      ],
      systemDesignQuestions: skills.length
        ? [`Design a reliable system that uses ${skills[0]}.`]
        : [],
      studyTopics: skills,
      provider: 'local' as Provider,
    };
    const ai = await this.requestJson<Partial<typeof fallback>>(
      'Create interview preparation from the opportunity and previous interview notes. Return JSON only with likelyQuestions, technicalQuestions, behavioralQuestions, systemDesignQuestions, and studyTopics. Keep every item concise and actionable.',
      JSON.stringify({ opportunity, previousInterviews: interviews }),
    );
    if (!ai) return fallback;
    return {
      ...fallback,
      likelyQuestions: this.stringArray(
        ai.likelyQuestions,
        fallback.likelyQuestions,
      ),
      technicalQuestions: this.stringArray(
        ai.technicalQuestions,
        fallback.technicalQuestions,
      ),
      behavioralQuestions: this.stringArray(
        ai.behavioralQuestions,
        fallback.behavioralQuestions,
      ),
      systemDesignQuestions: this.stringArray(
        ai.systemDesignQuestions,
        fallback.systemDesignQuestions,
      ),
      studyTopics: this.stringArray(ai.studyTopics, fallback.studyTopics),
      provider: 'ai' as Provider,
    };
  }

  private async generateMemory(sourceText: string) {
    const lines = this.lines(sourceText);
    const fallback = {
      interviewers: lines
        .filter((line) => /interviewer|met with|spoke with/i.test(line))
        .slice(0, 8),
      questions: lines
        .filter((line) => /\?|asked|question/i.test(line))
        .slice(0, 20),
      topics: lines
        .filter((line) =>
          /topic|discussed|focused|system design|technical/i.test(line),
        )
        .slice(0, 20),
      commitments: lines
        .filter((line) =>
          /will send|promised|commit|follow up|next step/i.test(line),
        )
        .slice(0, 12),
      followUpActions: lines
        .filter((line) => /follow up|email|send|schedule|prepare/i.test(line))
        .slice(0, 12),
      weaknesses: lines
        .filter((line) =>
          /struggled|weakness|improve|unclear|could not/i.test(line),
        )
        .slice(0, 12),
      provider: 'local' as Provider,
    };
    const ai = await this.requestJson<Partial<typeof fallback>>(
      'Extract structured interview memory from the supplied notes or transcript. Return JSON only with interviewers, questions, topics, commitments, followUpActions, and weaknesses. Do not invent facts.',
      sourceText,
    );
    if (!ai) return fallback;
    return {
      ...fallback,
      interviewers: this.stringArray(ai.interviewers, fallback.interviewers),
      questions: this.stringArray(ai.questions, fallback.questions),
      topics: this.stringArray(ai.topics, fallback.topics),
      commitments: this.stringArray(ai.commitments, fallback.commitments),
      followUpActions: this.stringArray(
        ai.followUpActions,
        fallback.followUpActions,
      ),
      weaknesses: this.stringArray(ai.weaknesses, fallback.weaknesses),
      provider: 'ai' as Provider,
    };
  }

  private async requestJson<T>(
    system: string,
    input: string,
  ): Promise<T | null> {
    const apiKey = this.config.get<string>('ai.apiKey');
    if (!apiKey) return null;
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.config.get<string>('ai.model') ?? 'gpt-4o-mini',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: input },
            ],
          }),
        },
      );
      if (!response.ok) return null;
      const body = (await response.json()) as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const content = body.choices?.[0]?.message?.content;
      return content ? (JSON.parse(content) as T) : null;
    } catch {
      return null;
    }
  }

  private scoreValues(
    value: Partial<{
      overallScore: number;
      technicalSkillsScore: number;
      experienceScore: number;
      seniorityScore: number;
      industryScore: number;
      locationScore: number;
    }>,
    fallback: {
      overallScore: number;
      technicalSkillsScore: number;
      experienceScore: number;
      seniorityScore: number;
      industryScore: number;
      locationScore: number;
    },
  ) {
    return Object.fromEntries(
      Object.keys(fallback).map((key) => {
        const candidate = value[key as keyof typeof fallback];
        return [
          key,
          typeof candidate === 'number'
            ? Math.max(0, Math.min(100, Math.round(candidate)))
            : fallback[key as keyof typeof fallback],
        ];
      }),
    ) as typeof fallback;
  }

  private stringArray(value: unknown, fallback: string[]) {
    return Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 20)
      : fallback;
  }

  private stringValue(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private lines(value: string | null) {
    return (value ?? '')
      .split(/\r?\n|[.!?](?=\s)/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  private containsTerm(text: string, term: string) {
    return new RegExp(
      `(^|[^a-z0-9+#])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&')}([^a-z0-9+#]|$)`,
      'i',
    ).test(text);
  }
}
