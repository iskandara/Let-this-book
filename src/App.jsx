import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { DraftProvider } from './draft.jsx';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import Intro from './pages/Intro.jsx';
import Home from './pages/Home.jsx';
import Characters from './pages/Characters.jsx';
import Places from './pages/Places.jsx';
import ChoosePhoto from './pages/ChoosePhoto.jsx';
import Review from './pages/Review.jsx';
import Success from './pages/Success.jsx';
import Gallery from './pages/Gallery.jsx';
import Post from './pages/Post.jsx';
import About from './pages/About.jsx';
import Book from './pages/Book.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

// Loaded only when someone opens /admin, so visitors never download it.
const Admin = lazy(() => import('./pages/admin/Admin.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <DraftProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/admin/:id?" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/capture" element={<Characters />} />
          <Route path="/capture/:character" element={<Places />} />
          <Route path="/capture/:character/:place" element={<ChoosePhoto />} />
          <Route path="/capture/:character/:place/review" element={<Review />} />
          <Route path="/success/:id" element={<Success />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<Post />} />
          <Route path="/about" element={<About />} />
          <Route path="/book" element={<Book />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </DraftProvider>
  );
}
