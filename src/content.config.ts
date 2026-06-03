import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
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
  loader: glob({ base: './src/content/glossary', pattern: '**/*.md' }),
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
  loader: glob({ base: './src/content/coverage', pattern: '**/*.md' }),
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
