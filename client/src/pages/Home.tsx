import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FileText,
  Filter,
  Flag,
  LayoutDashboard,
  Linkedin,
  Menu,
  MessageSquareText,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

type Stage = "Attract" | "Nurture" | "Convert";
type Status = "Questions ready" | "Answered" | "Written" | "Posted";

type Idea = {
  id: number;
  idea: string;
  stage: Stage;
  bucket: string;
  concern: string;
  questions: string[];
  status: Status;
  source: string;
};

const initialIdeas: Idea[] = [
  { id: 1, idea: "The cost of waiting on buyer research", stage: "Attract", bucket: "Problem recognition", concern: "Teams struggle to turn buyer signals into a usable point of view.", questions: ["What decision is currently slowed down?", "What did you observe first-hand?", "What would be a counterexample?"], status: "Questions ready", source: "Founder evidence needed" },
  { id: 2, idea: "Signals that a target buyer is still too broad", stage: "Attract", bucket: "Problem recognition", concern: "The working buyer profile is not yet supported by enough direct evidence.", questions: ["Which title has the clearest decision?", "What evidence would narrow the profile?", "What assumption needs testing?"], status: "Answered", source: "Buyer profile · To confirm" },
  { id: 3, idea: "What a useful buyer interview note contains", stage: "Nurture", bucket: "Evidence quality", concern: "Founder notes can mix reported experience with interpretation.", questions: ["What exact words were recorded?", "Where is the note retrievable?", "What remains unverified?"], status: "Questions ready", source: "Founder evidence needed" },
  { id: 4, idea: "Trade-offs between speed and evidence quality", stage: "Nurture", bucket: "Approach trade-offs", concern: "Useful research needs enough detail without pretending to be complete.", questions: ["What did you choose to leave out?", "What did the trade-off cost?", "What would change your mind?"], status: "Questions ready", source: "Concern 04 · To confirm" },
  { id: 5, idea: "The next step a qualified buyer can actually evaluate", stage: "Convert", bucket: "Decision readiness", concern: "A next step should match what the buyer is ready to decide.", questions: ["What decision is the buyer making?", "What constraint matters most?", "What would make the next step not useful?"], status: "Written", source: "Founder evidence needed" },
  { id: 6, idea: "What a founder needs to verify before claiming fit", stage: "Convert", bucket: "Fit check", concern: "Buyer fit and intent should be treated as open questions until evidenced.", questions: ["Which fact is missing?", "Who can confirm it?", "What would disconfirm the fit?"], status: "Posted", source: "Buyer profile · To confirm" },
];

const initialConcerns = [
  { id: 1, title: "Buyer profile is still too wide", detail: "The current working profile spans several adjacent roles.", source: "Founder note · To confirm", age: "2 days ago", tone: "mint" },
  { id: 2, title: "Evidence quality is uneven", detail: "Reported experience and interpretation need clearer separation.", source: "Research gap · Inference", age: "5 days ago", tone: "amber" },
  { id: 3, title: "Decision readiness is unclear", detail: "The next step should match what the buyer can evaluate now.", source: "No supporting quote", age: "1 week ago", tone: "coral" },
];

const buckets: { stage: Stage; label: string; description: string; color: string }[] = [
  { stage: "Attract", label: "Problem recognition", description: "Help the right buyer name a relevant problem or decision.", color: "mint" },
  { stage: "Nurture", label: "Evidence quality", description: "Deepen understanding and surface approach trade-offs.", color: "indigo" },
  { stage: "Convert", label: "Decision readiness", description: "Help a buyer evaluate a relevant next step.", color: "coral" },
];

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Buyer profile", icon: Target },
  { label: "Evidence room", icon: BookOpen },
  { label: "Content hub", icon: ClipboardList },
];

function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "mint" | "amber" | "coral" | "indigo" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>;
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [ideas, setIdeas] = useState(initialIdeas);
  const [concerns, setConcerns] = useState(initialConcerns);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [drawer, setDrawer] = useState<"buyer" | "concern" | "idea" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshState, setRefreshState] = useState<"idle" | "approved" | "declined">("idle");
  const [buyer, setBuyer] = useState({ title: "VP Marketing", company: "20–100 employees", industry: "B2B software", location: "North America", budget: "To confirm", cares: "Clear buyer evidence, practical next steps" });
  const [form, setForm] = useState({ title: "", detail: "", question: "" });

  const filteredIdeas = useMemo(() => ideas.filter((item) => {
    const matchesQuery = `${item.idea} ${item.concern} ${item.bucket}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (stageFilter === "All" || item.stage === stageFilter) && (statusFilter === "All" || item.status === statusFilter);
  }), [ideas, query, stageFilter, statusFilter]);

  const counts = { ready: ideas.filter(i => i.status === "Questions ready").length, written: ideas.filter(i => i.status === "Written").length, posted: ideas.filter(i => i.status === "Posted").length };

  const submitDrawer = () => {
    if (drawer === "concern" && form.title.trim()) {
      setConcerns([{ id: Date.now(), title: form.title, detail: form.detail || "Details to confirm.", source: "Added in session · To confirm", age: "Just now", tone: "amber" }, ...concerns]);
    }
    if (drawer === "idea" && form.title.trim()) {
      setIdeas([{ id: Date.now(), idea: form.title, stage: "Attract", bucket: "New research question", concern: form.detail || "Concern to confirm.", questions: [form.question || "What evidence supports this?", "What did you observe first-hand?", "What remains unverified?"], status: "Questions ready", source: "Founder evidence needed" }, ...ideas]);
    }
    setForm({ title: "", detail: "", question: "" });
    setDrawer(null);
  };

  const setSection = (label: string) => { setActive(label); setMobileOpen(false); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><span /><span /></div><div><div className="brand-name">LeadLoop</div><div className="brand-sub">evidence desk</div></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
      <div className="workspace-switcher"><div className="avatar">MF</div><div><strong>Mike Ford</strong><span>Founder workspace</span></div><ChevronDown size={15} /></div>
      <div className="nav-label">Workspace</div>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => setSection(label)}><Icon size={17} /><span>{label}</span>{label === "Content hub" && <b>{ideas.length}</b>}</button>)}</nav>
      <div className="nav-label secondary-label">System</div>
      <nav><button className="nav-item"><Activity size={17} /><span>Refresh queue</span><i className="nav-dot" /></button><button className="nav-item"><Settings2 size={17} /><span>Workspace settings</span></button></nav>
      <div className="sidebar-bottom"><div className="guardrail-mini"><ShieldCheck size={16} /><div><strong>Human-owned</strong><span>A person writes the post.</span></div></div><div className="sidebar-footer"><span>LeadLoop v0.1</span><span className="status-dot">● Live demo</span></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="crumb"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><div className="sync-status"><span className="pulse" /> Local demo data <span className="muted">·</span> Saved</div><button className="icon-btn"><CircleHelp size={18} /></button><div className="top-avatar">MF</div></div></header>

      <div className="content-wrap">
        {active === "Overview" && <>
          <section className="hero-row"><div><div className="eyebrow"><Sparkles size={13} /> MONDAY, NOV 18 · RESEARCH CONTROL ROOM</div><h1>Make the next conversation<br /><em>more specific.</em></h1><p className="hero-copy">LeadLoop keeps buyer evidence, open questions, and human judgment in one calm place.</p></div><div className="hero-actions"><button className="button secondary" onClick={() => setDrawer("concern")}><Plus size={16} /> Add evidence</button><button className="button primary" onClick={() => setDrawer("idea")}><Sparkles size={16} /> New idea</button></div></section>
          <section className="metrics-grid"><div className="metric-card"><div className="metric-icon mint"><Target size={18} /></div><div className="metric-label">Working buyer</div><div className="metric-value">1 <span>profile</span></div><div className="metric-foot"><Tag tone="amber">To confirm</Tag><span>Single-buyer focus</span></div></div><div className="metric-card"><div className="metric-icon indigo"><BookOpen size={18} /></div><div className="metric-label">Evidence signals</div><div className="metric-value">{concerns.length} <span>open</span></div><div className="metric-foot"><span className="trend-up">↑ 2 this week</span><span>vs last refresh</span></div></div><div className="metric-card"><div className="metric-icon coral"><ClipboardList size={18} /></div><div className="metric-label">Idea queue</div><div className="metric-value">{ideas.length} <span>ideas</span></div><div className="metric-foot"><Tag tone="mint">{counts.ready} need answers</Tag></div></div><div className="metric-card signal-card"><div className="signal-top"><div><div className="metric-label">Signal quality</div><div className="metric-value">62<span>%</span></div></div><BarChart3 size={21} /></div><div className="signal-bars">{[32, 44, 36, 58, 49, 72, 67, 83, 74, 91, 82, 96].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><div className="metric-foot"><span>Last 12 weeks</span><span className="trend-up">↑ improving</span></div></div></section>
          <section className="workspace-grid"><div className="main-column"><div className="panel bucket-panel"><SectionHeading eyebrow="Funnel coverage" title="Your evidence, by decision stage" detail="Subjects to return to — not posts to publish." action={<button className="text-button" onClick={() => setSection("Content hub")}>View content hub <ArrowUpRight size={14} /></button>} /><div className="bucket-list">{buckets.map((bucket) => { const count = ideas.filter(i => i.stage === bucket.stage).length; return <div className="bucket-row" key={bucket.stage}><div className={`bucket-symbol ${bucket.color}`}>{bucket.stage === "Attract" ? <Flag size={17} /> : bucket.stage === "Nurture" ? <MessageSquareText size={17} /> : <ArrowUpRight size={17} />}</div><div className="bucket-copy"><div className="bucket-title"><strong>{bucket.stage}</strong><span>/</span><span>{bucket.label}</span></div><p>{bucket.description}</p></div><div className="bucket-count"><strong>{count}</strong><span>ideas</span></div><div className="bucket-progress"><span style={{ width: `${Math.min(100, count * 28)}%` }} /></div></div>})}</div></div><div className="panel activity-panel"><SectionHeading eyebrow="Activity" title="What needs your attention" action={<button className="icon-btn small"><ArrowUpRight size={16} /></button>} /><div className="activity-list"><div className="activity-item"><div className="activity-icon mint"><Check size={15} /></div><div><strong>Buyer profile updated</strong><span>“VP Marketing” is your current working buyer</span></div><time>2h</time></div><div className="activity-item"><div className="activity-icon amber"><BookOpen size={15} /></div><div><strong>Evidence gap surfaced</strong><span>Decision readiness has no supporting quote</span></div><time>5h</time></div><div className="activity-item"><div className="activity-icon indigo"><Sparkles size={15} /></div><div><strong>3 questions are ready</strong><span>Answer them before moving ideas forward</span></div><time>1d</time></div></div><button className="activity-footer" onClick={() => setSection("Evidence room")}>Open evidence room <ArrowUpRight size={14} /></button></div></div><aside className="side-column"><div className="panel buyer-card"><div className="card-kicker"><span className="live-mark" /> Working buyer <Tag tone="amber">To confirm</Tag></div><div className="buyer-title"><div className="buyer-avatar"><Users size={21} /></div><div><h3>{buyer.title}</h3><p>{buyer.industry} · {buyer.company}</p></div></div><div className="buyer-facts"><div><span>Location</span><strong>{buyer.location}</strong></div><div><span>Budget</span><strong>{buyer.budget}</strong></div><div className="wide"><span>Cares about</span><strong>{buyer.cares}</strong></div></div><button className="full-button" onClick={() => setDrawer("buyer")}>Review buyer profile <ArrowUpRight size={14} /></button></div><div className="panel refresh-card"><div className="refresh-icon"><Activity size={18} /></div><div className="eyebrow">PROPOSED REFRESH</div><h3>Monday evidence sweep</h3><p>Review public, non-LinkedIn sources and add only supported concerns and questions.</p>{refreshState === "idle" ? <div className="refresh-actions"><button className="button primary small-button" onClick={() => setRefreshState("approved")}>Approve proposal</button><button className="button ghost small-button" onClick={() => setRefreshState("declined")}>Not now</button></div> : <div className="refresh-result"><Check size={14} /> {refreshState === "approved" ? "Approved for human review" : "Kept in queue for later"}</div>}<div className="refresh-note"><ShieldCheck size={13} /> No LinkedIn login, scraping, posting, or outreach</div></div></aside></section>
        </>}

        {active === "Buyer profile" && <section className="page-section"><SectionHeading eyebrow="Single-buyer focus" title="Buyer profile" detail="Choose one person the founder should write to. Unsupported details stay visible as gaps." action={<button className="button primary" onClick={() => setDrawer("buyer")}><Settings2 size={15} /> Edit profile</button>} /><div className="profile-layout"><div className="panel profile-card"><div className="profile-hero"><div className="buyer-avatar large"><Users size={26} /></div><div><Tag tone="amber">Working profile · To confirm</Tag><h3>{buyer.title}</h3><p>{buyer.industry} · {buyer.company}</p></div></div><div className="profile-grid">{Object.entries(buyer).map(([key, value]) => <div className="profile-field" key={key}><span>{key === "cares" ? "What they care about" : key.charAt(0).toUpperCase() + key.slice(1)}</span><strong>{value}</strong>{["budget", "location"].includes(key) && <Tag tone={value === "To confirm" ? "amber" : "neutral"}>{value === "To confirm" ? "To confirm" : "Supported"}</Tag>}</div>)}</div><div className="assumption-box"><CircleHelp size={16} /><div><strong>Working assumption</strong><p>VP Marketing is the best-supported starting point for a pipeline goal. Confirm with founder evidence before treating this as the actual customer mix.</p></div></div></div><div className="panel profile-note"><div className="metric-icon mint"><Target size={18} /></div><h3>Why one buyer?</h3><p>Specific evidence beats a list of plausible personas. LeadLoop keeps the profile narrow until the evidence earns a change.</p><div className="rule-list"><div><Check size={14} /> One decision-maker</div><div><Check size={14} /> Clear evidence gaps</div><div><Check size={14} /> No invented lead identities</div></div></div></div></section>}

        {active === "Evidence room" && <section className="page-section"><SectionHeading eyebrow="Source discipline" title="Evidence room" detail="Separate sourced facts, founder-reported experience, and interpretation." action={<button className="button primary" onClick={() => setDrawer("concern")}><Plus size={15} /> Add concern</button>} /><div className="evidence-banner"><ShieldCheck size={18} /><div><strong>No LinkedIn access by design.</strong><span>Use company sites, public research, or founder-provided material. Every gap stays labeled until supported.</span></div><Tag tone="mint">Guardrail active</Tag></div><div className="evidence-list">{concerns.map((concern) => <div className="panel evidence-card" key={concern.id}><div className={`evidence-icon ${concern.tone}`}><BookOpen size={18} /></div><div className="evidence-content"><div className="evidence-head"><h3>{concern.title}</h3><span>{concern.age}</span></div><p>{concern.detail}</p><div className="evidence-meta"><Tag tone={concern.tone === "coral" ? "coral" : concern.tone === "amber" ? "amber" : "mint"}>{concern.source}</Tag><span className="source-placeholder"><FileText size={13} /> Source location to confirm</span></div></div><button className="icon-btn"><ArrowUpRight size={16} /></button></div>)}</div></section>}

        {active === "Content hub" && <section className="page-section"><SectionHeading eyebrow="Human-owned queue" title="Content hub" detail="Neutral ideas and questions. A person writes the post." action={<button className="button primary" onClick={() => setDrawer("idea")}><Plus size={15} /> Add idea</button>} /><div className="hub-toolbar"><div className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search ideas, concerns, buckets..." /></div><div className="filter-group"><Filter size={15} /><select value={stageFilter} onChange={e => setStageFilter(e.target.value as Stage | "All")}><option>All</option><option>Attract</option><option>Nurture</option><option>Convert</option></select><select value={statusFilter} onChange={e => setStatusFilter(e.target.value as Status | "All")}><option>All</option><option>Questions ready</option><option>Answered</option><option>Written</option><option>Posted</option></select></div></div><div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Idea</th><th>Stage</th><th>Buyer concern</th><th>Questions</th><th>Status</th></tr></thead><tbody>{filteredIdeas.map(item => <tr key={item.id}><td><strong>{item.idea}</strong><span className="table-sub">{item.bucket} · {item.source}</span></td><td><Tag tone={item.stage === "Attract" ? "mint" : item.stage === "Nurture" ? "indigo" : "coral"}>{item.stage}</Tag></td><td><span className="concern-cell">{item.concern}</span></td><td><span className="question-count"><MessageSquareText size={14} /> {item.questions.length} open questions</span></td><td><select className={`status-select status-${item.status.replaceAll(" ", "-").toLowerCase()}`} value={item.status} onChange={e => setIdeas(ideas.map(i => i.id === item.id ? { ...i, status: e.target.value as Status } : i))}><option>Questions ready</option><option>Answered</option><option>Written</option><option>Posted</option></select></td></tr>)}</tbody></table></div>{filteredIdeas.length === 0 && <div className="empty-state"><Search size={20} /> No ideas match those filters.</div>}<div className="table-footer"><span>Showing {filteredIdeas.length} of {ideas.length} ideas</span><span><ShieldCheck size={13} /> Written and Posted are always manual</span></div></div></section>}
      </div>
    </main>

    {drawer && <div className="overlay" onClick={() => setDrawer(null)}><div className="drawer" onClick={e => e.stopPropagation()}><div className="drawer-head"><div><div className="eyebrow">{drawer === "buyer" ? "PROFILE SETTINGS" : drawer === "concern" ? "EVIDENCE ROOM" : "CONTENT HUB"}</div><h2>{drawer === "buyer" ? "Review buyer profile" : drawer === "concern" ? "Add buyer concern" : "Add neutral idea"}</h2></div><button className="icon-btn" onClick={() => setDrawer(null)}><X size={18} /></button></div>{drawer === "buyer" ? <div className="drawer-form">{Object.entries(buyer).map(([key, value]) => <label key={key}>{key === "cares" ? "What they care about" : key.charAt(0).toUpperCase() + key.slice(1)}<input value={value} onChange={e => setBuyer({ ...buyer, [key]: e.target.value })} /></label>)}<div className="drawer-note"><CircleHelp size={15} /> Keep unsupported details labeled “To confirm”.</div><button className="button primary full" onClick={() => setDrawer(null)}><Check size={15} /> Save profile</button></div> : <div className="drawer-form"><label>{drawer === "concern" ? "Concern title" : "Neutral idea label"}<input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={drawer === "concern" ? "e.g. Decision readiness is unclear" : "e.g. What makes a buyer interview useful?"} /></label><label>{drawer === "concern" ? "Plain-language detail" : "Buyer concern"}<textarea value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} placeholder="Keep this factual and open to confirmation." /></label>{drawer === "idea" && <label>First question to answer<textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="What did you observe first-hand?" /></label>}<div className="drawer-note"><ShieldCheck size={15} /> No post copy, hooks, outlines, or outreach is generated.</div><button className="button primary full" onClick={submitDrawer}><Plus size={15} /> Add to workspace</button></div>}</div></div>}
  </div>;
}
