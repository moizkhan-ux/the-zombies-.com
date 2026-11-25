# AGENTS.md: instructions for Cursor / AI agents

Project: **ACD Academy – Class 9** class website. Astro static site, deployed to Cloudflare Pages.

## Commands
- `npm install` then `npm run dev` (http://localhost:4321)
- `npm run build` builds to `dist/`
- `npm run deploy` builds and deploys with Wrangler

## Where things live
| To change… | Edit |
|---|---|
| Students (name, talent, skills, behaviour, notes) | `src/data/students.ts` |
| Teachers (name, subject, rating, description) | `src/data/teachers.ts` |
| Colors / fonts / theme | top of `src/styles/global.css` (`:root` variables, yellow theme + dark mode) |
| Page order | `src/pages/index.astro` |
| Navbar, hero, about, footer | `src/components/*.astro` |
| Popup (student/teacher details) | `src/components/DetailDialog.astro` |
| Head / SEO / title | `src/layouts/Layout.astro` |

## Rules
- Overall score, rating and rank are calculated in `students.ts`; never hard-code them.
- Keep dark mode working: use the CSS variables, never fixed colors, in components.
- Keep the site static and accessible (labels, focus styles, reduced-motion).
- Do not add a framework (React/Vue) unless asked.
