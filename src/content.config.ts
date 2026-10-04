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
    repo: z.string().url().optional(),
    url: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { projects };
