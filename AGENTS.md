# AGENTS.md

This repo is the **Listen2ds Sanity Studio** — CMS only. There is no frontend application here.

- Studio: Sanity v5 (`sanity` / `@sanity/vision`)
- Project ID: `4fqkkmt0`
- Dataset: `production`
- Dev: `npm run dev` → http://localhost:3333/
- Frontend contract: `tmp-frontend-state.md` (keep in sync when schema or Structure changes)

## Commands

```bash
npm run dev      # Studio
npx tsc --noEmit # typecheck (no test suite)
```

Do not commit unless asked. Do not change `projectId` / `dataset`. Do not generate TypeGen, Presentation, or a frontend unless requested.

## Layout

```
sanity.config.ts          # structureTool + Vision; hide navbar from new-doc templates
structure/index.ts        # desk: Navbar + Home singletons, then collections
schemaTypes/              # documents
schemaTypes/objects/      # link, page-builder blocks, pageBuilder array
tmp-frontend-state.md     # GROQ / field contract for a future frontend
```

Register every new type in `schemaTypes/index.ts`.

## Schema conventions

- Use `defineType`, `defineField`, and `defineArrayMember` from `sanity`.
- Give document and object types an icon from `@sanity/icons`.
- Model **what the content is**, not layout (`heading`, not `bigHeroText`).
- Relationships: `reference` / `reference[]`. Nested `object` only when the data is unique to that parent (page-builder blocks, `link`).
- Let Sanity generate `_id` for ordinary documents. Fixed IDs only for singletons:
  - Navbar: `_type: navbar`, `_id: navbar`
  - Home: `_type: page`, `_id: home` (drafts: `drafts.home`)
- When adding another singleton: pin it in `structure/index.ts`, exclude it from generic lists, and filter it out of `schema.templates` in `sanity.config.ts` if editors should not create a second copy.
- Home has no slug (route is `/`). Other `page` documents require a slug. Keep Home out of the Pages list (`_id != "home" && _id != "drafts.home"`).
- `generatePage` on artist / album / genre defaults to `false`. Dedicated frontend routes only when it is true.
- Songs have streaming URLs (`links.youtube` / `spotify` / `appleMusic`) only — no audio file uploads.
- Navbar `link` items are **label + site path or external URL**. Do not add document references to nav unless explicitly requested.
- Page builder blocks live as objects on `page.pageBuilder`: `hero`, `richText`, `featuredPosts`, `featuredAlbums`, `featuredArtists`. Add new blocks as object types under `schemaTypes/objects/` and register them on `pageBuilderType`.
- Images: enable hotspot where cropping matters (`artist.image`, `album.coverImage`, `hero.image`). There are no `alt` fields yet.
- Portable Text is `block` only (no custom PT types unless requested). `genre.description` and `hero.text` are plain text.

## Style

Match Prettier in `package.json`: no semicolons, single quotes, `printWidth` 100, `bracketSpacing: false`.

```ts
defineField({
  name: 'title',
  type: 'string',
  validation: (rule) => rule.required(),
})
```

## After schema changes

1. Update `tmp-frontend-state.md` (types, fields, routes, example GROQ).
2. Run `npx tsc --noEmit`.
3. If the change is user-visible in Studio, verify in the running studio (sidebar, forms, singletons vs lists).
