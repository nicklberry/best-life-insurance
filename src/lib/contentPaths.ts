type ContentEntryLike = {
  id?: string;
  slug?: string;
  filePath?: string;
  data?: {
    slug?: string;
  };
};

export function slugFromFilePath(filePath?: string) {
  return filePath
    ?.split('/')
    .pop()
    ?.replace(/\.(md|mdx|markdown)$/i, '');
}

export function getContentSlug(entry: ContentEntryLike) {
  const slug = entry.id ?? entry.slug ?? entry.data?.slug ?? slugFromFilePath(entry.filePath);

  if (!slug) {
    throw new Error('Missing content entry slug.');
  }

  return slug;
}

export function entryMatchesSlug(entry: ContentEntryLike, slug: string) {
  return [entry.id, entry.slug, entry.data?.slug, slugFromFilePath(entry.filePath)].includes(slug);
}

export function findEntryBySlug<T extends ContentEntryLike>(entries: T[], slug?: string) {
  if (!slug) {
    throw new Error('Missing route slug.');
  }

  const entry = entries.find((item) => entryMatchesSlug(item, slug));

  if (!entry) {
    throw new Error(`No content entry found for slug "${slug}".`);
  }

  return entry;
}


export function getContentPath(collection: 'blog' | 'coverage' | 'glossary', entry: ContentEntryLike) {
  const slug = getContentSlug(entry);

  return `/${collection}/${slug}/`;
}
