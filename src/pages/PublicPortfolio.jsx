import { useState, useEffect, useRef, useCallback } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const PROJECTS = [
  { id: 1, name: "CivicPulse", desc: "Real-time public feedback platform for urban local bodies. Aggregates citizen reports, routes issues to departments, tracks resolution SLAs with auto-escalation.", tech: ["FastAPI", "React", "PostgreSQL", "Redis"], category: "Civic Tech", status: "Live", year: "2024", impact: "Deployed in 2 municipal corporations · 12K+ issues resolved" },
  { id: 2, name: "AgroSense", desc: "CNN-based crop disease detection from smartphone photos. Trained on 85K images across 26 crop varieties common to Maharashtra and Punjab seasons.", tech: ["PyTorch", "FastAPI", "React Native", "AWS S3"], category: "AgriTech", status: "Live", year: "2024", impact: "98.2% accuracy · 340+ farmers in pilot across 3 districts" },
  { id: 3, name: "UrbanGrid", desc: "Adaptive traffic signal control using YOLOv8 vehicle detection. Dynamically adjusts cycle durations based on real-time directional flow analysis.", tech: ["YOLOv8", "Python", "OpenCV", "MQTT"], category: "Smart City", status: "Prototype", year: "2023", impact: "28% reduction in avg. wait time at test intersections" },
  { id: 4, name: "PolicyBot", desc: "Multilingual chatbot for government scheme eligibility using RAG over 1,200+ central and state scheme documents. Supports Hindi, Marathi, Tamil.", tech: ["LangChain", "GPT-4o", "Pinecone", "Next.js"], category: "GovTech", status: "Beta", year: "2024", impact: "500+ queries/day · 91% user satisfaction score" },
  { id: 5, name: "IDEAthon", desc: "End-to-end hackathon platform handling team formation, mentor matching, multi-round submission workflows, and jury scoring with live leaderboards.", tech: ["Node.js", "React", "MongoDB", "Socket.io"], category: "EdTech", status: "Live", year: "2023", impact: "Used by 4 institutes · 1,800+ participants across 2 cohorts" },
  { id: 6, name: "RailSense", desc: "Predictive maintenance for railway tracks using LSTM on accelerometer data from onboard sensors. Flags degraded sections before mechanical failure.", tech: ["TensorFlow", "Kafka", "InfluxDB", "Grafana"], category: "Infrastructure", status: "Research", year: "2023", impact: "94.7% precision on 3 rail corridors · presented at IRISET" },
];

const SKILLS = [
  { name: "Python", level: 94 }, { name: "Machine Learning", level: 89 },
  { name: "React / Next.js", level: 85 }, { name: "NLP / LLMs", level: 82 },
  { name: "System Design", level: 80 }, { name: "Computer Vision", level: 78 },
  { name: "Node.js / APIs", level: 75 }, { name: "GIS / Spatial", level: 70 },
];

const RADAR = [
  { subject: "ML/AI", A: 90 }, { subject: "Frontend", A: 83 },
  { subject: "Backend", A: 78 }, { subject: "Research", A: 88 },
  { subject: "Product", A: 76 }, { subject: "DevOps", A: 65 },
];

const STACK = [
  { title: "ML / AI", items: ["PyTorch", "TensorFlow", "LangChain", "HuggingFace", "OpenCV", "Scikit-learn", "FAISS", "Pinecone"] },
  { title: "Web & APIs", items: ["React", "Next.js", "Node.js", "FastAPI", "GraphQL", "Socket.io", "TypeScript", "Tailwind"] },
  { title: "Infra & Data", items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Docker", "AWS", "InfluxDB", "MQTT"] },
];

const CMD = {
  help: ["  whoami        about the developer", "  projects       list all projects", "  skills         technical stack", "  contact        get in touch", "  open [name]    inspect a project", "  clear          clear terminal"],
  whoami: ["Raj — full-stack developer & civic technologist.", "Mumbai, India. Building AI systems for public infrastructure.", "—", "B.Tech CS · Focus: GovTech · Smart Cities · AgriTech · ML Systems", "Currently exploring: India AI Innovation Challenge, Smart India Hackathon 2025"],
  skills: ["Languages    Python · TypeScript · SQL · C++", "ML/AI        PyTorch · TensorFlow · LangChain · HuggingFace", "Web          React · Next.js · Node.js · FastAPI", "Infra        AWS · Docker · Kafka · PostgreSQL · Redis", "Domains      Computer Vision · NLP · LLMs · GIS · IoT"],
  contact: ["Email      raj@example.com", "GitHub     github.com/raj-dev", "LinkedIn   linkedin.com/in/raj-dev", "Location   Mumbai, Maharashtra, India"],
  projects: PROJECTS.map(p => `  [${p.status.padEnd(9)}]  ${p.name.padEnd(12)}  ${p.category}`),
};

function generateActivity() {
  const weeks = [];
  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const isWeekday = d < 5;
      const r = Math.random();
      let val = 0;
      if (isWeekday) { val = r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.72 ? 2 : r < 0.87 ? 3 : r < 0.95 ? 4 : 5; }
      else { val = r < 0.65 ? 0 : r < 0.82 ? 1 : r < 0.93 ? 2 : 3; }
      days.push(val);
    }
    weeks.push(days);
  }
  return weeks;
}

const ACTIVITY = generateActivity();
const actColor = (v) => ["#111120","#451a03","#7c2d12","#c2410c","#f59e0b","#fcd34d"][Math.min(v,5)];
const statusColor = (s) => ({ Live:"#10b981", Beta:"#3b82f6", Prototype:"#f59e0b", Research:"#8b5cf6" }[s] || "#6b7280");

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Sora:wght@400;600;700&display=swap');`;

export default function PublicPortfolio() {
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState("All");
  const [lines, setLines] = useState([
    { t: "sys", v: "Portfolio CLI v2.5  —  type 'help' to explore" },
    { t: "sys", v: "─".repeat(48) },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  const runCmd = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setHist(h => [cmd, ...h]);
    setHIdx(-1);
    if (cmd === "clear") { setLines([{ t: "sys", v: "Portfolio CLI v2.5" }]); setInput(""); return; }
    const out = [{ t: "inp", v: `> ${raw}` }];
    if (cmd.startsWith("open ")) {
      const name = cmd.slice(5);
      const p = PROJECTS.find(x => x.name.toLowerCase() === name);
      if (p) {
        out.push(
          { t: "out", v: `${p.name}  ·  ${p.category}  ·  ${p.status}` },
          { t: "out", v: p.desc },
          { t: "out", v: `Stack: ${p.tech.join(", ")}` },
          { t: "hi",  v: `Impact: ${p.impact}` },
        );
      } else {
        out.push({ t: "err", v: `project '${name}' not found. try: open civicpulse` });
      }
    } else if (CMD[cmd]) {
      CMD[cmd].forEach(v => out.push({ t: "out", v }));
    } else {
      out.push({ t: "err", v: `command not found: ${cmd}. type 'help'` });
    }
    setLines(l => [...l, ...out]);
    setInput("");
  }, []);

  const onKey = (e) => {
    if (e.key === "Enter") { runCmd(input); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(hIdx+1, hist.length-1); setHIdx(i); setInput(hist[i]||""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(hIdx-1,-1); setHIdx(i); setInput(i===-1?"":hist[i]); }
  };

  const cats = ["All", ...new Set(PROJECTS.map(p => p.category))];
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <div style={{ fontFamily:"'IBM Plex Mono',monospace", background:"#07070f", minHeight:"100vh", color:"#e2e8f0" }}>
      <style>{FONTS}{`
        *{box-sizing:border-box;margin:0;padding:0}
        .tb{background:none;border:none;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.15em;padding:12px 20px;color:#334155;transition:all .2s;border-bottom:2px solid transparent}
        .tb:hover{color:#64748b}
        .tb.on{color:#f59e0b;border-bottom-color:#f59e0b}
        .pc{background:#0c0c1a;border:1px solid #1a1a30;border-radius:8px;padding:20px;transition:border-color .2s}
        .pc:hover{border-color:#f59e0b44}
        .fb{background:none;border:1px solid #1a1a30;border-radius:4px;padding:5px 11px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#334155;cursor:pointer;transition:all .2s;letter-spacing:.05em}
        .fb:hover{color:#64748b;border-color:#2d2d45}
        .fb.on{color:#f59e0b;border-color:#f59e0b44;background:#f59e0b0a}
        .tl{font-size:13px;line-height:1.75}
        .tl.inp{color:#f59e0b}
        .tl.out{color:#64748b;padding-left:14px}
        .tl.sys{color:#334155}
        .tl.err{color:#f87171;padding-left:14px}
        .tl.hi{color:#f59e0b;padding-left:14px}
        .sk-fill{height:3px;border-radius:2px;background:linear-gradient(90deg,#d97706,#f59e0b)}
        .qb{background:none;border:1px solid #1a1a30;border-radius:3px;padding:3px 9px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#334155;cursor:pointer;transition:all .2s}
        .qb:hover{color:#64748b;border-color:#2d2d45}
      `}</style>

      {/* NAV */}
      <div style={{ borderBottom:"1px solid #1a1a30", padding:"0 36px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ padding:"15px 0" }}>
          <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"17px", fontWeight:700, color:"#f8fafc", letterSpacing:"-.02em" }}>
            RAJ<span style={{ color:"#f59e0b" }}>.</span>DEV
          </div>
          <div style={{ fontSize:"9px", color:"#1e293b", letterSpacing:".18em", marginTop:"2px" }}>MUMBAI · INDIA</div>
        </div>
        <nav style={{ display:"flex", gap:"2px" }}>
          {[["home","⬡","HOME"],["projects","◈","WORK"],["skills","◉","SKILLS"],["terminal",">","CLI"]].map(([id,icon,label])=>(
            <button key={id} className={`tb ${tab===id?"on":""}`} onClick={()=>setTab(id)}>
              <span style={{ marginRight:"6px", opacity:.6 }}>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{ fontSize:"10px", letterSpacing:".1em" }}>
          <span style={{ color:"#10b981", marginRight:"6px" }}>●</span>
          <span style={{ color:"#1e3a5f" }}>OPEN TO WORK</span>
        </div>
      </div>

      <div style={{ padding:"36px", maxWidth:"1080px", margin:"0 auto" }}>

        {/* ── HOME ── */}
        {tab==="home" && (
          <div>
            <div style={{ marginBottom:"44px" }}>
              <div style={{ fontSize:"10px", color:"#f59e0b", letterSpacing:".2em", marginBottom:"10px" }}>FULL-STACK · ML ENGINEER · CIVIC TECHNOLOGIST</div>
              <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:"54px", fontWeight:700, lineHeight:1.04, color:"#f8fafc", letterSpacing:"-.03em", marginBottom:"18px" }}>
                Building tech<br /><span style={{ color:"#f59e0b" }}>for public good.</span>
              </h1>
              <p style={{ fontSize:"14px", color:"#475569", lineHeight:1.85, maxWidth:"500px", fontFamily:"'Sora',sans-serif" }}>
                I design and ship intelligent systems at the intersection of AI, urban infrastructure, and governance. Work includes production deployments across municipal corporations, agricultural platforms, and government services.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"44px" }}>
              {[["14","Projects shipped"],["2.1K","Open-source stars"],["18K+","Impact users"],["3","Research papers"]].map(([v,l])=>(
                <div key={l} style={{ background:"#0c0c1a", border:"1px solid #1a1a30", borderRadius:"8px", padding:"16px 20px" }}>
                  <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"30px", fontWeight:700, color:"#f59e0b" }}>{v}</div>
                  <div style={{ fontSize:"10px", color:"#334155", marginTop:"4px", letterSpacing:".05em" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Activity grid */}
            <div style={{ marginBottom:"44px" }}>
              <div style={{ fontSize:"10px", color:"#1e293b", letterSpacing:".12em", marginBottom:"14px" }}>CONTRIBUTION ACTIVITY — LAST 12 MONTHS</div>
              <div style={{ display:"flex", gap:"3px", overflowX:"auto", paddingBottom:"4px" }}>
                {ACTIVITY.map((wk,wi)=>(
                  <div key={wi} style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
                    {wk.map((day,di)=>(
                      <div key={di} title={`${day} contributions`} style={{ width:"11px", height:"11px", borderRadius:"2px", background:actColor(day) }} />
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"8px" }}>
                <span style={{ fontSize:"10px", color:"#1e293b" }}>Less</span>
                {[0,1,2,3,4,5].map(v=><div key={v} style={{ width:"11px", height:"11px", borderRadius:"2px", background:actColor(v) }} />)}
                <span style={{ fontSize:"10px", color:"#1e293b" }}>More</span>
              </div>
            </div>

            {/* Now */}
            <div style={{ background:"#0c0c1a", border:"1px solid #1a1a30", borderRadius:"8px", padding:"20px" }}>
              <div style={{ fontSize:"10px", color:"#1e293b", letterSpacing:".12em", marginBottom:"18px" }}>RIGHT NOW</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"24px" }}>
                {[
                  ["BUILDING","PolicyBot v2 — RAG pipeline over 2K+ gov scheme docs, adding voice interface"],
                  ["READING","\"The Alignment Problem\" · Brian Christian · halfway through"],
                  ["TARGETING","India AI Innovation Challenge 2025 · Smart India Hackathon"],
                ].map(([l,v])=>(
                  <div key={l}>
                    <div style={{ fontSize:"9px", color:"#f59e0b", letterSpacing:".14em", marginBottom:"8px" }}>{l}</div>
                    <div style={{ fontSize:"12px", color:"#475569", lineHeight:1.7 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab==="projects" && (
          <div>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"28px", flexWrap:"wrap", gap:"12px" }}>
              <div>
                <div style={{ fontSize:"10px", color:"#f59e0b", letterSpacing:".2em", marginBottom:"4px" }}>SELECTED WORK</div>
                <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"30px", fontWeight:700, color:"#f8fafc", letterSpacing:"-.02em" }}>
                  {shown.length} project{shown.length!==1?"s":""}
                </h2>
              </div>
              <div style={{ display:"flex", gap:"7px", flexWrap:"wrap" }}>
                {cats.map(c=>(
                  <button key={c} className={`fb ${filter===c?"on":""}`} onClick={()=>setFilter(c)}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>
              {shown.map(p=>(
                <div key={p.id} className="pc">
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"12px" }}>
                    <div>
                      <div style={{ fontFamily:"'Sora',sans-serif", fontSize:"16px", fontWeight:600, color:"#f1f5f9", marginBottom:"3px" }}>{p.name}</div>
                      <div style={{ fontSize:"10px", color:"#1e293b", letterSpacing:".08em" }}>{p.category} · {p.year}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"2px" }}>
                      <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:statusColor(p.status) }} />
                      <span style={{ fontSize:"10px", color:statusColor(p.status), letterSpacing:".05em" }}>{p.status}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:"12px", color:"#475569", lineHeight:1.75, marginBottom:"14px", fontFamily:"'Sora',sans-serif" }}>{p.desc}</p>
                  <div style={{ background:"#f59e0b0d", border:"1px solid #f59e0b1a", borderRadius:"4px", padding:"8px 12px", marginBottom:"14px" }}>
                    <span style={{ fontSize:"10px", color:"#f59e0b" }}>◆ </span>
                    <span style={{ fontSize:"11px", color:"#64748b" }}>{p.impact}</span>
                  </div>
                  <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
                    {p.tech.map(t=>(
                      <span key={t} style={{ fontSize:"10px", padding:"3px 8px", background:"#111120", border:"1px solid #1e1e35", borderRadius:"3px", color:"#334155", letterSpacing:".03em" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab==="skills" && (
          <div>
            <div style={{ marginBottom:"32px" }}>
              <div style={{ fontSize:"10px", color:"#f59e0b", letterSpacing:".2em", marginBottom:"4px" }}>TECHNICAL EXPERTISE</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"30px", fontWeight:700, color:"#f8fafc", letterSpacing:"-.02em" }}>Skills & Stack</h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"44px", marginBottom:"40px" }}>
              <div>
                <div style={{ fontSize:"10px", color:"#1e293b", letterSpacing:".12em", marginBottom:"22px" }}>PROFICIENCY</div>
                {SKILLS.map(s=>(
                  <div key={s.name} style={{ marginBottom:"15px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                      <span style={{ fontSize:"12px", color:"#64748b" }}>{s.name}</span>
                      <span style={{ fontSize:"10px", color:"#334155" }}>{s.level}%</span>
                    </div>
                    <div style={{ height:"3px", background:"#1a1a30", borderRadius:"2px" }}>
                      <div className="sk-fill" style={{ width:`${s.level}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize:"10px", color:"#1e293b", letterSpacing:".12em", marginBottom:"16px" }}>COMPETENCY RADAR</div>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={RADAR} margin={{ top:10, right:20, bottom:10, left:20 }}>
                    <PolarGrid stroke="#1a1a30" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill:"#334155", fontSize:11, fontFamily:"'IBM Plex Mono'" }} />
                    <PolarRadiusAxis angle={90} domain={[0,100]} tick={false} axisLine={false} />
                    <Radar dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={1.5} dot={{ r:3, fill:"#f59e0b" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
              {STACK.map(cat=>(
                <div key={cat.title} style={{ background:"#0c0c1a", border:"1px solid #1a1a30", borderRadius:"8px", padding:"18px" }}>
                  <div style={{ fontSize:"10px", color:"#f59e0b", letterSpacing:".12em", marginBottom:"14px" }}>{cat.title}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                    {cat.items.map(item=>(
                      <span key={item} style={{ fontSize:"10px", padding:"3px 8px", background:"#111120", border:"1px solid #1e1e35", borderRadius:"3px", color:"#334155" }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TERMINAL ── */}
        {tab==="terminal" && (
          <div>
            <div style={{ marginBottom:"18px" }}>
              <div style={{ fontSize:"10px", color:"#f59e0b", letterSpacing:".2em", marginBottom:"4px" }}>INTERACTIVE</div>
              <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:"30px", fontWeight:700, color:"#f8fafc", letterSpacing:"-.02em" }}>CLI Portfolio</h2>
            </div>
            <div
              style={{ background:"#04040c", border:"1px solid #1a1a30", borderRadius:"8px", padding:"22px", minHeight:"480px", cursor:"text" }}
              onClick={()=>inputRef.current?.focus()}
            >
              <div style={{ display:"flex", gap:"6px", marginBottom:"20px", alignItems:"center" }}>
                <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#ef4444" }} />
                <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#f59e0b" }} />
                <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:"#10b981" }} />
                <span style={{ marginLeft:"10px", fontSize:"11px", color:"#1e293b" }}>portfolio — raj@dev — zsh</span>
              </div>
              <div>
                {lines.map((l,i)=>(
                  <div key={i} className={`tl ${l.t}`}>{l.v}</div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"10px" }}>
                <span style={{ color:"#f59e0b", fontSize:"13px", whiteSpace:"nowrap" }}>raj@portfolio:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={onKey}
                  autoFocus
                  spellCheck={false}
                  style={{ background:"none", border:"none", outline:"none", color:"#f59e0b", fontFamily:"'IBM Plex Mono',monospace", fontSize:"13px", flex:1, caretColor:"#f59e0b" }}
                />
              </div>
              <div ref={endRef} />
            </div>
            <div style={{ marginTop:"12px", display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
              <span style={{ fontSize:"10px", color:"#1e293b", marginRight:"4px" }}>Quick:</span>
              {["help","whoami","projects","skills","contact","open civicpulse"].map(cmd=>(
                <button key={cmd} className="qb" onClick={()=>runCmd(cmd)}>{cmd}</button>              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ borderTop:"1px solid #0f0f20", padding:"14px 36px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"10px", color:"#1e293b" }}>RAJ.DEV · MUMBAI · {new Date().getFullYear()}</span>
        <span style={{ fontSize:"10px", color:"#1e293b" }}>BUILT WITH REACT · RECHARTS</span>
      </div>
    </div>
  );
}