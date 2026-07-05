import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    url: z.string().optional(),
    year: z.number(),
    category: z.enum(['branding', 'web', 'multimedia']).default('web'),
    tags: z.array(z.string()),
    accent: z.enum(['blue', 'orange']).default('blue'),
    cover: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    gallery_slider: z.array(z.string()).optional(),
    challenge: z.string(),
    solution: z.string(),
    result: z.string(),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().default(0)
  })
});

export const collections = {
  projects: projectsCollection
};
