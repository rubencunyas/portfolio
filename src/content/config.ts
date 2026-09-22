import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    url: z.string().optional(),
    video: z.string().optional(),
    videos: z.array(z.string()).optional(),
    full360: z.boolean().default(false),
    group360: z.string().optional(),
    web: z.boolean().default(false),
    year: z.number(),
    category: z.enum(['branding', 'web', 'multimedia', 'uxui']).default('web'),
    tags: z.array(z.string()),
    accent: z.enum(['blue', 'orange']).default('blue'),
    cover: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    gallery_slider: z.array(z.string()).optional(),
    carousels: z.array(z.object({
      label: z.string().optional(),
      images: z.array(z.string())
    })).optional(),
    challenge: z.string(),
    solution: z.string(),
    result: z.string(),
    technologies: z.array(z.string()),
    ai_tools: z.array(z.string()).optional(),
    ai_prompt: z.string().optional(),
    ai_before: z.string().optional(),
    ai_after: z.string().optional(),
    ai_steps: z.array(z.object({ title: z.string(), text: z.string() })).optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0)
  })
});

export const collections = {
  projects: projectsCollection
};
