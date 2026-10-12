# Sports build and UI audit

Repair date: 2026-10-12. Merge and deployment approved after exact-commit checks pass.

## Reproduced failures and repair

- Original installation fails peer resolution: unused `next-mdx-enhanced@5` requires Next 9–10, while this app uses Next 16. Remove only that unused integration; preserve other dependency ranges.
- The existing webpack customization requires explicit `--webpack` with Next 16. Its removed `next lint` command must use the existing standalone ESLint configuration.
- Two EarnTheWorld posts had unescaped apostrophes in single-quoted YAML titles/summaries. Correct quoting preserves their intended text.
- Bind Vercel, CI, and local use to pnpm 10.33.4 and a frozen lockfile.
- Limit concurrent MDX compilation to two workers. Eight workers exhausted the local build environment; two succeeded.
- IndexNow publishing is now an explicit command, not a side effect of preview builds.

## Passed locally

- [x] All 484 frontmatter files parse.
- [x] Non-mutating lint.
- [x] Production compilation: 1,576 generated pages, including 483 article routes, zero not-found fallbacks.
- [x] RSS and sitemap generation.
- [x] Final pinned lockfile generation and offline frozen validation.

## Required final checks

- [ ] Clean CI install and native dependency scripts with final lockfile.
- [ ] Final lint, full production build, and all article-route assertions.
- [ ] Exact-commit Vercel preview and production deployment.
- [ ] Desktop and mobile home, list, article, tags, project page, search, pagination.
- [ ] Image loading, keyboard focus, theme toggle, navigation and Back/Forward.

## Performance follow-up

- [ ] Reduce home/blog listing serialized page data (observed 283–286 kB versus Next's 128 kB warning threshold) without removing posts or metadata.

Shared catalog definitions and generated project assets are unchanged. Local build output and feeds are not included as unrelated source changes.
