export default function About() {
  return (
    <div className="about">
      <section className="page-pad prose">
        <h1 className="title-light small">What is this about</h1>
        <p>
          Let This Book Be Your Public Space is not meant to be finished — it’s meant to be entered, wandered, and gently
          abandoned. It’s a book that doesn’t want to be read — it wants to be used.
          <br />
          Part game, part toolkit, part poetic ritual, this book invites you to interact with the forgotten parts of your
          city: a park bench, a patch of light, a too-loud hallway, or the inside of a library shelf.
          <br />
          Inside, you’ll find characters who each offer their own lens on public space. Paired with them are quests —
          small actions, creative instructions, and soft disruptions — that invite you to reclaim your surroundings
          through presence, play, and invention.
        </p>
        <p>It’s made for cities like Jakarta, where public space is rare — but imagination is not.</p>
      </section>

      <section className="sky prose">
        <figure className="author">
          <img src="/img/author.webp" alt="Portrait of Jody Agus in a plastic bag" width="385" height="456" />
          <figcaption>
            Jody Agus
            <br />
            Author
            <a href="https://www.instagram.com/jodyyyagus/" target="_blank" rel="noopener noreferrer" className="insta">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
              @jodyyyagus
            </a>
          </figcaption>
        </figure>
        <p>
          Supported by: Locarno Film Festival’s BaseCamp program, 2025
          <br />
          This book is a quiet invitation to reconnect with public life — to reclaim space through play, presence, and
          imagination.
        </p>
        <p>Created by Jody Agus</p>
        <p>
          With gratitude to: Selarashita Lufingga, Ayah, Bunda, Audie Agus, Anik, Justine Stella Knuchel, Francesco De
          Biasi, Stefano Knuchel, David, Micky, Timo, Yusra, Valerie, Aprille, Axel Putra, Giovanni Rahmadeva, Denys
          Prayoga, Iskandar Agung, Siera Tamihardja, Shahriza Rijadi, Dhiwangkara Seta, Michelle Natania, Adhitya Fei,
          Andhika Dwivanara, Nadira Syafiqa, Izzi Husaini, and the BaseCamp team — for believing in gentle things. And to
          the streets of Jakarta, for their noise, chaos, beauty, and contradiction. To the benches, the shadows, the
          strangers.
        </p>
      </section>
    </div>
  );
}
