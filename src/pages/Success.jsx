import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Frame from '../components/Frame.jsx';
import { getPost } from '../lib/store.js';

export default function Success() {
  const { id } = useParams();
  const [image, setImage] = useState(useLocation().state?.image);
  useEffect(() => {
    if (!image) getPost(id).then((p) => p && setImage(p.full)).catch(() => {});
  }, [id, image]);

  return (
    <div className="page-pad success">
      <h1 className="title-bold">Success!</h1>
      {image && <Frame src={image} alt="Your moment" ratio="588 / 636" className="photo" />}
      <div className="success-text">
        <p>You have joined others for a quest to search for their public space.</p>
        <p>You could close this web, and enjoy your current space.</p>
        <p>or</p>
        <p>See what others doing by clicking gallery</p>
      </div>
      <Link to="/gallery" className="oval-btn">View Gallery</Link>
    </div>
  );
}
