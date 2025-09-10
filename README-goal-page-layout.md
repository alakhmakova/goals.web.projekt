# Goal page layout: responsive CSS refactor (branch: `goal-page-layout`)

This change keeps the existing visual style and color scheme intact while making the `goal.html` page responsive and robust across screen sizes (mobile to large desktop). Only CSS was modified; HTML stayed untouched.

## What changed
- Rewrote `src/main/resources/static/styles/style-goals.css` to a mobile-first, responsive layout using CSS Grid and Flexbox.
- Preserved all colors and general look (spacing and typography adjusted only for responsiveness and readability).
- Removed fixed widths that caused overlap; replaced with fluid widths, clamps, and minmax.
- Standardized paddings/margins with `clamp()` for predictable scaling.
- Ensured target cards wrap correctly and progress bars do not overflow.
- Improved tooltip positioning for small screens.
- Made the sidepanel adapt (50–100% width depending on viewport).

## No HTML changes
Per request, `goal.html` was not changed. All class names and structure remain the same.

## Key responsive techniques
- Page container uses a centered column: `grid-template-columns: minmax(16px, 1fr) minmax(0, 1200px) minmax(16px, 1fr)`
- `goal-info` becomes single-column on <= 768px, with progress circle, title, date/desc stacking.
- Target items adopt `flex-wrap` with `flex: 1 1 280px` to prevent overlap and ensure neat wrapping.
- Text areas and long names are constrained using `min-width: 0` and fluid widths.
- Buttons and form inputs scale via `clamp()`.

## Breakpoints
- 1024px: tighten container and sidepanel 70% width.
- 768px: switch `goal-info` to single column; sidepanel becomes 100% width.
- 1440px+: widen max content to 1280px.

## Examples of specific fixes
- `goal-header` padding reworked with `clamp()` to avoid excessive empty space.
- `goal-desc` set to `width: 100%` and constrained by container instead of hard min/max widths.
- `.goal-targets` now wraps; `.progress` width set to `min(100%, 12rem)` and parent given flexible basis to avoid overflow.
- Tooltip re-centered relative to trigger for better behavior on small viewports.

## Files touched
- `goals/src/main/resources/static/styles/style-goals.css` (replaced)
- `README-goal-page-layout.md` (this file)

## How to test
1. Open `goal.html` page in the app.
2. Resize the viewport from 360px up to 1920px.
3. Verify:
   - Header remains sticky and readable.
   - Progress circle, title, and description stack on mobile and align horizontally on desktop.
   - Targets list wraps gracefully; no overlaps; progress bars do not exceed the card width.
   - Sidepanel opens at 50–70–100% depending on breakpoint.
   - Color palette unchanged.

## Notes
- `responsive.css` and `styles.css` were left intact as they target other parts of the app; new rules are confined to `style-goals.css` used by `goal.html`.
