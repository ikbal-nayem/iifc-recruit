// src/ai/flows/candidate-skills-extractor.ts
'use server';

/**
 * @fileOverview Extracts skills from a candidate's resume.
 *
 * - extractSkills - A function that extracts skills from a resume.
 * - CandidateSkillsInput - The input type for the extractSkills function.
 * - CandidateSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CandidateSkillsInputSchema = z.object({
  resumeText: z.string().describe('The text content of the candidate\'s resume.'),
});
export type CandidateSkillsInput = z.infer<typeof CandidateSkillsInputSchema>;

const CandidateSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills extracted from the resume.'),
});
export type CandidateSkillsOutput = z.infer<typeof CandidateSkillsOutputSchema>;

export async function extractSkills(input: CandidateSkillsInput): Promise<CandidateSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'candidateSkillsPrompt',
  input: {schema: CandidateSkillsInputSchema},
  output: {schema: CandidateSkillsOutputSchema},
  prompt: `You are an expert in resume analysis and skill extraction.
  Your task is to identify and extract all relevant skills from the provided resume text.
  Provide the skills as a list of strings.

  Resume Text: {{{resumeText}}}
  `,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: CandidateSkillsInputSchema,
    outputSchema: CandidateSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
