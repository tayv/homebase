# 001 — Animate the work-example disclosure

- **Status**: DONE
- **Commit**: d472519
- **Severity**: MEDIUM
- **Category**: Missed opportunities, interruptibility, accessibility
- **Estimated scope**: 1 file, approximately 80 lines changed

## Problem

The work-example disclosure teleports between closed and open states. The panel is
removed from layout immediately, and the icon's vertical stroke only rotates into
the horizontal stroke. The state change is understandable, but it lacks the brief
spatial cue that connects the clicked row to the media revealed beneath it.

```ts
// src/components/WorkExamples.astro:126-141 — current
trigger.addEventListener("click", () => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true"

  triggers.forEach((otherTrigger) => {
    const panelId = otherTrigger.getAttribute("aria-controls")
    const panel = panelId ? this.querySelector(`#${panelId}`) : null
    otherTrigger.setAttribute("aria-expanded", "false")
    panel?.setAttribute("hidden", "")
  })

  if (!isOpen) {
    const panelId = trigger.getAttribute("aria-controls")
    const panel = panelId ? this.querySelector(`#${panelId}`) : null
    trigger.setAttribute("aria-expanded", "true")
    panel?.removeAttribute("hidden")
  }
})
```

```css
/* src/components/WorkExamples.astro:237-263 — current */
.work-table__icon::before,
.work-table__icon::after {
  transform: translate(-50%, -50%);
  transition: transform 180ms ease;
}

.work-table__icon::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.work-table__trigger[aria-expanded="true"] .work-table__icon::after {
  transform: translate(-50%, -50%) rotate(0deg);
}

.work-table__panel[hidden] {
  display: none;
}
```

## Target

Opening a row must feel immediate and restrained:

- Reveal the panel content over `220ms` with
  `cubic-bezier(0.23, 1, 0.32, 1)`.
- Start the entering figure at `opacity: 0`, `translateY(-0.5rem)`, and
  `clip-path: inset(0 0 6% 0)`. End at `opacity: 1`, `translateY(0)`, and
  `clip-path: inset(0)`.
- Exit over `160ms` using the same strong ease-out curve, then apply `hidden`.
  Do not set `hidden` until the exit completes.
- When switching between rows, finish the current panel's `160ms` exit before
  revealing the next panel. Never leave two expanded panels in layout.
- Morph the plus into a minus over `180ms` with
  `cubic-bezier(0.77, 0, 0.175, 1)`: rotate the vertical stroke from `90deg`
  to `180deg`, fade it to `opacity: 0`, and grow the horizontal stroke from
  `scaleX(1)` to `scaleX(1.12)`.
- Keep all state transitions interruptible. Repeated clicks must retarget the CSS
  transitions from their current visual state and must never replay keyframes.
- Preserve `aria-expanded`, `aria-controls`, one-open-row behavior, keyboard
  activation, hover dimming, colors, spacing, and all content.

```css
/* target motion tokens, scoped to this component */
work-examples {
  --motion-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --motion-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

.work-table__panel > figure {
  opacity: 0;
  transform: translateY(-0.5rem);
  clip-path: inset(0 0 6% 0);
  transition:
    transform 160ms var(--motion-ease-out),
    opacity 160ms var(--motion-ease-out),
    clip-path 160ms var(--motion-ease-out);
}

.work-table__panel[data-state="open"] > figure {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0);
  transition-duration: 220ms;
}

.work-table__icon::before,
.work-table__icon::after {
  transition:
    transform 180ms var(--motion-ease-in-out),
    opacity 120ms var(--motion-ease-out);
}

.work-table__icon::after {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(90deg) scaleX(1);
}

.work-table__trigger[aria-expanded="true"] .work-table__icon::before {
  transform: translate(-50%, -50%) scaleX(1.12);
}

.work-table__trigger[aria-expanded="true"] .work-table__icon::after {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(180deg) scaleX(0.65);
}
```

Reduced motion must remove translation, clipping, and stroke rotation while
retaining a short opacity change:

```css
@media (prefers-reduced-motion: reduce) {
  .work-table__panel > figure {
    clip-path: none;
    transform: none;
    transition: opacity 140ms var(--motion-ease-out);
  }

  .work-table__icon::before,
  .work-table__icon::after {
    transition: opacity 120ms var(--motion-ease-out);
  }
}
```

## Repo conventions to follow

- Keep component-specific CSS and JavaScript in
  `src/components/WorkExamples.astro`; do not create a global motion file for one
  disclosure.
- Use CSS transitions for reversible interaction motion. The current component
  already uses scoped transitions for row opacity and the icon at
  `src/components/WorkExamples.astro:185-188` and `:237-255`.
- Follow the existing reduced-motion media-query pattern in
  `src/components/InfiniteImageCarousel.astro:134-138`.
- The project uses Astro custom elements and plain DOM APIs for this interaction;
  do not introduce React, Framer Motion, or another dependency.

## Steps

1. In `src/components/WorkExamples.astro`, add `--motion-ease-out` and
   `--motion-ease-in-out` to the existing `work-examples` rule.
2. Replace the icon rules at lines 237-255 with the exact target stroke
   transforms, opacity values, durations, and easing curves above. Do not change
   icon size, color, or placement.
3. Add the panel figure's closed and `[data-state="open"]` styles exactly as
   specified. Retain the existing panel padding and `[hidden] { display: none; }`
   rules.
4. Add small `openPanel` and `closePanel` helpers inside the `WorkExamples`
   custom element. `openPanel` must remove `hidden`, set an initial
   `data-state="closed"`, wait one `requestAnimationFrame` so the closed styles are
   committed, then set `data-state="open"`. `closePanel` must set
   `data-state="closed"`, wait for the figure's `transform` transition to end,
   then set `hidden` only if the panel is still closed. Include a `200ms` fallback
   timeout so a missing `transitionend` cannot strand a panel in layout.
5. Add a monotonically increasing action ID to the custom element. Every click
   increments it. Before opening a panel after awaiting another panel's close,
   compare the captured ID with the current ID and abandon stale actions. This is
   required so rapid row switching cannot reopen an obsolete selection.
6. Preserve the current ARIA order: update `aria-expanded` immediately when the
   user's intent changes, then animate the panel. When the user opens a new row,
   set every other trigger to `aria-expanded="false"`, await the currently open
   panel's close, and only then call `openPanel` for the selected row.
7. Detect `window.matchMedia("(prefers-reduced-motion: reduce)").matches` inside
   the close helper. In reduced-motion mode, apply `hidden` immediately after the
   `140ms` opacity transition or use the same transition-end path with a `170ms`
   fallback. Do not run transform-based entrance logic in JavaScript; CSS owns
   that branch.
8. Add the exact `prefers-reduced-motion` CSS block from Target at the end of the
   component style.

## Boundaries

- Do NOT touch files outside `src/components/WorkExamples.astro`.
- Do NOT alter work-example content, links, table columns, typography, spacing,
  colors, hover dimming, or placeholder design.
- Do NOT animate `height`, `max-height`, margin, padding, top, left, or width.
- Do NOT use CSS keyframes; this frequently reversed interaction must remain
  interruptible.
- Do NOT add dependencies.
- If the cited component structure has drifted since commit `d472519`, STOP and
  report the mismatch instead of improvising.

## Verification

- **Mechanical**: run `ASTRO_TELEMETRY_DISABLED=1 pnpm run check`,
  `ASTRO_TELEMETRY_DISABLED=1 pnpm run build`, and `git diff --check`. All must
  finish with zero errors and zero warnings.
- **Feel check**: run `ASTRO_TELEMETRY_DISABLED=1 pnpm run dev --host 127.0.0.1
--port 4321`, then confirm:
  - Clicking a closed row immediately morphs its plus into a minus and reveals
    its figure downward from the row without bounce or overshoot.
  - Closing a row reverses the morph and removes the panel after the short exit;
    there is no flash of unstyled content.
  - Switching rows never shows two media panels at once.
  - Clicking several rows rapidly never reopens an earlier row, leaves a stale
    minus icon, or strands hidden content in the layout.
  - Keyboard activation with Enter and Space behaves identically to clicking.
  - In the browser Animations panel at 10% playback speed, the vertical icon
    stroke rotates toward the horizontal stroke as it fades; it must not blink or
    restart from its initial state when interrupted.
  - With `prefers-reduced-motion: reduce`, the panel only fades, the icon does not
    visibly rotate, and all disclosure feedback remains understandable.
- **Done when**: exactly one row can be open; every open, close, switch, and rapid
  interruption ends with the panel visibility, `data-state`, `hidden`, and
  `aria-expanded` values agreeing, while the requested morph and media reveal are
  visible under normal motion preferences.
