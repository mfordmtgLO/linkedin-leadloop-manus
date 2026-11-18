# LeadLoop Architecture & Deployment — Presentation Script

## Slide 1 — LeadLoop architecture & deployment

LeadLoop is a research-first workspace for founders who want a more specific next conversation. This deck covers the architecture behind the demo, the human approval boundary, and the deployment path. The system prepares evidence and questions; a person still owns the writing, publishing, and outreach decisions.

## Slide 2 — The product boundary

The product boundary is intentional. LeadLoop helps define one working buyer, collect concerns, organize funnel subjects, and prepare neutral ideas with open questions. It does not log in to LinkedIn, scrape LinkedIn, invent leads or quotes, send messages, automate outreach, or draft post copy. These are product rules, not just documentation. The interface keeps uncertainty visible with labels such as To confirm and Inference.

## Slide 3 — System map

The current stack is straightforward. The React and Vite client owns the dashboard surfaces and local interactions. The Express server exposes platform routes, OAuth wiring, the tRPC API, and the health endpoint. Drizzle is the ORM layer over MySQL, and the project provisions server and database capabilities through Webdev. The current demo uses local session state for buyer and evidence records, so the architecture is ready for persistence but the product tables still need to be added.

## Slide 4 — Four surfaces, one workspace

The frontend is organized around four questions. Overview asks whether the evidence base is moving. Buyer profile asks who the single working buyer is. Evidence room asks what is actually supported and what remains a gap. Content hub asks which neutral ideas are ready for human answers. Drawers and filters update the current session without pulling the founder out of context.

## Slide 5 — Human-in-the-loop refresh

The Monday refresh is a gated workflow. LeadLoop first presents a proposal with its scope and exclusions. A person chooses Approve proposal or Not now. Approval authorizes preparation for human review, not LinkedIn access, contact, or publication. Evidence must stay separated into sourced fact, founder-reported experience, and inference. Then a person writes the post, and Written and Posted remain manual statuses. Outreach is never automated.

## Slide 6 — Evidence and data contract

The data contract is conservative by design. Buyer fields need evidence or remain marked To confirm. Concerns need a source status and a retrievable location. Founder words must be exact excerpts from founder-owned material. Ideas carry a neutral label, the related concern, and three to five open questions. A blank quote or missing source is not silently filled in; it is surfaced as a gap.

## Slide 7 — Deployment path

The container path starts with the pinned pnpm version and frozen lockfile. The build creates the Vite client and bundles the Express server. The Docker image uses Node 22, runs in production mode, listens on port 3000, and starts dist/index.js. Webdev checks GET /api/health before routing traffic. GitHub main is the canonical repository for the current project.

## Slide 8 — What is ready now

The current milestone is a working, checkpointed LeadLoop interface with the buyer and evidence report synced to GitHub, the approval loop demonstrated, and the container configuration in place. The next implementation step is persistence: add buyer, concern, bucket, and idea tables, then connect them through tRPC. Before treating any result as customer truth, confirm the buyer profile and attach real source locations. A person writes the post.
