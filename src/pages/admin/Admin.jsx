import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CHARACTERS, PLACES, findCharacter, findPlace } from '../../data.js';
import { formatLocation } from '../../lib/location.js';
import { deletePost, getPost, isDemo, listPosts } from '../../lib/store.js';
import './admin.css';

const nameOf = (find, slug) => find(slug)?.name || slug || '—';

function formatDate(createdAt) {
  if (!createdAt) return '—';
  const d = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
  return d.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

// /admin and /admin/:id — moderation for gallery posts. Not linked from the public site.
export default function Admin() {
  const [user, setUser] = useState(isDemo ? { email: 'demo mode', isAdmin: true } : undefined);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    if (isDemo) return undefined;
    let unsubscribe = () => {};
    let live = true;
    import('../../lib/admin.js').then((mod) => {
      if (!live) return;
      setAuth(mod);
      unsubscribe = mod.watchAdmin(setUser);
    });
    return () => {
      live = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="adm">
      <header className="adm-bar">
        <Link to="/admin" className="adm-brand">Let This Book · Moderation</Link>
        {user && (
          <span className="adm-user">
            {user.email}
            {auth && (
              <button className="adm-link" onClick={() => auth.signOutAdmin()}>
                Sign out
              </button>
            )}
          </span>
        )}
      </header>
      <main className="adm-main">
        {user === undefined && <p className="adm-muted">Loading…</p>}
        {user === null && auth && <SignIn signIn={auth.signIn} />}
        {user && !user.isAdmin && (
          <div className="adm-card adm-narrow">
            <h1>Not an admin</h1>
            <p>
              <strong>{user.email}</strong> is signed in but is not on the admin list. Add a document with this ID to
              the <code>admins</code> collection in Firestore:
            </p>
            <pre className="adm-code">{user.uid}</pre>
            <p>Then reload this page.</p>
          </div>
        )}
        {user?.isAdmin && <Moderation />}
      </main>
    </div>
  );
}

function SignIn({ signIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      const code = err?.code || '';
      setError(
        code.includes('invalid') || code.includes('wrong-password') || code.includes('user-not-found')
          ? 'Wrong email or password.'
          : code.includes('too-many-requests')
            ? 'Too many attempts. Wait a few minutes and try again.'
            : code.includes('configuration-not-found') || code.includes('operation-not-allowed')
              ? 'Email/password sign-in is not switched on yet in Firebase (Authentication → Sign-in method).'
              : 'Could not sign in. Check your connection and try again.',
      );
      setBusy(false);
    }
  }

  return (
    <form className="adm-card adm-narrow" onSubmit={submit}>
      <h1>Admin sign in</h1>
      <label>
        Email
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <button className="adm-btn" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

function Moderation() {
  const { id } = useParams();
  return id ? <Detail id={id} /> : <List />;
}

function List() {
  const [character, setCharacter] = useState('');
  const [place, setPlace] = useState('');
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let live = true;
    setState('loading');
    listPosts({ character, place })
      .then((r) => {
        if (!live) return;
        setPosts(r.posts);
        setCursor(r.cursor);
        setState('done');
      })
      .catch((err) => {
        console.error(err);
        if (live) setState('error');
      });
    return () => {
      live = false;
    };
  }, [character, place]);

  async function more() {
    setState('more');
    try {
      const r = await listPosts({ character, place, cursor });
      setPosts((p) => [...p, ...r.posts]);
      setCursor(r.cursor);
      setState('done');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  }

  return (
    <>
      <div className="adm-toolbar">
        <h1>Posts</h1>
        <select value={character} onChange={(e) => setCharacter(e.target.value)} aria-label="Filter by character">
          <option value="">All characters</option>
          {CHARACTERS.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <select value={place} onChange={(e) => setPlace(e.target.value)} aria-label="Filter by place">
          <option value="">All places</option>
          {PLACES.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </div>

      {state === 'loading' && <p className="adm-muted">Loading posts…</p>}
      {state === 'error' && <p className="adm-error" role="alert">Could not load posts. Reload to try again.</p>}
      {state !== 'loading' && state !== 'error' && posts.length === 0 && <p className="adm-muted">No posts.</p>}

      <ul className="adm-grid">
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={`/admin/${p.id}`} className="adm-tile">
              <img src={p.thumb} alt="" loading="lazy" />
              <span className="adm-tile-caption">{p.caption}</span>
              <span className="adm-muted small">
                {nameOf(findCharacter, p.character)} · {nameOf(findPlace, p.place)}
                <br />
                {formatDate(p.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {cursor && (
        <button className="adm-btn secondary" onClick={more} disabled={state === 'more'}>
          {state === 'more' ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  );
}

function Detail({ id }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(undefined);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    getPost(id)
      .then((p) => live && setPost(p))
      .catch(() => live && setPost(null));
    return () => {
      live = false;
    };
  }, [id]);

  async function remove() {
    if (!window.confirm('Delete this post for everyone? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      await deletePost(id);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err?.code === 'permission-denied'
          ? 'Firebase refused the delete. Check that this account is in the admins collection and the latest rules are published.'
          : 'Delete failed. Check your connection and try again.',
      );
      setDeleting(false);
    }
  }

  if (post === undefined) return <p className="adm-muted">Loading…</p>;
  if (post === null)
    return (
      <p className="adm-muted">
        This post does not exist (it may already be deleted). <Link to="/admin">Back to posts</Link>
      </p>
    );

  return (
    <article className="adm-detail">
      <Link to="/admin" className="adm-link">← All posts</Link>
      <div className="adm-detail-body">
        <img src={post.full} alt={post.caption} className="adm-photo" />
        <div className="adm-card">
          <dl className="adm-fields">
            <dt>Caption</dt>
            <dd>{post.caption}</dd>
            <dt>Character</dt>
            <dd>{nameOf(findCharacter, post.character)}</dd>
            <dt>Place</dt>
            <dd>{nameOf(findPlace, post.place)}</dd>
            <dt>Pin point</dt>
            <dd>
              {post.location ? (
                <>
                  <a href={post.location.url} target="_blank" rel="noopener noreferrer">
                    {formatLocation(post.location)}
                  </a>
                  <span className="adm-muted small adm-raw">Pasted: {post.location.raw}</span>
                </>
              ) : (
                '—'
              )}
            </dd>
            <dt>Posted</dt>
            <dd>{formatDate(post.createdAt)}</dd>
            <dt>ID</dt>
            <dd><code>{post.id}</code></dd>
            <dt>Public page</dt>
            <dd>
              <a href={`/gallery/${post.id}`} target="_blank" rel="noopener noreferrer">/gallery/{post.id}</a>
            </dd>
          </dl>
          {error && <p className="adm-error" role="alert">{error}</p>}
          <button className="adm-btn danger" onClick={remove} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete post'}
          </button>
        </div>
      </div>
    </article>
  );
}
