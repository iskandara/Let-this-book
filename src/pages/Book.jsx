const SHOTS = [
  { src: '/img/book-1.webp', alt: 'The book held up against a blue sky', wide: true },
  { src: '/img/book-2.webp', alt: 'The book open on a character page' },
  { src: '/img/book-3.webp', alt: 'Copies of the book on a red chair' },
  { src: '/img/book-4.webp', alt: 'The book open on the public park spread', wide: true },
  { src: '/img/book-5.webp', alt: 'The book open on the prayer page' },
  { src: '/img/book-6.webp', alt: 'The book standing on gravel' },
];

export default function Book() {
  return (
    <div className="book">
      <h1 className="title-light page-pad">Closer Look of the Book</h1>
      <div className="book-grid">
        {SHOTS.map((s) => (
          <img key={s.src} src={s.src} alt={s.alt} loading="lazy" className={s.wide ? 'wide' : ''} />
        ))}
      </div>
    </div>
  );
}
