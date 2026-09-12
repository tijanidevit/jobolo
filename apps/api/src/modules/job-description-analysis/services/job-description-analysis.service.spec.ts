import { describe, expect, it, vi } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { JobDescriptionAnalysisService } from './job-description-analysis.service.js';

describe('JobDescriptionAnalysisService', () => {
  it('extracts local job facts when no AI provider is configured', async () => {
    const config = { get: () => '' } as unknown as ConfigService;
    const service = new JobDescriptionAnalysisService(config);
    const result = await service.analyze({
      description:
        'Senior Backend Engineer. Remote role. Requires 5+ years experience with TypeScript, Node.js, and PostgreSQL. Salary USD 120k - USD 150k. Includes a technical interview.',
    });

    expect(result.provider).toBe('local');
    expect(result.skills).toEqual(
      expect.arrayContaining(['TypeScript', 'Node.js', 'PostgreSQL']),
    );
    expect(result.seniority).toBe('senior');
    expect(result.salary).toContain('USD');
    expect(result.experienceRequirements).toEqual(
      expect.arrayContaining([expect.stringContaining('5+ years')]),
    );
  });

  it('normalizes a configured AI provider response', async () => {
    const config = {
      get: (key: string) => (key === 'ai.apiKey' ? 'test-key' : 'test-model'),
    } as unknown as ConfigService;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  summary: 'A role',
                  skills: ['TypeScript'],
                  experienceRequirements: [],
                  salary: null,
                  location: 'Remote',
                  seniority: 'Senior',
                  employmentType: 'Full-time',
                  interviewRequirements: [],
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const result = await new JobDescriptionAnalysisService(config).analyze({
      description: 'A sufficiently long job description for AI analysis.',
    });

    expect(result).toMatchObject({
      provider: 'ai',
      summary: 'A role',
      skills: ['TypeScript'],
    });
    fetchMock.mockRestore();
  });
});
