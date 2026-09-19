# Listen2ds — CMS state for frontend

Temporary snapshot of the Sanity studio as of **19 Sep 2026**. There is no frontend in this repo; this file is the content contract a frontend can build against.

**Project:** `listen2ds` (Sanity Studio v5.31.1)  
**Sanity project ID:** `4fqkkmt0`  
**Dataset:** `production`  
**API CDN:** `https://4fqkkmt0.api.sanity.io`

Use `@sanity/client` (or `next-sanity` / `@sanity/astro` / etc.) with:

```ts
{
  projectId: '4fqkkmt0',
  dataset: 'production',
  apiVersion: '2026-09-19', // pin to a date
  useCdn: true,              // false if you need drafts / live preview
}
```

---

## What exists today

This studio is a music blog CMS. Document types registered in `schemaTypes/index.ts`:

| Type     | `_type`  | Purpose                         | Dedicated page flag |
|----------|----------|---------------------------------|---------------------|
| Post     | `post`   | Blog / editorial writing        | none (always a slug) |
| Artist   | `artist` | Musician / act                  | `generatePage`      |
| Album    | `album`  | Release with cover + tracklist  | `generatePage`      |
| Song     | `song`   | Track, review, streaming links  | none                |
| Genre    | `genre`  | Tag / taxonomy                  | `generatePage`      |
| Page     | `page`   | Home + extra pages (page builder) | Home is `_id == "home"` (no slug); other pages have slugs |
| Navbar   | `navbar` | Site nav link list (singleton)  | `_id == "navbar"` |

Studio plugins: custom Structure tool + Vision. Navbar and Home are singletons in the desk (fixed IDs). No Presentation / Visual Editing, no TypeGen, no site settings/SEO document.

---

## Suggested frontend routes

Slugs are required on every document. `generatePage` defaults to `false` on artist / album / genre — only generate those routes when the flag is true.

| Route idea | Source | Filter |
|------------|--------|--------|
| `/` | `page` | `_id == "home"` |
| `/[slug]` | `page` | slug set, `_id != "home"` |
| `/posts/[slug]` | `post` | all published posts |
| `/artists/[slug]` | `artist` | `generatePage == true` |
| `/albums/[slug]` | `album` | `generatePage == true` |
| `/genres/[slug]` | `genre` | `generatePage == true` |
| `/songs/[slug]` | `song` | optional — songs have slugs but no page flag |

Do not include Home in the slug list used for static params. Navbar is not a route; query it once for the layout.

Posts have `publishedAt` (datetime, required). Filter with `publishedAt <= now()` if you want to hide future posts.

---

## Document fields

Required fields are marked **req**. All documents also have Sanity system fields: `_id`, `_type`, `_createdAt`, `_updatedAt`, `_rev`.

### `post`

| Field | Type | Notes |
|-------|------|--------|
| `title` | string **req** | |
| `slug` | slug **req** | sourced from `title` → `slug.current` |
| `publishedAt` | datetime **req** | defaults to now on create |
| `image` | image | no hotspot, no `alt` field |
| `body` | Portable Text (`block`) | standard marks/styles only |

### `artist`

| Field | Type | Notes |
|-------|------|--------|
| `name` | string **req** | preview title |
| `slug` | slug **req** | sourced from `name` |
| `image` | image | **hotspot enabled** |
| `bio` | Portable Text (`block`) | |
| `genres` | `reference[]` → `genre` | |
| `website` | url | `http` / `https` only |
| `generatePage` | boolean | default `false` |

### `album`

| Field | Type | Notes |
|-------|------|--------|
| `title` | string **req** | |
| `slug` | slug **req** | sourced from `title` |
| `artist` | `reference` → `artist` **req** | single artist |
| `coverImage` | image | **hotspot enabled** |
| `releaseDate` | date | date only, not datetime |
| `genres` | `reference[]` → `genre` | |
| `tracklist` | `reference[]` → `song` | order in the array is the track order |
| `description` | Portable Text (`block`) | |
| `generatePage` | boolean | default `false` |

### `song`

| Field | Type | Notes |
|-------|------|--------|
| `title` | string **req** | |
| `slug` | slug **req** | sourced from `title` |
| `artist` | `reference` → `artist` **req** | |
| `album` | `reference` → `album` **req** | every song belongs to an album |
| `trackNumber` | number | integer, positive |
| `duration` | string | display string, e.g. `"3:45"` — not seconds |
| `genres` | `reference[]` → `genre` | |
| `review` | Portable Text (`block`) | |
| `links` | object | see below |

`links` object:

| Field | Type |
|-------|------|
| `youtube` | url |
| `spotify` | url |
| `appleMusic` | url |

There is **no uploaded audio file**. Playback is via streaming URLs only (the `audioFile` field was removed).

### `genre`

| Field | Type | Notes |
|-------|------|--------|
| `name` | string **req** | |
| `slug` | slug **req** | sourced from `name` |
| `description` | text | plain text, not Portable Text |
| `generatePage` | boolean | default `false` |

### `page`

Home is the `page` document with `_id` `home` (drafts: `drafts.home`). Other pages are the same type with generated IDs.

| Field | Type | Notes |
|-------|------|--------|
| `title` | string **req** | |
| `slug` | slug | hidden / not required on Home; **req** on other pages, sourced from `title` |
| `pageBuilder` | `pageBuilder` array | ordered blocks; empty is valid |

`pageBuilder[]` members (`_type`):

| `_type` | Fields |
|---------|--------|
| `hero` | `heading` string **req**, `text` text, `image` (hotspot), optional `button` (`link`) |
| `richText` | `content` Portable Text (`block`) |
| `featuredPosts` | optional `heading`, `posts` `reference[]` → `post` |
| `featuredAlbums` | optional `heading`, `albums` `reference[]` → `album` |
| `featuredArtists` | optional `heading`, `artists` `reference[]` → `artist` |

Always include `_key` when projecting `pageBuilder[]`. Treat a hero `button` with no `label` as absent.

### `navbar`

Singleton `_id` `navbar`. Empty `items` is valid.

| Field | Type | Notes |
|-------|------|--------|
| `items` | `link[]` | ordered nav links |

### `link` object

Used by `navbar.items` and `hero.button`. No document references.

| Field | Type | Notes |
|-------|------|--------|
| `label` | string **req** when the link is in use | |
| `linkType` | `path` \| `url` **req** when in use | radio in Studio |
| `path` | string | when `linkType == "path"`; must start with `/` (e.g. `/`, `/posts`) |
| `url` | url | when `linkType == "url"`; `http` / `https` only |

---

## Relationships

```
genre  <—— (array) —— artist
genre  <—— (array) —— album
genre  <—— (array) —— song

artist <—— (single, required) —— album
artist <—— (single, required) —— song

album  —— (tracklist array) ——> song
song   —— (required album)  ——> album
```

Bidirectional album ↔ song: prefer expanding `tracklist` from the album and do **not** also dereference `album` from each song in the same query (circular GROQ).

A song always has both `artist` and `album`. The album also has `artist`. Those two artist refs can theoretically diverge — treat album.artist as canonical for album pages, song.artist for song cards if you show standalone tracks.

---

## Images and rich text

- Images are Sanity image assets. Build URLs with `@sanity/image-url`.
- Hotspot is on `artist.image`, `album.coverImage`, and `hero.image`. Honor hotspot/crop when cropping.
- No `alt` text fields anywhere. Fallback to document title/name, or add alts in the schema later.
- Portable Text (`type: 'block'`) is used for `post.body`, `artist.bio`, `album.description`, `song.review`, and `richText.content`. No custom block types (no embeds, no images-in-text, no callouts). Render with `@portabletext/react` (or the equivalent for your framework).
- `genre.description` and `hero.text` are plain `text` strings, not Portable Text.

---

## Example GROQ

```groq
// Posts index
*[_type == "post" && defined(slug.current) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    image
  }

// Album page (only when generatePage is on)
*[_type == "album" && slug.current == $slug && generatePage == true][0] {
  _id,
  title,
  "slug": slug.current,
  releaseDate,
  coverImage,
  description,
  artist->{ _id, name, "slug": slug.current, image, generatePage },
  genres[]->{ _id, name, "slug": slug.current, generatePage },
  tracklist[]->{
    _id,
    title,
    "slug": slug.current,
    trackNumber,
    duration,
    review,
    links
  }
}

// Artist page
*[_type == "artist" && slug.current == $slug && generatePage == true][0] {
  _id,
  name,
  "slug": slug.current,
  image,
  bio,
  website,
  genres[]->{ _id, name, "slug": slug.current, generatePage },
  "albums": *[_type == "album" && artist._ref == ^._id] | order(releaseDate desc) {
    _id, title, "slug": slug.current, coverImage, releaseDate, generatePage
  }
}

// Genre page
*[_type == "genre" && slug.current == $slug && generatePage == true][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  "albums": *[_type == "album" && references(^._id)] { _id, title, "slug": slug.current, coverImage, generatePage },
  "artists": *[_type == "artist" && references(^._id)] { _id, name, "slug": slug.current, image, generatePage }
}
```

Static params for generatePage types:

```groq
*[_type == "album" && generatePage == true && defined(slug.current)].slug.current
```

```groq
// Navbar (once per layout)
*[_id == "navbar"][0]{
  items[]{ _key, label, linkType, path, url }
}

// Home
*[_id == "home"][0]{
  _id,
  title,
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "hero" => { button { label, linkType, path, url } },
    _type == "featuredPosts" => { posts[]->{ _id, title, "slug": slug.current, publishedAt, image } },
    _type == "featuredAlbums" => { albums[]->{ _id, title, "slug": slug.current, coverImage, artist->{ name } } },
    _type == "featuredArtists" => { artists[]->{ _id, name, "slug": slug.current, image } }
  }
}

// Other pages
*[_type == "page" && slug.current == $slug && _id != "home"][0]{
  _id,
  title,
  "slug": slug.current,
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "hero" => { button { label, linkType, path, url } },
    _type == "featuredPosts" => { posts[]->{ _id, title, "slug": slug.current, publishedAt, image } },
    _type == "featuredAlbums" => { albums[]->{ _id, title, "slug": slug.current, coverImage, artist->{ name } } },
    _type == "featuredArtists" => { artists[]->{ _id, name, "slug": slug.current, image } }
  }
}

// Page slugs for static params (exclude Home)
*[_type == "page" && defined(slug.current) && _id != "home"].slug.current
```

---

## Not in the CMS yet (frontend implications)

- No site settings, logo, footer, author, or SEO document.
- No SEO fields (meta title/description, OG image) on any type.
- No draft/preview Presentation setup — published dataset only unless the frontend uses a token + `perspective: 'drafts'`.
- No generated TypeScript types (`sanity typegen`). Frontend will need hand-written types or to add TypeGen later.
- `post.image` has no hotspot; artist/album/hero images do.
- Songs cannot exist without an album (required reference).
- Albums have a single artist — no various-artists / featured-artists model.
- Duration is a free-form string, not a numeric duration.

---

## Recent schema change

`song.audioFile` (file upload, `audio/*`) was removed. Do not query or render local audio assets; use `links.youtube` / `links.spotify` / `links.appleMusic`.
