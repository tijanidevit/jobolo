import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SKILL_CATALOG } from '../../skills/constants/skill-catalog.js';
import type { AnalyzeJobDescriptionDto } from '../dto/analyze-job-description.dto.js';
import type { JobDescriptionAnalysis } from '../types/job-description-analysis.types.js';

type AiPayload = Omit<
  JobDescriptionAnalysis,
  'provider' | 'sourceUrl' | 'sourceDescription'
>;

@Injectable()
export class JobDescriptionAnalysisService {
  private readonly logger = new Logger(JobDescriptionAnalysisService.name);

  constructor(private readonly configService: ConfigService) {}

  async analyze(
    dto: AnalyzeJobDescriptionDto,
  ): Promise<JobDescriptionAnalysis> {
    const description =
      dto.description?.trim() ||
      (dto.jobUrl ? await this.fetchJobDescription(dto.jobUrl) : '');
    if (!description) {
      throw new BadRequestException('Provide a job description or a job URL');
    }
    const apiKey = this.configService.get<string>('ai.apiKey');
    if (apiKey) {
      try {
        const result = await this.analyzeWithAi(description, apiKey);
        return {
          provider: 'ai',
          sourceUrl: dto.jobUrl ?? null,
          sourceDescription: description,
          ...result,
        };
      } catch (error) {
        this.logger.warn(
          `AI analysis failed; using local extraction: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return {
      provider: 'local',
      sourceUrl: dto.jobUrl ?? null,
      sourceDescription: description,
      ...this.analyzeLocally(description),
    };
  }

  private async fetchJobDescription(jobUrl: string): Promise<string> {
    const url = new URL(jobUrl);
    if (this.isPrivateHost(url.hostname)) {
      throw new BadRequestException('This job URL cannot be accessed');
    }

    const response = await fetch(url, {
      headers: { Accept: 'text/html, text/plain' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new BadRequestException('The job URL could not be read');
    }

    const contentType = response.headers.get('content-type') ?? '';
    const body = await response.text();
    const text = contentType.includes('html')
      ? body
          .replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;|&#160;/gi, ' ')
          .replace(/&amp;/gi, '&')
      : body;
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length < 50) {
      throw new BadRequestException(
        'The job URL did not contain enough readable text',
      );
    }
    return normalized.slice(0, 30000);
  }

  private isPrivateHost(hostname: string) {
    const normalized = hostname.toLowerCase();
    return (
      normalized === 'localhost' ||
      normalized === '127.0.0.1' ||
      normalized === '::1' ||
      normalized.startsWith('10.') ||
      normalized.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
    );
  }

  private async analyzeWithAi(
    description: string,
    apiKey: string,
  ): Promise<AiPayload> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.configService.get<string>('ai.model') ?? 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Extract opportunity fields from job descriptions. Return JSON only with companyName, jobTitle, summary, skills, experienceRequirements, salary, location, seniority, employmentType, and interviewRequirements. Use arrays of concise strings, null for unknown scalar values, and never infer a job-fit score.',
          },
          { role: 'user', content: description },
        ],
      }),
    });
    if (!response.ok)
      throw new Error(`AI provider returned ${response.status}`);
    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content) throw new Error('AI provider returned no analysis');
    return this.normalize(JSON.parse(content));
  }

  private analyzeLocally(description: string): AiPayload {
    const lines = description
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const lower = description.toLowerCase();
    const skills = SKILL_CATALOG.filter((skill) =>
      skill.aliases.some((alias) => this.containsTerm(lower, alias)),
    ).map((skill) => skill.name);
    const experienceRequirements = lines
      .filter((line) =>
        /\b\d+\+?\s+years?\b|experience required|experience in/i.test(line),
      )
      .slice(0, 8);
    const interviewRequirements = lines
      .filter((line) =>
        /interview|technical assessment|coding challenge|take-home|system design/i.test(
          line,
        ),
      )
      .slice(0, 8);
    return {
      companyName: this.extractCompanyName(lines[0]),
      jobTitle: lines[0]?.split(/\s+at\s+/i)[0]?.slice(0, 255) ?? null,
      summary: lines[0]?.slice(0, 240) ?? 'Job description analyzed locally.',
      skills,
      experienceRequirements,
      salary:
        description.match(
          /(?:[$€£]|\b(?:USD|CAD|EUR|GBP)\b)\s?[\d,.]+\s*(?:k|K)?(?:\s*[-–]\s*(?:[$€£]|\b(?:USD|CAD|EUR|GBP)\b)?\s?[\d,.]+\s*(?:k|K)?)?/i,
        )?.[0] ?? null,
      location:
        lines.find((line) =>
          /\b(remote|hybrid|onsite|on-site|location|based in)\b/i.test(line),
        ) ?? null,
      seniority:
        [
          'intern',
          'junior',
          'mid-level',
          'senior',
          'staff',
          'lead',
          'principal',
        ].find((level) => lower.includes(level)) ?? null,
      employmentType:
        [
          'full-time',
          'full time',
          'part-time',
          'part time',
          'contract',
          'freelance',
          'internship',
        ].find((type) => lower.includes(type)) ?? null,
      interviewRequirements,
    };
  }

  private extractCompanyName(firstLine?: string) {
    const match = firstLine?.match(/\s+at\s+(.+)$/i);
    return match?.[1]?.trim().slice(0, 255) ?? null;
  }

  private normalize(value: unknown): AiPayload {
    const object = value as Partial<Record<keyof AiPayload, unknown>>;
    return {
      companyName: this.stringValue(object.companyName),
      jobTitle: this.stringValue(object.jobTitle),
      summary: this.stringValue(object.summary) ?? 'Job description analyzed.',
      skills: this.stringArray(object.skills),
      experienceRequirements: this.stringArray(object.experienceRequirements),
      salary: this.stringValue(object.salary),
      location: this.stringValue(object.location),
      seniority: this.stringValue(object.seniority),
      employmentType: this.stringValue(object.employmentType),
      interviewRequirements: this.stringArray(object.interviewRequirements),
    };
  }

  private stringArray(value: unknown) {
    return Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === 'string')
          .slice(0, 20)
      : [];
  }

  private stringValue(value: unknown) {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private containsTerm(text: string, term: string) {
    return new RegExp(
      `(^|[^a-z0-9+#])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9+#]|$)`,
      'i',
    ).test(text);
  }
}
