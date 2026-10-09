# Let This Book Be Your Public Space

The website for the activity book *Let This Book Be Your Public Space* by Jody Agus. Readers capture a moment:

1. choose a character,
2. choose a place,
3. take a photo or pick one from their gallery,
4. add a caption and paste a pin point from Google Maps.

Everyone's moments appear in a shared gallery. Visitors can filter it by character or place, and tapping a post's pin point opens Google Maps.

Built with React and Vite, with data in Firebase Firestore. It is designed for phones; on a desktop the pages show as a phone-width column on the sky background.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the Google Maps link parser
npm run build    # production build in dist/
```

The live Firebase config is in `.env`, so `npm run dev` reads and writes the **real** gallery. To try things without touching it, create `.env.local` with the four `VITE_FIREBASE_*` values left empty. That runs the site in **demo mode**: everything works, but moments are saved only in your own browser, and the gallery says so.

## Connect Firebase (one-time)

Photos are resized in the browser and stored in Firestore, so the free **Spark** plan is enough. The site does not use Cloud Storage, so you don't need to add a card.

1. Go to <https://console.firebase.google.com> and click **Create a project**. Google Analytics is not needed.
2. Go to **Build → Firestore Database → Create database**. Choose a location such as `asia-southeast2 (Jakarta)` and start in **production mode**.
3. Go to **Project settings → General → Your apps** and click the web icon `</>`. Register an app (Hosting is not needed) and copy the config values.
4. Put the four `VITE_FIREBASE_*` values in `.env`. This is already done for the live project.
5. Publish the security rules and indexes from this repository:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore --project YOUR_PROJECT_ID
   ```
   Without the CLI, you can paste `firestore.rules` into **Firestore → Rules** instead. The gallery filters each need an index. When one is missing, the browser console shows a link that creates it.

### What the rules allow

* Anyone can read posts and add new posts.
* A new post must have a caption of at most 280 characters, a valid character and place, a JPEG photo, and a pin point that is an `https` link. Posts cannot be edited or deleted from the website.
* **To remove a post:** in the Firestore console, delete both `posts/{id}` and `photos/{id}`. The id is the last part of the post's URL, for example `/gallery/AbC123`.

## Deploy on Vercel

1. On <https://vercel.com/new>, import this GitHub repository. Vercel detects the Vite framework preset automatically.
2. You don't need any environment variables, because the build reads `.env`.
3. Click **Deploy**. `vercel.json` makes direct links such as `/gallery/abc` work.
4. In Firebase, go to **Authentication → Settings → Authorized domains** and add your Vercel domain. This only matters if you later add sign-in.

## Project layout

```
public/img/          artwork, cut from the Figma exports
src/data.js          characters and places (names, slugs, artwork)
src/lib/location.js  turns pasted Google Maps links or coordinates into a pin
src/lib/image.js     resizes photos before upload
src/lib/store.js     Firestore reads and writes, plus the demo-mode fallback
src/pages/           one file per screen
firestore.rules      who may read and write what
```

### Adding a character or place

1. Add an image to `public/img/` named `char-<slug>.webp` or `place-<slug>.webp`.
2. Add an entry to `src/data.js`.
3. Add the slug to the allowed list in `firestore.rules` and publish the rules again.
