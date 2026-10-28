import { z } from 'zod';
const webLink = z.url().refine((url) => /^https?:\/\//.test(url), 'Use an HTTP or HTTPS URL');
export const talksSchema = z.array(
  z.object({
    id: z.string().min(1),
    type: z.enum(['talk', 'teaching', 'mentoring']),
    date: z.iso.date(),
    title: z.object({ en: z.string().min(1), pt: z.string().min(1) }),
    description: z.object({ en: z.string(), pt: z.string() }),
    event: z.string(),
    url: webLink.optional(),
    slides: webLink.optional(),
    video: webLink.optional(),
  }),
);
export function sortedTalks(value: unknown) {
  return talksSchema.parse(value).sort((a, b) => b.date.localeCompare(a.date));
}
