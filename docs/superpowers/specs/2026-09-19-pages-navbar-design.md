# Pages, Home, and Navbar

Date: 2026-09-19  
Status: approved in conversation; awaiting spec review before implementation  
Project: Listen2ds Sanity Studio (`studio-listen2ds`)

## Goal

Give editors a single reusable **Page** type (Home is one locked page; more pages can be added later) and a **Navbar** singleton that is only an ordered link list. The frontend can query nav once for every route and load page builder blocks for `/` and `/[slug]`.

This studio has no frontend in-repo. Schema, Structure, and the frontend contract file (`tmp-frontend-state.md`) are in scope. No Next.js (or other) app work.

## Non-goals

- Site settings, logo, SEO fields, footer, social links
- Navbar links as references to documents
- Extra page-builder blocks beyond the five listed below
- Presentation / Visual Editing / TypeGen
- Creating the Home or Navbar documents in the dataset automatically (editors open them in Studio; first save creates them)

## Architecture

Three editorial surfaces, two schema document types:

| Studio label | Schema `_type` | Document `_id` | Cardinality |
|--------------|----------------|----------------|-------------|
| Navbar | `navbar` | `navbar` | singleton |
| Home | `page` | `home` | singleton (same type as Pages) |
| Pages | `page` | Sanity-generated | collection, excluding `_id == "home"` |

Home is not a second schema. It is a `page` document with a fixed ID so Studio can open it as one editor and the frontend can fetch `/` with `*[_id == "home"][0]`.

Shared object types:

- `pageBuilder` — array of block objects
- `hero`, `richText`, `featuredPosts`, `featuredAlbums`, `featuredArtists` — blocks
- `link` — object: label + site path or external URL (navbar items; optional hero button)

## Navbar

Document type `navbar`, title **Navbar**, icon `MenuIcon`.

Fields:

- `items` — array of `link` objects

No internal document references.

Query: `*[_id == "navbar"][0] { items[] { _key, label, linkType, path, url } }`

## `link` object

Reusable object type `link`, icon `LinkIcon`.

- `label` — string, required
- `linkType` — string, required, radio: `path` (Site path) or `url` (External URL)
- `path` — string, hidden unless `linkType == "path"`, required in that case. Examples: `/`, `/posts`. Must start with `/`.
- `url` — url, hidden unless `linkType == "url"`, required in that case, `http`/`https` only

Preview: `label` as title, path or url as subtitle.

## Page

Document type `page`, title **Page**, icon `DocumentIcon`.

Fields:

- `title` — string, required
- `slug` — slug from `title`. Hidden when the document `_id` is `home` (including draft ID `drafts.home`). Required when the document is not Home. No uniqueness validator in v1; the frontend uses the first published match for a slug.
- `pageBuilder` — array type `pageBuilder` (see below)

Home (`_id` `home` / `drafts.home`) has no slug because its route is `/`. Other pages route as `/[slug]`.

## Page builder

Named array type `pageBuilder`:

```text
pageBuilder[] of: hero | richText | featuredPosts | featuredAlbums | featuredArtists
```

Blocks are **objects** nested on the page, not referenced documents. The same block type may appear more than once. Each array item has Sanity `_key` (frontend React key). Insert menu can be the default list; no preview thumbnails required.

### `hero`

- `heading` — string, required
- `text` — text (plain, short)
- `image` — image, hotspot enabled
- `button` — optional `link` object. If omitted or empty, the frontend renders no button.

Preview: heading, subtitle `Hero`, media = image.

### `richText`

- `content` — Portable Text `block` only (same as `post.body` today: no custom blocks)

Preview: first text snippet or “Rich text”, subtitle `Rich text`.

### `featuredPosts`

- `heading` — string, optional
- `posts` — array of references to `post`

Preview: heading or “Featured posts”, subtitle with count.

### `featuredAlbums`

- `heading` — string, optional
- `albums` — array of references to `album`

Preview: heading or “Featured albums”, subtitle with count.

### `featuredArtists`

- `heading` — string, optional
- `artists` — array of references to `artist`

Preview: heading or “Featured artists”, subtitle with count.

Do not dereference nested album/artist graphs inside the block schema; the frontend expands what it needs in GROQ.

## Studio structure

Custom `structureTool` resolver. Sidebar order:

1. Navbar (singleton `navbar` / `documentId('navbar')`)
2. Home (schema `page` / `documentId('home')`, title **Home**)
3. Divider
4. Remaining document type lists from `S.documentTypeListItems()`, with `navbar` excluded (so Navbar is not also a list)
5. Pages list must **exclude** `_id == "home"` and `_id == "drafts.home"` so Home is not duplicated. If the default list item cannot filter easily, replace the `page` list item with a filtered `S.documentTypeList('page').filter('_id != "home" && _id != "drafts.home"')`.

New-document menu: filter out `navbar`. Home is only created by opening the Home structure item (first save writes `_id: "home"`). Editors can still create additional `page` documents from Pages.

## File layout

```text
schemaTypes/
  index.ts                 # register documents + objects
  pageType.ts
  navbarType.ts
  objects/
    linkType.ts            # label + path/url; navbar items and hero button
    pageBuilderType.ts
    heroType.ts
    richTextType.ts
    featuredPostsType.ts
    featuredAlbumsType.ts
    featuredArtistsType.ts
structure/
  index.ts                 # StructureResolver
sanity.config.ts           # structureTool({ structure })
tmp-frontend-state.md      # update contract
```

Existing post/artist/album/song/genre types stay as they are.

## Frontend contract

Add to `tmp-frontend-state.md`:

Suggested routes:

| Route | Source |
|-------|--------|
| `/` | `page` `_id == "home"` |
| `/[slug]` | `page` with slug, `_id != "home"` |

Home is not in the slug list used for static params.

Example GROQ:

```groq
*[_id == "navbar"][0]{
  items[]{ _key, label, linkType, path, url }
}

*[_id == "home"][0]{
  _id,
  title,
  pageBuilder[]{
    _key,
    _type,
    ...,
    _type == "featuredPosts" => { posts[]->{ _id, title, "slug": slug.current, publishedAt, image } },
    _type == "featuredAlbums" => { albums[]->{ _id, title, "slug": slug.current, coverImage, artist->{ name } } },
    _type == "featuredArtists" => { artists[]->{ _id, name, "slug": slug.current, image } }
  }
}

*[_type == "page" && slug.current == $slug && _id != "home"][0]{
  _id,
  title,
  "slug": slug.current,
  pageBuilder[]{ /* same projection as home */ }
}
```

## Validation and empty states

- Navbar with zero items is valid (frontend renders no links).
- Page with empty `pageBuilder` is valid (frontend renders title only or an empty page).
- Featured blocks with empty reference arrays are valid.
- Path fields: required to start with `/`; no requirement that the path exists in the frontend.
- Do not generate deterministic IDs except `navbar` and `home`.

## Testing (studio)

- Open Navbar: one editor, cannot create a second navbar from the sidebar list.
- Open Home: one editor, no slug field, can add/reorder the five blocks.
- Create a Page: title, slug, same blocks; it appears under Pages, not as a second Home.
- Hero button and nav item: switching link type hides the other field and requires the visible one.

## Implementation notes

Follow Sanity schema helpers (`defineType`, `defineField`, `defineArrayMember`) and `@sanity/icons`. Conditional fields on `link` use `hidden` based on `linkType`. Page slug is hidden when `document._id` is `home` or `drafts.home`. Hero GROQ can project `button { label, linkType, path, url }` from the nested `link` object.
