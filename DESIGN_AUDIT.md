# Design Audit

Reviewed on 2026-10-07 against https://www.x-agi.cc/ and its About page.

Updated on 2026-10-08: the header now has one container for its glass background and grid row. Navigation shows inline links whenever their natural width fits alongside the name and theme control; otherwise it uses Menu. Header layout has no device breakpoints or orientation timers. Its styles live in `_sass/_masthead.scss`, with disclosure and content-fit behavior in `assets/js/site.js`.

Verified continuous resizing, without page reloads, at 320, 390, 600, 601, 761, 768, 844, 1024, 1150, and 1280px, including landscape/portrait transitions. The name, controls, and visible links remained within the capsule; no horizontal page overflow was found. Menu opening, viewport bounds, and Escape focus restoration passed. The preview uses an isolated build directory and the same origin for the page and assets.

## Findings And Corrections

| Finding | Result |
| --- | --- |
| Decorative corner lines, layered panel shadows, and framed reading sections competed with the text. | Removed the decorative main-layout pseudo-elements and panel treatments. Reading content and the profile now sit directly on the page. |
| Repeated overrides made spacing, typography, and hover states inconsistent. | Consolidated the custom stylesheet into one shared design system with explicit light/dark colors and responsive rules. |
| Publication titles and metadata had a different scale across the homepage and archive. | Both lists and paper details use 24px titles, 16px metadata, and 18px abstracts on desktop/tablet; mobile uses 22px, 14px, and 15px respectively. |
| The first About paragraph used a lead style with a barely different size. | All reading paragraphs and research list items use 20px on desktop/tablet and 15px on mobile with the same line height. The first paragraph has no special size. |
| The mixed biography columns and research/recruitment grid fragmented the reading order. | Replaced them with one reading column below a compact identity band. The order is About, Research, Recruitment, then Recent publications. |
| Fun facts occupied a full reading section despite being secondary content. | Moved the original text into an animated glass popover on the homepage portrait. Mouse hover or keyboard focus reveals it; click/tap pins it open. Escape, outside click, and a close control dismiss it. Native disclosure remains available without JavaScript. |
| The desktop header hid every navigation link behind Menu. | Desktop now shows inline links in an inset floating glass capsule; mobile retains the glass disclosure menu. |
| Moving publications near the top interrupted the requested page structure. | Restored papers as the last content section, retaining the scroll-snap carousel with previous/next controls, position/progress feedback, native horizontal scrolling, and keyboard navigation. |
| Navigation and controls felt static. | Added sliding active/hover indicators, scroll-sensitive glass navigation, a floating section bar with reading progress and back-to-top, staggered section entrances, and subtle pointer/press feedback on icon controls. |
| Hover treatments moved publication rows and could reveal an abstract without matching its accessible state. | Rows stay stationary. Abstracts open with an explicit control, with synchronized expanded/hidden states. |
| The old navigation script could hide the new menu. Header effects also prevented the menu from blurring text behind it. | Isolated the disclosure menu from the old navigation hook and placed header blur on its own background layer. |
| The legacy navigation plugin recursed when its original menu was absent, causing a browser error on load and resize. | Guarded absent navigation and bounded recursion to remaining links. Removed the legacy anchor-scrolling override so native scrolling and reduced-motion rules apply consistently. |
| Mobile contact disclosures hid useful information and introduced extra boxes. | Contacts stay visible and wrap into the available space. |
| Legacy social icons and controls used fixed colors that became unreadable in dark mode. | Contact/footer icons inherit theme colors; paper-sharing and pagination controls use the common palette and scale. |
| Long paper records showed a title but omitted metadata already stored in the site. | Records show authors, venue, and a paper link. Empty record bodies display their stored abstract when available. |
| An intro-page recruitment link pointed to a Markdown filename. | Changed it to the actual recruitment route. |
| Previewing at 127.0.0.1 while assets used localhost caused cross-origin icon-font failures. | Use the configured preview origin, http://localhost:4000/. |
| The lower bar was limited to the homepage and a fixed set of section links. | Moved it to the shared layout. Links, labels, order, and count come from each page's reading-content H2 headings (`##` in Markdown); generated paper titles and blockquotes are excluded. Existing heading anchors are retained, and missing anchors are generated without collisions. |
| More header links could exceed the available width. | Measure the complete menu, including when closed, and switch to the glass disclosure whenever links do not fit. Longer disclosure menus scroll vertically; longer section bars scroll horizontally. |
| OScholar and the lab's shared code destination were missing. | Added OScholar to shared profile contacts and a prominent GitHub link below the MOFA Lab introduction. Corrected the lab's recruitment route. |
| Repeated member biographies and education lists made MOFA Lab difficult to scan. | Replaced them with unframed name/research rows. Education, additional background, and advisors appear in glass popovers using the portrait's shared hover/focus/tap behavior. Only one opens at a time, with close, Escape, and outside-click dismissal. Panels choose space above or below the row and scroll internally when needed. |

## Reference Mapping

- **Typography:** use the reference's Avenir Next/Avenir-led stack, including its Helvetica Neue and CJK fallbacks. Avenir is platform-installed, not bundled; other systems use the specified fallbacks and may render differently.
- **Navigation:** the reference's floating glass capsule, adapted to the academic site's routes. Show links inline when their natural widths fit; otherwise use Menu and a glass disclosure panel. The background and row share one width container. A sliding highlight follows hover/focus and the active page or section. Blur lives on the container's background layer so the dropdown can blur content behind it. The lower bar derives its section links automatically on all pages using the shared default layout. Adding a top-level page link requires an entry in `_data/navigation.yml`.
- **Surfaces:** reserve glass for floating navigation and controls. Keep reading sections unframed in one column, with consistent alignment and 48px section gaps (40px on mobile). The homepage is capped at 1000px including side padding.
- **Motion:** reference-style horizontal browsing for publications, arrow and icon feedback, staggered one-time section entrances, scroll-sensitive header styling, and a section dock with a reading-progress ring. No autoplay. Reading content is visible without JavaScript. Reduced motion bypasses section animation, pointer movement, and smooth scrolling as well as CSS transitions.
- **Color:** adapt the reference's quiet contrast and restrained accents to a neutral light surface and charcoal dark surface, with violet links and teal secondary text.
- **Content:** retain the academic profile, biography, research, recruitment, and personal content. Adapt the reference's carousel to papers. Compact carousel metadata is limited to two visible lines; the archive and paper records retain complete metadata.

## Typography

| Role | Desktop (>1150px) | Tablet (601–1150px) | Mobile |
| --- | --- | --- | --- |
| Reading body and intro paragraphs | 16px | 16px | 15px |
| Publication abstracts and member details/focus | 16px | 16px | 15px |
| Page titles and homepage name | 36px | 34px | 32px |
| Section headings | 28px | 27px | 26px |
| General subheadings | 22px | 22px | 22px |
| Publication titles and member names | 22px | 22px | 22px |
| Paper-detail Abstract heading | 18px | 18px | 18px |
| Publication/member metadata and links | 14px | 14px | 14px |
| Contacts | 15px | 14px | 14px |
| Header name / navigation and controls | 20px / 14px | 20px / 14px | 20px / 14px |
| Publication search | 14px | 14px | 16px |
| Publication/member labels | 13px | 13px | 13px |
| General small labels and footer | 13px | 13px | 13px |

Mobile content styling applies at 600px and below, and in short landscape viewports up to 900px wide and 600px tall. The header adapts only to the space its content needs.

## Previous Typography Verification (2026-10-07)

- Reviewed the homepage, publication archive, Recruitment, and MOFA Lab at 320px, 375px, 768px, and 1280px. No horizontal page overflow was found, and profile images loaded.
- Computed styles confirmed equal intro paragraphs, matching publication-title sizes across homepage/archive, and the intended compact member scale. Desktop/tablet reading text remains 20px.
- A representative long-title paper record was checked at 375px, 768px, and 1280px. Its title matches list titles at 22px mobile and 24px desktop/tablet; the Abstract heading is subordinate at 18px and 20px. Abstract text is 15px and 18px respectively.
- Reviewed mobile light and desktop dark member popovers. Panels fit the reading column, and long mobile details scroll internally. Checked Escape dismissal for member panels and the mobile menu, including menu focus restoration.
- Checked publication search with "LoRA" and expanded its abstract; mobile abstract text is 15px with a 26.25px line height. Reviewed the dark archive rendering.
- Section links still resolve to headings: four on the homepage, five on MOFA Lab, and three on Recruitment. The archive retains back-to-top without treating generated paper titles as reading sections.
- Jekyll development build and whitespace checks passed. No warning/error console entries were captured during the final paper-detail check.

## Earlier Verification

The following records describe earlier design revisions; their former font sizes have been superseded by the table above.

- This revision was inspected at 1280px desktop, 768px tablet, and 375px mobile widths. The header switches to Menu below 820px and when additional links no longer fit.
- Computed styles confirmed homepage reading paragraphs and recruitment text are 20px, publication titles are 28px, archive metadata is 18px, and abstracts are 20px. The mobile homepage name is 42px.
- Confirmed the homepage's final section is Recent publications.
- Checked portrait popover click opening, keyboard focus opening, Escape and outside-click dismissal, the close control, and mobile bounds at 375px. Body text remains 20px. Hover is implemented through pointer enter/leave; direct hover automation was unavailable.
- Checked carousel movement and position feedback, section navigation, active-section tracking, the progress ring, and back-to-top. Native touch scrolling is supported; a physical touch-device swipe was not tested.
- Reviewed mobile menu appearance, opening, and Escape dismissal with focus restoration.
- Checked publication search and abstract expansion/collapse after the shared typography changes. Year filtering, no-results feedback, carousel keyboard navigation, outside-click dismissal, and menu keyboard entry were also checked in the preceding revision; their logic remains intact.
- Reviewed the homepage in light and dark themes and the mobile archive. No horizontal page overflow was found in the reviewed layouts.
- Recruitment was checked as a representative shared-layout page. MOFA Lab and a long-title publication record were reviewed in the preceding revision.
- Jekyll development build, JavaScript syntax, and whitespace checks passed.
- A fresh browser tab was checked for console errors during load, carousel interaction, and responsive resizing.
- Verified automatic section counts of four on the homepage, five on MOFA Lab, and three on Recruitment. Section jumps and active highlights were checked on all three pages. The publication archive has no reading-section H2s and shows only back-to-top, excluding generated paper titles.
- A temporary generated page with four extra H2s (eight sections total) and eight extra header links confirmed automatic anchor creation, desktop menu collapse, mobile section navigation, and no horizontal page overflow. The fixture was removed after verification. No console warnings or errors were captured during that check.
- Confirmed the exact OScholar and MOFA-LAB GitHub destinations, and reviewed the lab link at desktop and mobile widths.
- Reviewed all 12 compact member rows at 1280px, 768px, and 375px; the section dock retains its five H2 links. Checked member click opening, keyboard focus/Enter opening, single-open behavior, close controls, Escape, and dismissal through the dock. The original portrait popover was checked after sharing its controller. Mobile panels stay within the reading column, with internal scrolling for longer details. Direct hover automation was unavailable; pointer enter/leave handlers are shared with the existing portrait implementation.
- Xinsong Ma's research description is based on his [Google Scholar profile](https://scholar.google.com/citations?user=Cv1FsuAAAAAJ&hl=en), which lists trustworthy ML and explainability, with publications on robustness/fairness, out-of-distribution detection, and anomaly detection. His Wuhan University Ph.D. (2026) and advisor WeiWei Liu, and Jun Chen's advisor Hong Chen, were supplied by the site owner. Existing member education and background were retained in the popovers, with repeated role/affiliation wording removed.

This review covers the primary navigation and representative shared pages. It does not certify every legacy/demo route or every browser. Reduced-motion behavior is implemented in CSS and JavaScript; OS-level reduced-motion emulation was not performed.
