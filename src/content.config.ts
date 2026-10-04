import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    lang: z.enum(['en', 'pt']),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    repo: z.url().optional(),
    url: z.url().optional(),
    order: z.number().default(0),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    lang: z.enum(['en', 'pt']),
    title: z.string(),
    description: z.string(),
    status: z.enum(['planned', 'published']).default('planned'),
    topics: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { projects, caseStudies };
