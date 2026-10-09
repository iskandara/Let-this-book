export const CHARACTERS = [
  { slug: 'content-creator', name: 'A Content Creator' },
  { slug: 'daddy', name: 'A Daddy' },
  { slug: 'dj', name: 'A DJ' },
  { slug: 'sporty-person', name: 'A Sporty Person' },
  { slug: 'artist', name: 'An Artist' },
  { slug: 'entity', name: 'An Entity' },
].map((c) => ({ ...c, image: `/img/char-${c.slug}.webp` }));

export const PLACES = [
  { slug: 'culture', name: 'Cultural / Art Space' },
  { slug: 'market', name: 'Traditional Market' },
  { slug: 'nature', name: 'Nature Beauty' },
  { slug: 'library', name: 'Public Library' },
  { slug: 'park', name: 'Public Park' },
].map((p) => ({ ...p, image: `/img/place-${p.slug}.webp` }));

export const findCharacter = (slug) => CHARACTERS.find((c) => c.slug === slug);
export const findPlace = (slug) => PLACES.find((p) => p.slug === slug);
