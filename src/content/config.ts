import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string()
  })
});

const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    term: z.string(),
    title: z.string(),
    description: z.string(),
    relatedTerms: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string()
  })
});

const coverage = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    coveredItems: z.array(z.string()),
    commonExclusions: z.array(z.string()),
    seoTitle: z.string(),
    seoDescription: z.string()
  })
});

export const collections = { blog, glossary, coverage };
