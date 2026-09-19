# Pages, Home, and Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Navbar singleton and a reusable Page type (Home is the locked `page` document `_id: home`) with a five-block page builder in Listen2ds Studio.

**Architecture:** Object types (`link`, hero/featured/rich-text blocks, `pageBuilder` array) feed `page` and `navbar` documents. Custom Structure pins Navbar and Home; Pages is a filtered list. No frontend app work — update `tmp-frontend-state.md` as the contract.

**Tech Stack:** Sanity Studio v5.31.1, `defineType`/`defineField`/`defineArrayMember`, `sanity/structure`, `@sanity/icons`, TypeScript.

## Global Constraints

- Prettier: `bracketSpacing: false`, `printWidth: 100`, `semi: false`, `singleQuote: true`
- Deterministic IDs only for `navbar` and `home`
- Navbar links: label + site path or external URL — no document references
- Home slug hidden; required on other pages
- Do not commit unless the user asks

---

### Task 1: Schema objects, page, navbar, structure, contract

**Files:**
- Create: `schemaTypes/objects/linkType.ts`
- Create: `schemaTypes/objects/heroType.ts`
- Create: `schemaTypes/objects/richTextType.ts`
- Create: `schemaTypes/objects/featuredPostsType.ts`
- Create: `schemaTypes/objects/featuredAlbumsType.ts`
- Create: `schemaTypes/objects/featuredArtistsType.ts`
- Create: `schemaTypes/objects/pageBuilderType.ts`
- Create: `schemaTypes/pageType.ts`
- Create: `schemaTypes/navbarType.ts`
- Create: `structure/index.ts`
- Modify: `schemaTypes/index.ts`
- Modify: `sanity.config.ts`
- Modify: `tmp-frontend-state.md`

**Interfaces:**
- Consumes: existing `post`, `album`, `artist` document types
- Produces: `_type` values `link`, `hero`, `richText`, `featuredPosts`, `featuredAlbums`, `featuredArtists`, `pageBuilder`, `page`, `navbar`; singleton IDs `navbar`, `home`

- [x] **Step 1: Add schema, structure, and frontend contract files** (full contents in the implementation)

- [x] **Step 2: Typecheck**

Run: `npx tsc --noEmit`

Expected: exit 0 (confirmed)

- [x] **Step 3: Verify Studio**

Run: `npm run dev` and confirm Navbar, Home (no slug), Pages list, and page-builder blocks.

Studio started at http://localhost:3333/. Logged-out login screen blocked click-through; `npx sanity schema extract` confirmed all new types. Typecheck passed.

No commit unless asked.
