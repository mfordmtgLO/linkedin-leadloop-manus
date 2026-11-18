# LeadLoop implementation plan

## Product
LeadLoop is a research-first LinkedIn lead discovery engine for founders. It supports buyer definition, concern evidence, funnel buckets, and neutral idea tracking. It does not log in to LinkedIn, scrape, post, message, automate outreach, invent leads, or draft content.

## Design
- **Movement:** dark editorial SaaS with quiet intelligence and high-signal density.
- **Core principles:** evidence before action; one buyer at a time; human-owned writing; visible uncertainty.
- **Color philosophy:** ink navy creates focus, indigo marks active work, mint signals evidence and progress, coral is reserved for gaps and caveats.
- **Layout paradigm:** a persistent left rail with a wide, asymmetric workspace: one decisive metric row, then a primary work surface and a narrow signal rail.
- **Signature elements:** a mint evidence pulse, dashed "To confirm" labels, and a small signal chart built from vertical bars.
- **Interaction philosophy:** changes are lightweight and reversible; drawers and inline filters keep the founder in context.
- **Animation:** subtle 180ms lift/fade for cards, gentle pulse on active evidence, no looping motion that competes with reading.
- **Typography:** Space Grotesk for display/UI, Inter for readable body copy.
- **Brand essence:** a calm evidence desk for founders who want better conversations, not louder content. Personality: precise, candid, useful.
- **Brand voice:** direct, specific, non-promotional. Example lines: “Start with one buyer.” “A person writes the post.”
- **Wordmark:** a linked-loop mark made from two offset rounded brackets beside the LeadLoop wordmark.
- **Signature brand color:** sea-glass mint `#9FE3C4` against ink `#0E1118`.

## Implementation
- React + TypeScript page in `client/src/pages/Home.tsx`.
- Local state demo data for buyer, concerns, buckets, and ideas; no fabricated public sources.
- Responsive CSS in `client/src/index.css` using Tailwind utilities plus custom classes.
- `public/manus-routes.json` declares `/` and `/404`.
- No backend changes required for the explorable demo.
