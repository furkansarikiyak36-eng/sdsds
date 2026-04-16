import { useState, useRef, useEffect } from "react";

const DEPARTMENTS = ["All", "Creative", "Reports", "UI/UX", "Insights", "Diagrams"];

const BRANDS = [
  "Global",
  "Dove",
  "Hellmann's",
  "Ben & Jerry's",
  "Knorr",
  "TRESemmé",
  "Vaseline",
  "Lifebuoy",
  "Nutrafol",
  "Liquid I.V.",
  "REN",
  "Kate Somerville",
];

const DEPT_COLORS = {
  Creative:  { bg: "#AFA9EC22", border: "#7F77DD", text: "#3C3489" },
  Reports:   { bg: "#5DCAA522", border: "#1D9E75", text: "#085041" },
  "UI/UX":   { bg: "#F0997B22", border: "#D85A30", text: "#712B13" },
  Insights:  { bg: "#FAC77522", border: "#BA7517", text: "#633806" },
  Diagrams:  { bg: "#85B7EB22", border: "#378ADD", text: "#0C447C" },
};

const STATUS_COLORS = {
  Final:      { bg: "#C0DD9722", text: "#3B6D11" },
  Draft:      { bg: "#FAC77522", text: "#633806" },
  "In Review":{ bg: "#85B7EB22", text: "#0C447C" },
  Archived:   { bg: "#B4B2A922", text: "#444441" },
};

const FILE_ICONS = {
  pdf:   "📄",
  fig:   "🎨",
  pptx:  "📊",
  xlsx:  "📈",
  docx:  "📝",
  png:   "🖼",
  mp4:   "🎬",
  svg:   "✏️",
};

const FILES = [
  // ── GLOBAL ──
  { id: 1,  brand: "Global", dept: "Reports",  title: "FY2024 Unilever Annual Report",            ext: "pdf",  status: "Final",     date: "2024-02-14", desc: "Official Unilever FY2024 filing. Source for underlying operating margin 16.1% (not 16.8%), turnover €60.1B.", tags: ["#financials","#source-of-truth"] },
  { id: 2,  brand: "Global", dept: "Reports",  title: "Competitive Benchmark Matrix Q4 2024",     ext: "xlsx", status: "Final",     date: "2024-12-10", desc: "P&G, Nestlé, Henkel cross-category share and margin comparison.", tags: ["#benchmark","#competitive"] },
  { id: 3,  brand: "Global", dept: "Diagrams", title: "Gap Analysis → Solution Journey",          ext: "svg",  status: "Final",     date: "2025-01-08", desc: "End-to-end methodology: data collection → anomaly detection → severity scoring → corrective brief.", tags: ["#methodology","#gap-analysis"] },
  { id: 4,  brand: "Global", dept: "Diagrams", title: "Error Taxonomy & Severity Framework",      ext: "svg",  status: "Final",     date: "2025-01-05", desc: "Classifies dashboard errors into P0/P1/P2 tiers with decision rules for correction vs. removal.", tags: ["#framework","#methodology"] },
  { id: 5,  brand: "Global", dept: "Insights", title: "Portfolio ESG Scorecard 2024",             ext: "pdf",  status: "Final",     date: "2024-11-20", desc: "Compass KPI progress: plastic reduction, deforestation, living wages across 400 brands.", tags: ["#ESG","#compass"] },
  { id: 6,  brand: "Global", dept: "UI/UX",    title: "Dashboard Design System v2",               ext: "fig",  status: "Final",     date: "2025-01-15", desc: "Figma component library: color tokens, severity badges, chart patterns, brand card specs.", tags: ["#design-system","#figma"] },
  { id: 7,  brand: "Global", dept: "Creative", title: "Brand Portfolio Map Visual",               ext: "svg",  status: "Draft",     date: "2025-02-01", desc: "2×2 matrix plotting all 30 Power Brands by growth rate vs. margin contribution.", tags: ["#portfolio","#visualization"] },
  { id: 8,  brand: "Global", dept: "Reports",  title: "Divested & Discontinued Brands Register",  ext: "xlsx", status: "Final",     date: "2024-10-05", desc: "Lipton (→CVC 2022), Dollar Shave Club, Elida Beauty. Reference for portfolio cleanup.", tags: ["#divestitures","#source-of-truth"] },

  // ── DOVE ──
  { id: 9,  brand: "Dove",   dept: "Creative", title: "Real Beauty Campaign Brief 2025",          ext: "pdf",  status: "Final",     date: "2025-01-20", desc: "Campaign strategy, tone of voice, asset specs for Q1-Q2 global rollout.", tags: ["#campaign","#creative-brief"] },
  { id: 10, brand: "Dove",   dept: "Insights", title: "Consumer Sentiment Deep Dive",             ext: "pptx", status: "Final",     date: "2024-11-12", desc: "NPS trends, social listening (700K+ mentions), Şikayetvar/Ekşi aggregation TR market.", tags: ["#consumer","#NLP"] },
  { id: 11, brand: "Dove",   dept: "UI/UX",    title: "Dove.com Redesign Prototype",              ext: "fig",  status: "In Review", date: "2025-02-10", desc: "Mobile-first redesign. Accessibility audit passed AA. Handoff ready pending stakeholder sign-off.", tags: ["#redesign","#mobile"] },
  { id: 12, brand: "Dove",   dept: "Diagrams", title: "Dove Revenue Attribution Flow",            ext: "svg",  status: "Final",     date: "2024-12-20", desc: "How segment-level revenue rolls up to reported Beauty & Wellbeing figure. Corrects 16.8% → 16.1% margin.", tags: ["#financials","#correction"] },

  // ── BEN & JERRY'S ──
  { id: 13, brand: "Ben & Jerry's", dept: "Insights",  title: "Activism Risk & Brand Trust Study",   ext: "pdf",  status: "Final",     date: "2024-09-15", desc: "Quantifies impact of political activism on purchase intent across 6 markets.", tags: ["#risk","#brand-trust"] },
  { id: 14, brand: "Ben & Jerry's", dept: "Creative",  title: "Limited Edition Flavor Roadmap 2025", ext: "pptx", status: "Draft",     date: "2025-01-30", desc: "Pipeline of 8 flavors tied to social campaigns. Links to influencer brief.", tags: ["#NPD","#campaign"] },
  { id: 15, brand: "Ben & Jerry's", dept: "Diagrams",  title: "Governance Tension Decision Tree",    ext: "svg",  status: "Final",     date: "2024-10-10", desc: "Maps Unilever/Vermont-board conflicts to resolution pathways and brand risk scenarios.", tags: ["#governance","#risk"] },

  // ── KNORR ──
  { id: 16, brand: "Knorr",  dept: "Reports",  title: "Future Foods Market Analysis",             ext: "pdf",  status: "Final",     date: "2024-08-20", desc: "Plant-based & functional food segment sizing. USG driver decomposition.", tags: ["#market-analysis","#NPD"] },
  { id: 17, brand: "Knorr",  dept: "Creative", title: "Knorr Rebrand Visual Identity",            ext: "fig",  status: "In Review", date: "2025-02-05", desc: "Logo evolution, packaging system, typography. Pending global market approval.", tags: ["#rebrand","#identity"] },

  // ── LIFEBUOY ──
  { id: 18, brand: "Lifebuoy", dept: "Reports", title: "Lifebuoy Stagnation Diagnostic",          ext: "pdf",  status: "Final",     date: "2024-12-01", desc: "Explains 0% USG vs. listed 6.8%. Root causes: commodity inflation, distribution gaps in SEA.", tags: ["#correction","#diagnostic"] },
  { id: 19, brand: "Lifebuoy", dept: "Diagrams", title: "Watch-List Entry Rationale",              ext: "svg",  status: "Final",     date: "2024-12-05", desc: "Decision diagram: why Lifebuoy moves from Strong → Watch. Evidence chain from quarterly data.", tags: ["#correction","#evidence"] },

  // ── NUTRAFOL / LIQUID I.V. ──
  { id: 20, brand: "Nutrafol",    dept: "Insights", title: "Prestige Hair Wellness Category Map",  ext: "pptx", status: "Final",     date: "2024-10-18", desc: "Category sizing, target consumer, claim substantiation. Note: double-digit growth confirmed, exact % undisclosed.", tags: ["#category","#disclaimer"] },
  { id: 21, brand: "Liquid I.V.", dept: "Reports",  title: "Hydration Segment Competitive Scan",  ext: "pdf",  status: "Final",     date: "2024-09-28", desc: "LMNT, Nuun, DripDrop comparison. Growth narrative verified from Unilever investor day; specific % not disclosed.", tags: ["#competitive","#disclaimer"] },

  // ── REN / KATE SOMERVILLE ──
  { id: 22, brand: "REN",            dept: "Reports",  title: "REN Closure Decision Brief",        ext: "pdf",  status: "Final",     date: "2025-01-10", desc: "Internal rationale: margin compression, crowded prestige skincare, Unilever portfolio simplification.", tags: ["#divested","#closure"] },
  { id: 23, brand: "Kate Somerville",dept: "Reports",  title: "Kate Somerville Sale Process Note", ext: "pdf",  status: "Final",     date: "2025-01-10", desc: "Asset marked for divestiture. Dashboard must reflect status: 'For Sale', not active.", tags: ["#divested","#correction"] },
];

const JOURNEY_STEPS = [
  {
    id: "J1",
    phase: "Discovery",
    color: "#7F77DD",
    bg: "#EEEDFE",
    border: "#AFA9EC",
    title: "Data Collection",
    actions: ["FY2024 Annual Report ingested", "Competitor filings pulled", "Ekşi/Şikayetvar NLP run"],
  },
  {
    id: "J2",
    phase: "Analysis",
    color: "#1D9E75",
    bg: "#E1F5EE",
    border: "#5DCAA5",
    title: "Anomaly Detection",
    actions: ["Revenue figure cross-check", "Portfolio status verification", "USG outlier flagging"],
  },
  {
    id: "J3",
    phase: "Validation",
    color: "#BA7517",
    bg: "#FAEEDA",
    border: "#FAC775",
    title: "Severity Scoring",
    actions: ["P0: factual financial errors", "P1: misleading status data", "P2: undisclosed assumptions"],
  },
  {
    id: "J4",
    phase: "Resolution",
    color: "#D85A30",
    bg: "#FAECE7",
    border: "#F0997B",
    title: "Corrective Briefs",
    actions: ["5 critical fixes documented", "Lipton removed from active", "EBIT 16.8% → 16.1%"],
  },
  {
    id: "J5",
    phase: "Delivery",
    color: "#378ADD",
    bg: "#E6F1FB",
    border: "#85B7EB",
    title: "Dashboard Update",
    actions: ["Files module added", "AI Analyst wired to live data", "Evidence chain linked"],
  },
];

export default function FilesModule() {
  const [activeBrand, setActiveBrand] = useState("Global");
  const [activeDept, setActiveDept] = useState("All");
  const [search, setSearch] = useState("");
  const [showJourney, setShowJourney] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileDetailRef = useRef(null);

  useEffect(() => {
    if (selectedFile && fileDetailRef.current) {
      fileDetailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFile]);
    const matchBrand = activeBrand === "Global" ? true : f.brand === activeBrand || f.brand === "Global";
    const matchDept = activeDept === "All" || f.dept === activeDept;
    const matchSearch = search === "" || f.title.toLowerCase().includes(search.toLowerCase()) || f.tags.some(t => t.includes(search.toLowerCase()));
    return matchBrand && matchDept && matchSearch;
  });

  const grouped = DEPARTMENTS.slice(1).reduce((acc, d) => {
    acc[d] = filtered.filter(f => f.dept === d);
    return acc;
  }, {});

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", padding: "0" }}>
      <h2 className="sr-only">Brand Files Repository — categorized documents, reports, and evidence files</h2>

      {/* Header bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <p style={{ fontSize: "18px", fontWeight: 500, margin: 0 }}>Files</p>
          <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{FILES.length} documents across {BRANDS.length - 1} brands</p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search files or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "200px", fontSize: "13px", padding: "6px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", outline: "none" }}
          />
          <button
            onClick={() => setShowJourney(!showJourney)}
            style={{ fontSize: "12px", padding: "6px 14px", background: showJourney ? "var(--color-background-info)" : undefined, color: showJourney ? "var(--color-text-info)" : undefined }}
          >
            {showJourney ? "Hide" : "Show"} solution journey ↗
          </button>
        </div>
      </div>

      {/* Solution Journey Diagram */}
      {showJourney && (
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", padding: "20px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", fontWeight: 500, margin: "0 0 4px" }}>Solution journey</p>
          <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "0 0 16px" }}>From raw data to corrective dashboard — methodology chain</p>
          <div style={{ display: "flex", alignItems: "stretch", gap: "0", overflowX: "auto" }}>
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step.id} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "140px" }}>
                <div style={{ flex: 1, background: step.bg, border: `0.5px solid ${step.border}`, borderRadius: "var(--border-radius-md)", padding: "12px", minHeight: "120px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 500, background: step.color, color: "#fff", padding: "2px 7px", borderRadius: "4px" }}>{step.phase}</span>
                  </div>
                  <p style={{ fontSize: "12px", fontWeight: 500, margin: "0 0 8px", color: step.color }}>{step.title}</p>
                  {step.actions.map((a, ai) => (
                    <p key={ai} style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "2px 0", lineHeight: 1.4 }}>— {a}</p>
                  ))}
                </div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <div style={{ width: "24px", textAlign: "center", fontSize: "14px", color: "var(--color-text-secondary)", flexShrink: 0 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-panel layout */}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "16px", alignItems: "start" }}>

        {/* Left: brand + dept nav */}
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", padding: "12px", position: "sticky", top: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brand</p>
          {BRANDS.map(b => (
            <button
              key={b}
              onClick={() => setActiveBrand(b)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                fontSize: "12px", padding: "5px 8px", marginBottom: "2px",
                background: activeBrand === b ? "var(--color-background-primary)" : "transparent",
                border: activeBrand === b ? "0.5px solid var(--color-border-secondary)" : "0.5px solid transparent",
                borderRadius: "var(--border-radius-md)",
                color: activeBrand === b ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                fontWeight: activeBrand === b ? 500 : 400,
                cursor: "pointer",
              }}
            >
              {b}
              <span style={{ float: "right", fontSize: "11px", color: "var(--color-text-secondary)" }}>
              {FILES.filter(f => {
                const matchBrand = b === "Global" ? f.brand === "Global" : f.brand === b || f.brand === "Global";
                const matchDept = activeDept === "All" || f.dept === activeDept;
                return matchBrand && matchDept;
              }).length}
              </span>
            </button>
          ))}

          <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Department</p>
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setActiveDept(d)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                fontSize: "12px", padding: "5px 8px", marginBottom: "2px",
                background: activeDept === d ? "var(--color-background-primary)" : "transparent",
                border: activeDept === d ? "0.5px solid var(--color-border-secondary)" : "0.5px solid transparent",
                borderRadius: "var(--border-radius-md)",
                color: activeDept === d ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                fontWeight: activeDept === d ? 500 : 400,
                cursor: "pointer",
              }}
            >
              {d === "All" && <span style={{ marginRight: "4px" }}>◼</span>}
              {d !== "All" && <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: DEPT_COLORS[d]?.border, marginRight: "6px", verticalAlign: "middle" }} />}
              {d}
            </button>
          ))}
        </div>

        {/* Right: file cards */}
        <div>
          {filtered.length === 0 && (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--color-text-secondary)", fontSize: "13px" }}>
              <p style={{ margin: "0 0 8px" }}>No files match this filter.</p>
              {search && (
                <button style={{ fontSize: "12px" }} onClick={() => setSearch("")}>Clear search</button>
              )}
            </div>
          )}

          {activeDept === "All"
            ? DEPARTMENTS.slice(1).map(dept => {
                const items = grouped[dept];
                if (!items || items.length === 0) return null;
                return (
                  <DeptSection key={dept} dept={dept} items={items} onSelect={setSelectedFile} selectedFile={selectedFile} />
                );
              })
            : <DeptSection dept={activeDept} items={filtered} onSelect={setSelectedFile} selectedFile={selectedFile} />
          }
        </div>
      </div>

      {/* File detail panel */}
      {selectedFile && (
        <div ref={fileDetailRef}>
          <FileDetail file={selectedFile} onClose={() => setSelectedFile(null)} />
        </div>
      )}
    </div>
  );
}

function DeptSection({ dept, items, onSelect, selectedFile }) {
  const dc = DEPT_COLORS[dept];
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
        <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: dc.border }} />
        <p style={{ fontSize: "13px", fontWeight: 500, margin: 0 }}>{dept}</p>
        <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{items.length} files</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
        {items.map(f => (
          <FileCard key={f.id} file={f} dc={dc} onSelect={onSelect} isSelected={selectedFile?.id === f.id} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ file, dc, onSelect, isSelected }) {
  const [hovered, setHovered] = useState(false);
  const sc = STATUS_COLORS[file.status];
  return (
    <div
      onClick={() => onSelect(isSelected ? null : file)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--color-background-primary)",
        border: isSelected ? `1.5px solid ${dc.border}` : hovered ? `0.5px solid ${dc.border}` : "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "12px 14px",
        cursor: "pointer",
        transition: "border 0.15s, box-shadow 0.15s",
        boxShadow: hovered && !isSelected ? `0 0 0 3px ${dc.bg}` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
        <span style={{ fontSize: "18px" }}>{FILE_ICONS[file.ext] || "📎"}</span>
        <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: sc.bg, color: sc.text, fontWeight: 500, flexShrink: 0 }}>{file.status}</span>
      </div>
      <p style={{ fontSize: "12px", fontWeight: 500, margin: "0 0 4px", lineHeight: 1.4 }}>{file.title}</p>
      <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", margin: "0 0 8px", lineHeight: 1.5 }}>{file.desc.substring(0, 80)}{file.desc.length > 80 ? "…" : ""}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
        {file.tags.map(t => (
          <span key={t} style={{ fontSize: "10px", padding: "1px 6px", background: dc.bg, color: dc.text, border: `0.5px solid ${dc.border}`, borderRadius: "4px" }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>.{file.ext}</span>
        <span style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}>{file.date}</span>
      </div>
    </div>
  );
}

function FileDetail({ file, onClose }) {
  const dc = DEPT_COLORS[file.dept] || {};
  const sc = STATUS_COLORS[file.status] || {};
  return (
    <div style={{ marginTop: "20px", background: "var(--color-background-primary)", border: `1.5px solid ${dc.border || "var(--color-border-primary)"}`, borderRadius: "var(--border-radius-lg)", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "28px" }}>{FILE_ICONS[file.ext] || "📎"}</span>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>{file.title}</p>
            <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{file.brand} · {file.dept} · {file.date}</p>
          </div>
        </div>
        <button onClick={onClose} style={{ fontSize: "12px", padding: "4px 10px" }}>Close</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 4px" }}>Description</p>
          <p style={{ fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{file.desc}</p>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 8px" }}>Metadata</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <MetaRow label="Department" value={<span style={{ fontSize: "11px", padding: "2px 7px", background: dc.bg, color: dc.text, borderRadius: "4px" }}>{file.dept}</span>} />
            <MetaRow label="Status" value={<span style={{ fontSize: "11px", padding: "2px 7px", background: sc.bg, color: sc.text, borderRadius: "4px" }}>{file.status}</span>} />
            <MetaRow label="Brand" value={file.brand} />
            <MetaRow label="Format" value={<span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>.{file.ext}</span>} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 6px" }}>Tags</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {file.tags.map(t => (
            <span key={t} style={{ fontSize: "11px", padding: "2px 8px", background: dc.bg, color: dc.text, border: `0.5px solid ${dc.border}`, borderRadius: "4px" }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button style={{ fontSize: "12px" }}>Download .{file.ext}</button>
        <button style={{ fontSize: "12px" }}>Share link</button>
        <button style={{ fontSize: "12px" }}>Open in viewer</button>
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
      <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
