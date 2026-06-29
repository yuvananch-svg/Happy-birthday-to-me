# Anniversary Quest

A private pixel story game for a 2 years 5 months anniversary and birthday celebration.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local`:

```env
ANNIVERSARY_ALLOWED_NAME=Perthyw
ANNIVERSARY_ALLOWED_CODE=happy birthday to me
ANNIVERSARY_COOKIE_SECRET=replace-with-a-long-random-string
```

Open `http://localhost:3000`.

## Media

Put images in:

```text
public/memories/images/
```

Put short optimized MP4 videos in:

```text
public/memories/videos/
```

Keep the GitHub repo private because media files are personal.

## Scripts

```bash
npm run dev
npm run build
npm run test
```

## Deployment

Deploy through Vercel and set the same environment variables in the Vercel project settings.
