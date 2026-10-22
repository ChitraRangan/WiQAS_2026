# WiQAS 2026 website

An Apple-inspired redesign of the supplied WiQAS website. This is a static,
eight-page site with local images, CSS, JavaScript, and SVG artwork.

## Open or update the website

1. Extract the entire ZIP archive.
2. Open `index.html` in a browser.
3. To update the existing website, upload the extracted files together to its
   website folder. Preserve the filenames and their capitalization.

No installation or build step is required. Registration links open the original
Microsoft Forms registration page supplied with the website.

## Pages

- `index.html`: symposium overview, event details, venues, speaker preview.
- `about.html`: symposium purpose and areas of interest.
- `program.html`: 2026 agenda with full-day, morning, and afternoon filters.
- `speakers.html`: keynote and other speaker portraits and session times.
- `attend.html`: registration deadline, venues, campus map, and parking map.
- `organizers.html`: committee, volunteers, and three empty volunteer cards.
- `past.html`: the supplied 2025 program and event information.
- `past-2024.html`: Quantum Day 2024, transcribed from the supplied agenda.
- `agenda-2024.png`: the original 2024 agenda image.

Hover over **Past editions** in the header to choose 2024 or 2025. On touch screens, tap **Past editions** to expand the links. The links also work with the keyboard and with JavaScript disabled.

## Shared design and behavior

- `styles.css` contains the common layout, typography, colors, and responsive
  breakpoints.
- `script.js` controls the mobile navigation, program filters, print button,
  current year, edition dropdown hover behavior, and short content reveals.
- Mobile navigation and the program selection indicator use interruptible,
  critically damped springs. No animation library is required.
- Small-screen program rows become session cards. The speaker preview uses
  native horizontal scrolling and scroll snapping on small screens.
- Reduced motion, reduced transparency, higher contrast, keyboard focus, and
  Escape dismissal are supported.
- The print stylesheet includes the full agenda even if a time filter is active.

## Content retained

The 14 schedule rows in the 2026 agenda and the 23 rows in the 2025 agenda match
the supplied current files. The unconfirmed 11:30-12:00 slot remains unconfirmed.
The 2024 agenda keeps both 3:05 entries (health break and poster session) as
shown in the original image. The supplied speaker names, affiliations, times, registration link, registration
deadline, venues, and committee information are retained. Richa Rayamajhi uses
an initials avatar, and the three additional volunteer cards remain empty.

## Verification

Internal page links and anchors, image references, image readability, SVG syntax,
JavaScript syntax, agenda preservation, active navigation, and key behavior
contracts were checked. Behavior checks cover menu open/close, Escape focus
return, outside dismissal, spring reversal, desktop navigation access, agenda
filters, print invocation, and reduced-motion menu behavior.

Desktop browser checks confirmed pointer opening of the edition dropdown,
navigation to the 2024 and 2025 pages, keyboard activation, Escape focus return,
and dismissal when tabbing outside. The mobile navigation behavior checks passed;
the mobile layout has not been visually checked.
