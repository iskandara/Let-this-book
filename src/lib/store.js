// Posts live in two Firestore collections that share an id:
//   posts/{id}  — caption, pin, character, place and a small thumbnail (what the gallery lists)
//   photos/{id} — the full-size photo, loaded only when someone opens the post
// Without Firebase config the site runs in demo mode and keeps posts in this browser only.

export const PAGE_SIZE = 24;
export const isDemo = !import.meta.env.VITE_FIREBASE_PROJECT_ID;

const firebase = isDemo
  ? null
  : Promise.all([import('./firebase.js'), import('firebase/firestore')]).then(([{ db }, fs]) => ({ db, ...fs }));

export async function createPost({ caption, location, character, place, full, thumb }) {
  const meta = { caption, location, character, place, thumb };
  if (isDemo) return demo.create(meta, full);

  const { db, doc, collection, writeBatch, serverTimestamp } = await firebase;
  const ref = doc(collection(db, 'posts'));
  const batch = writeBatch(db);
  batch.set(ref, { ...meta, createdAt: serverTimestamp() });
  batch.set(doc(db, 'photos', ref.id), { data: full });
  await batch.commit();
  return ref.id;
}

// Returns { posts, cursor }; pass cursor back in to get the next page (null when there are no more).
export async function listPosts({ character, place, cursor } = {}) {
  if (isDemo) return demo.list({ character, place, cursor });

  const { db, collection, query, where, orderBy, limit, startAfter, getDocs } = await firebase;
  const parts = [];
  if (character) parts.push(where('character', '==', character));
  if (place) parts.push(where('place', '==', place));
  parts.push(orderBy('createdAt', 'desc'));
  if (cursor) parts.push(startAfter(cursor));
  parts.push(limit(PAGE_SIZE));
  const snap = await getDocs(query(collection(db, 'posts'), ...parts));
  return {
    posts: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    cursor: snap.docs.length === PAGE_SIZE ? snap.docs[snap.docs.length - 1] : null,
  };
}

export async function getPost(id) {
  if (isDemo) return demo.get(id);

  const { db, doc, getDoc } = await firebase;
  const [post, photo] = await Promise.all([getDoc(doc(db, 'posts', id)), getDoc(doc(db, 'photos', id))]);
  if (!post.exists()) return null;
  return { id, ...post.data(), full: photo.exists() ? photo.data().data : post.data().thumb };
}

const DEMO_KEY = 'ltb-demo-posts';
const demo = {
  read() {
    try {
      return JSON.parse(localStorage.getItem(DEMO_KEY)) || [];
    } catch {
      return [];
    }
  },
  create(meta, full) {
    const id = Math.random().toString(36).slice(2, 12);
    const posts = [{ id, ...meta, full, createdAt: Date.now() }, ...this.read()];
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(posts));
    } catch {
      // Browser storage is small; keep the newest post with just its thumbnail.
      posts[0].full = meta.thumb;
      localStorage.setItem(DEMO_KEY, JSON.stringify(posts.slice(0, 20)));
    }
    return id;
  },
  list({ character, place, cursor = 0 }) {
    const all = this.read().filter(
      (p) => (!character || p.character === character) && (!place || p.place === place),
    );
    const posts = all.slice(cursor, cursor + PAGE_SIZE);
    return { posts, cursor: cursor + PAGE_SIZE < all.length ? cursor + PAGE_SIZE : null };
  },
  get(id) {
    return this.read().find((p) => p.id === id) || null;
  },
};
