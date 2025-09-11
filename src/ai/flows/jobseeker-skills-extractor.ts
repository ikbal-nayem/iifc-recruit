// src/ai/flows/jobseeker-skills-extractor.ts
'use server';

/**
 * @fileOverview Extracts skills from a jobseeker's resume.
 *
 * - extractSkills - A function that extracts skills from a resume.
 * - JobseekerSkillsInput - The input type for the extractSkills function.
 * - JobseekerSkillsOutput - The return type for the extractSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobseekerSkillsInputSchema = z.object({
  resumeText: z.string().describe("The text content of the jobseeker's resume."),
});
export type JobseekerSkillsInput = z.infer<typeof JobseekerSkillsInputSchema>;

const JobseekerSkillsOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('A list of skills extracted from the resume.'),
});
export type JobseekerSkillsOutput = z.infer<typeof JobseekerSkillsOutputSchema>;

export async function extractSkills(input: JobseekerSkillsInput): Promise<JobseekerSkillsOutput> {
  return extractSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'jobseekerSkillsPrompt',
  input: {schema: JobseekerSkillsInputSchema},
  output: {schema: JobseekerSkillsOutputSchema},
  prompt: `You are an expert in resume analysis and skill extraction.
  Your task is to identify and extract all relevant skills from the provided resume text.
  Provide the skills as a list of strings.

  Resume Text: {{{resumeText}}}
  `,
});

const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: JobseekerSkillsInputSchema,
    outputSchema: JobseekerSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
