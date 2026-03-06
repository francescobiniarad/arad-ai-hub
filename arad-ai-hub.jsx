import { useState, useEffect } from "react";

// ─── ICONS ──────────────────────────────────────────────────────────
const Icons = {
  Home: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Back: () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  Plus: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  X: () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Edit: () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Beaker: () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>),
  GraduationCap: () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>),
  Rocket: () => (<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>),
  ChevronDown: () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  ChevronRight: () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  Board: () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  Table: () => (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>),
};

// ─── STORAGE ────────────────────────────────────────────────────────
const ST = {
  async get(k) { try { const r = await window.storage?.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } },
  async set(k, v) { try { await window.storage?.set(k, JSON.stringify(v)); } catch {} }
};

// ─── KANBAN COLUMNS ─────────────────────────────────────────────────
const KCOLS = [
  { id: "backlog", label: "Backlog", color: "#F97316", bg: "rgba(249,115,22,0.12)" },
  { id: "doing", label: "Doing", color: "#FBBF24", bg: "rgba(251,191,36,0.12)" },
  { id: "done", label: "Done", color: "#3B82F6", bg: "rgba(59,130,246,0.12)" },
  { id: "testing", label: "Testing", color: "#A855F7", bg: "rgba(168,85,247,0.12)" },
  { id: "ready", label: "Ready for Adoption", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  { id: "adopted", label: "Adopted", color: "#22C55E", bg: "rgba(34,197,94,0.12)" },
];

// ─── INITIAL DATA ───────────────────────────────────────────────────
const I_CERT = [
  { id: "c1", name: "Google AI Essentials", provider: "Google", description: "Base AIME mettere Gemma AI modelli base e intro", level: "Base", members: "" },
  { id: "c2", name: "Google Prompting Essentials", provider: "Google", description: "Imparare a scrivere prompt efficaci", level: "Base", members: "" },
  { id: "c3", name: "Generative AI Leader", provider: "Google", description: "Come far trasformare le aziende, cioè il tipo è PBO leader", level: "Intermedio", members: "" },
  { id: "c4", name: "AI Board Meta", provider: "Meta", description: "57 video/25 Hr Mid course fra le varie research Field", level: "Avanzato", members: "" },
  { id: "c5", name: "Gemini Enterprise & NotebookLM", provider: "Google", description: "Configurazione Gemini per aziende e gestione agenti AI personalizzati", level: "Intermedio", members: "" },
];
const I_PRAC = [
  { id: "p1", date: "13/03", topic: "Google Sheet + Gemini", referente: "", theory: "", practice: "" },
  { id: "p2", date: "20/03", topic: "Come usare NotebookLM", referente: "", theory: "", practice: "" },
  { id: "p3", date: "27/03", topic: "Google Slides + Gemini", referente: "", theory: "", practice: "" },
  { id: "p4", date: "03/04", topic: "Gemini + Google AI Studio + Gmail", referente: "", theory: "", practice: "" },
  { id: "p5", date: "10/04", topic: "Quando come e perché usare Google AI Studio", referente: "", theory: "", practice: "" },
  { id: "p6", date: "17/04", topic: "Creare interfacce su Claude", referente: "", theory: "", practice: "" },
  { id: "p7", date: "24/04", topic: "Claude Skill e contract drafter", referente: "", theory: "", practice: "" },
  { id: "p8", date: "08/05", topic: "Bug - costi e come usarla nel piccolo", referente: "", theory: "", practice: "" },
  { id: "p9", date: "15/05", topic: "Sostituire Google Sheet con interfacce AI", referente: "", theory: "", practice: "" },
  { id: "p10", date: "22/05", topic: "Sostituire Google Slides con interfacce AI", referente: "", theory: "", practice: "" },
  { id: "p11", date: "29/05", topic: "Analisi dati su Claude", referente: "", theory: "", practice: "" },
  { id: "p12", date: "05/06", topic: "Pratiche di project management 'Summarize'", referente: "", theory: "", practice: "" },
];
const I_WORK = [{ id: "w1", date: "", topic: "", leader: "", notes: "" }];

// Streams with substream leaders
const I_STREAMS = [
  { id: "s1", name: "Ways of Working", leader: "Francesco", substreams: [
    { id: "ss1", name: "Interactive Webapps", leader: "Francesco" },
    { id: "ss2", name: "Claude Skills", leader: "Francesco" },
    { id: "ss3", name: "Get Things Done", leader: "[NOME]" },
  ]},
  { id: "s2", name: "New Services & Products", leader: "Francesco", substreams: [] },
  { id: "s3", name: "Formazione AI", leader: "Andrea", substreams: [
    { id: "ss4", name: "Interactive Learning Hub", leader: "[NOME]" },
    { id: "ss5", name: "Gamification Duolingo", leader: "[NOME]" },
  ]},
  { id: "s4", name: "Change Management", leader: "Andrea", substreams: [] },
  { id: "s5", name: "Agentic Commerce", leader: "Sofia", substreams: [] },
  { id: "s6", name: "ARAD Model", leader: "Alessio", substreams: [] },
];

// Ideas: unified model for kanban + tabella
const I_IDEAS = [
  { id: "n1", ideaId: 1, text: "Contract Drafter", description: "Skill Claude per creazione contratti commerciali ARAD", streamId: "s1", substreamId: "ss2", col: "done", partenza: "Contratti fatti manualmente con copy/paste da contratti precedenti.", arrivo: "Caricare su Claude appunti Gemini, Slides e docs → output in minuti. Solo rileggere, modificare e approvare." },
  { id: "n2", ideaId: 2, text: "ARAD Portfolio Services", description: "Webapp interattiva portfolio servizi ARAD", streamId: "s1", substreamId: "ss1", col: "backlog", partenza: "", arrivo: "" },
  { id: "n3", ideaId: 3, text: "Conversational Website", description: "Sito web conversazionale AI-powered", streamId: "s1", substreamId: "ss1", col: "backlog", partenza: "", arrivo: "" },
  { id: "n4", ideaId: 4, text: "Agentic Commerce Dashboard", description: "Dashboard interattiva agentic commerce", streamId: "s1", substreamId: "ss1", col: "backlog", partenza: "", arrivo: "" },
  { id: "n5", ideaId: 5, text: "Modello ARAD", description: "Definizione modello operativo ARAD", streamId: "s6", substreamId: null, col: "backlog", partenza: "", arrivo: "" },
];

const I_OFFER = [
  { id: "o1", stream: "Change Management / Formazione AI", title: "AI Readiness Acceleration per Team Digital", description: "Percorsi di accelerazione guidati per incrementare competenze team digital.", valueProp: "Non è formazione, è un'accelerazione dell'evoluzione delle competenze.", sforzo: 4.2, appetibilita: 9.2, noteAM: "No brainer" },
  { id: "o2", stream: "Change Management / Formazione AI", title: "AI Leadership - Ongoing Coaching", description: "Percorsi di aggiornamento e accompagnamento per il management retail sull'AI.", valueProp: "Contenuto per tutte le aree retail + aggiornamento gestito con capacità critica.", sforzo: 7.2, appetibilita: 9.2, noteAM: "Solo se con Mida" },
  { id: "o3", stream: "Change Management / Formazione AI", title: "Org AI Readiness Check", description: "Valutazione rapida della readiness AI di un'organizzazione tramite agenti.", valueProp: "Assessment che allestisce una knowledge base aziendale.", sforzo: 7.0, appetibilita: 8.0, noteAM: "Solo se con Mida e tool proprietario" },
  { id: "o4", stream: "Ways of Working", title: "Slideless Delivery", description: "Sostituire presentazioni con interfacce web interattive navigabili.", valueProp: "Maggior engagement, posizionamento AI-native.", sforzo: 4.0, appetibilita: 8.0, noteAM: "Add-on del AI Readiness Acceleration" },
  { id: "o5", stream: "Ways of Working", title: "Doc Automation for Commercial Teams", description: "Piattaforma per generazione automatica di contratti e proposte commerciali.", valueProp: "Documenti standard 75% uguali. Da proposta a offerta in pochi click.", sforzo: 6.0, appetibilita: 6.0, noteAM: "Non congruo per AI offering esterna" },
  { id: "o6", stream: "Ways of Working", title: "Knowledge Hub", description: "Infrastruttura per strutturare il dato disordinato in formato JSON.", valueProp: "Trasformare knowledge in asset aziendale permanente.", sforzo: 8.0, appetibilita: 4.0, noteAM: "Add-on del AI Readiness Acceleration" },
  { id: "o7", stream: "Agentic-Commerce", title: "Agent-Readiness Audit & Strategy", description: "Assessment strutturato della readiness per agenti AI autonomi.", valueProp: "ARAD presidia lo spazio tra SEO e consulenza luxury.", sforzo: 3.8, appetibilita: 8.8, noteAM: "No brainer." },
  { id: "o8", stream: "Agentic-Commerce", title: "AI Commerce Content Engine", description: "Sistema di produzione contenuti commerce per il nuovo ecosistema AI.", valueProp: "Ponte tra linguaggio luxury e architettura tecnica AI-readable.", sforzo: 6.8, appetibilita: 8.8, noteAM: "Long shot, valutare partner." },
  { id: "o9", stream: "Agentic-Commerce", title: "AI Commerce Analytics & Attribution", description: "Ridisegnare il framework di measurement per nuovi touchpoint AI.", valueProp: "Bundling naturale con qualsiasi intervento AI commerce.", sforzo: 5.0, appetibilita: 7.0, noteAM: "Partnership con Search Bridge" },
  { id: "o10", stream: "Agentic-Commerce", title: "Post-Purchase & Returns Intelligence", description: "Agenti AI che predicono probabilità di reso e attivano retention proattive.", valueProp: "ROI diretto: riduzione reso 10-20%.", sforzo: 6.0, appetibilita: 8.0, noteAM: "Effort elevato" },
  { id: "o11", stream: "Agentic-Commerce", title: "Dynamic Pricing Intelligence", description: "Pricing intelligence brand-safe per marketplace.", valueProp: "Layer di intelligenza tra tool di pricing e brand luxury.", sforzo: 7.0, appetibilita: 8.0, noteAM: "Wishful thinking" },
  { id: "o12", stream: "Ways of Working", title: "AI Augmented Assessment", description: "Core business potenziato dall'AI per assessment interni.", valueProp: "Assessment più veloci tramite voice + knowledge base.", sforzo: 9.0, appetibilita: 7.0, noteAM: "Non chiaro il cliente target" },
];

// ─── MAIN APP ───────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [subPage, setSubPage] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [cert, setCert] = useState(I_CERT);
  const [prac, setPrac] = useState(I_PRAC);
  const [work, setWork] = useState(I_WORK);
  const [streams, setStreams] = useState(I_STREAMS);
  const [ideas, setIdeas] = useState(I_IDEAS);
  const [offer, setOffer] = useState(I_OFFER);

  useEffect(() => { (async () => {
    const [a,b,c,d,e,f] = await Promise.all([ST.get("v4-cert"),ST.get("v4-prac"),ST.get("v4-work"),ST.get("v4-streams"),ST.get("v4-ideas"),ST.get("v4-offer")]);
    if(a)setCert(a);if(b)setPrac(b);if(c)setWork(c);if(d)setStreams(d);if(e)setIdeas(e);if(f)setOffer(f);
    setLoaded(true);
  })(); }, []);

  useEffect(()=>{if(loaded)ST.set("v4-cert",cert)},[cert,loaded]);
  useEffect(()=>{if(loaded)ST.set("v4-prac",prac)},[prac,loaded]);
  useEffect(()=>{if(loaded)ST.set("v4-work",work)},[work,loaded]);
  useEffect(()=>{if(loaded)ST.set("v4-streams",streams)},[streams,loaded]);
  useEffect(()=>{if(loaded)ST.set("v4-ideas",ideas)},[ideas,loaded]);
  useEffect(()=>{if(loaded)ST.set("v4-offer",offer)},[offer,loaded]);

  const nav = (p, s=null) => { setPage(p); setSubPage(s); window.scrollTo(0,0); };

  // Breadcrumb
  const bc = () => {
    if(page==="home") return "Home";
    if(page==="formazione") return subPage ? `Formazione AI › ${subPage}` : "Formazione AI";
    if(page==="rd") return subPage ? `R&D › ${subPage==="kanban"?"Kanban":"Tabella Idee"}` : "R&D";
    return "AI Offering";
  };

  if(!loaded) return <div style={{background:"#0B0F1A",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{color:"#6366F1",fontFamily:"'Space Mono',monospace"}}>Loading...</div></div>;

  return (
    <div style={{background:"#0B0F1A",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#E2E8F0"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:#1E293B}
        ::-webkit-scrollbar-thumb{background:#475569;border-radius:3px}
        input,textarea,select{font-family:'DM Sans',sans-serif}
        .card-hover{transition:all .3s cubic-bezier(.4,0,.2,1)}
        .card-hover:hover{transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.3)}
        .postit{cursor:grab;transition:transform .15s,box-shadow .15s;user-select:none}
        .postit:hover{transform:scale(1.05) rotate(-1deg);box-shadow:0 8px 20px rgba(0,0,0,.4)}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn .4s ease-out forwards}
        .grid-bg{background-image:radial-gradient(circle at 1px 1px,rgba(99,102,241,.07) 1px,transparent 0);background-size:32px 32px}
        .btn{background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:8px;padding:7px 14px;color:#A5B4FC;cursor:pointer;font-size:12px;display:inline-flex;align-items:center;gap:5px;transition:background .15s}
        .btn:hover{background:rgba(99,102,241,.25)}
        .btn-sm{padding:4px 10px;font-size:11px;border-radius:6px}
        .idk{background:rgba(15,23,42,.7);border:1px solid rgba(99,102,241,.15);border-radius:7px;padding:8px 10px;color:#E2E8F0;font-size:13px;width:100%}
        .idk:focus{outline:none;border-color:rgba(99,102,241,.5)}
        .trow:hover{background:rgba(99,102,241,.06) !important}
      `}</style>

      {/* NAV */}
      <nav style={{background:"rgba(11,15,26,.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(99,102,241,.15)",padding:"12px 24px",display:"flex",alignItems:"center",gap:"16px",position:"sticky",top:0,zIndex:100}}>
        {page!=="home"&&<button className="btn btn-sm" onClick={()=>subPage?nav(page):nav("home")}><Icons.Back/> Back</button>}
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",color:"#6366F1",cursor:"pointer",display:"flex"}}><Icons.Home/></button>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:"14px",color:"#6366F1",fontWeight:700,letterSpacing:"2px"}}>ARAD AI HUB</div>
        <div style={{flex:1}}/>
        <div style={{fontSize:"12px",color:"#64748B"}}>{bc()}</div>
      </nav>

      <div style={{maxWidth:(page==="rd"&&subPage==="kanban")?"100%":"1400px",margin:"0 auto",padding:(page==="rd"&&subPage==="kanban")?"24px 12px":"32px 24px"}}>
        {page==="home"&&<HomePage nav={nav}/>}
        {page==="formazione"&&!subPage&&<FormazioneHome nav={nav}/>}
        {page==="formazione"&&subPage==="certificazioni"&&<Certificazioni data={cert} setData={setCert}/>}
        {page==="formazione"&&subPage==="workshop"&&<WorkshopAI data={work} setData={setWork}/>}
        {page==="formazione"&&subPage==="practical"&&<PracticalAI data={prac} setData={setPrac}/>}
        {page==="formazione"&&subPage==="news"&&<Placeholder title="📰 News" text="L'idea è quella di creare una sorta di hub delle news in ambito AI per il team." c="06B6D4"/>}
        {page==="formazione"&&subPage==="gamification"&&<Placeholder title="🎮 Gamification dell'Esperienza" text="L'ultimate goal è creare una piattaforma che gamifica l'esperienza, l'utilizzo e l'apprendimento di temi AI. Ci saranno leaderboard, streaks e giochi engaging." c="EC4899"/>}
        {page==="rd"&&!subPage&&<RDHome nav={nav}/>}
        {page==="rd"&&subPage==="kanban"&&<Kanban streams={streams} setStreams={setStreams} ideas={ideas} setIdeas={setIdeas}/>}
        {page==="rd"&&subPage==="tabella"&&<TabellaIdee streams={streams} ideas={ideas} setIdeas={setIdeas}/>}
        {page==="offering"&&<AIOffering data={offer} setData={setOffer}/>}
      </div>
    </div>
  );
}

// ─── HOME ───────────────────────────────────────────────────────────
function HomePage({nav}){
  const cards=[
    {id:"rd",label:"R&D",desc:"Kanban board e tabella idee per il tracking degli stream AI interni.",icon:<Icons.Beaker/>,gradient:"linear-gradient(135deg,#6366F1,#8B5CF6)"},
    {id:"formazione",label:"Formazione AI",desc:"Certificazioni, workshop, sessioni pratiche e gamification.",icon:<Icons.GraduationCap/>,gradient:"linear-gradient(135deg,#F59E0B,#EF4444)"},
    {id:"offering",label:"AI Offering",desc:"Decision sheet per valutare e prioritizzare le idee di servizio AI.",icon:<Icons.Rocket/>,gradient:"linear-gradient(135deg,#22C55E,#06B6D4)"},
  ];
  return(
    <div className="grid-bg fade-in" style={{paddingTop:"48px"}}>
      <div style={{textAlign:"center",marginBottom:"56px"}}>
        <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"clamp(28px,5vw,48px)",fontWeight:700,letterSpacing:"-1px",background:"linear-gradient(135deg,#6366F1,#A855F7,#EC4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:"12px"}}>ARAD Digital AI Hub</h1>
        <p style={{color:"#64748B",fontSize:"16px",maxWidth:"480px",margin:"0 auto"}}>Centro di comando interno per il tracking di tutte le iniziative AI.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"24px",maxWidth:"1000px",margin:"0 auto"}}>
        {cards.map((c,i)=>(
          <div key={c.id} className="card-hover fade-in" onClick={()=>nav(c.id)} style={{animationDelay:`${i*100}ms`,background:"rgba(30,41,59,.6)",border:"1px solid rgba(99,102,241,.15)",borderRadius:"16px",padding:"32px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:c.gradient}}/>
            <div style={{width:"56px",height:"56px",borderRadius:"14px",background:c.gradient,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"20px",color:"white"}}>{c.icon}</div>
            <h2 style={{fontFamily:"'Space Mono',monospace",fontSize:"22px",fontWeight:700,marginBottom:"8px"}}>{c.label}</h2>
            <p style={{color:"#94A3B8",fontSize:"14px",lineHeight:"1.6"}}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FORMAZIONE ─────────────────────────────────────────────────────
function FormazioneHome({nav}){
  const items=[
    {id:"certificazioni",label:"Certificazioni AI",emoji:"🎓",color:"#6366F1"},
    {id:"workshop",label:"Workshop AI",emoji:"🧪",color:"#F59E0B"},
    {id:"practical",label:"Practical AI",emoji:"⚡",color:"#22C55E"},
    {id:"news",label:"News",emoji:"📰",color:"#06B6D4"},
    {id:"gamification",label:"Gamification",emoji:"🎮",color:"#EC4899"},
  ];
  return(
    <div className="fade-in">
      <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"28px",fontWeight:700,marginBottom:"32px"}}>Formazione AI</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"20px"}}>
        {items.map((it,i)=>(
          <div key={it.id} className="card-hover fade-in" onClick={()=>nav("formazione",it.id)} style={{animationDelay:`${i*80}ms`,background:"rgba(30,41,59,.6)",border:"1px solid rgba(99,102,241,.12)",borderRadius:"14px",padding:"28px",cursor:"pointer",borderLeft:`4px solid ${it.color}`}}>
            <span style={{fontSize:"28px"}}>{it.emoji}</span>
            <h3 style={{fontFamily:"'Space Mono',monospace",fontSize:"16px",marginTop:"12px"}}>{it.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EDITABLE TABLE ─────────────────────────────────────────────────
function ETable({columns,data,setData,addRow}){
  const upd=(id,f,v)=>setData(p=>p.map(r=>r.id===id?{...r,[f]:v}:r));
  const del=id=>setData(p=>p.filter(r=>r.id!==id));
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,fontSize:"13px"}}>
        <thead><tr>{columns.map(c=>(
          <th key={c.key} style={{padding:"10px 14px",textAlign:"left",background:"rgba(99,102,241,.1)",color:"#A5B4FC",fontWeight:600,fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",borderBottom:"1px solid rgba(99,102,241,.2)",whiteSpace:"nowrap"}}>{c.label}</th>
        ))}<th style={{width:"36px",background:"rgba(99,102,241,.1)",borderBottom:"1px solid rgba(99,102,241,.2)"}}/></tr></thead>
        <tbody>{data.map(row=>(
          <tr key={row.id}>
            {columns.map(c=>(
              <td key={c.key} style={{padding:"5px 8px",verticalAlign:"top"}}>
                {c.type==="textarea"?<textarea value={row[c.key]||""} onChange={e=>upd(row.id,c.key,e.target.value)} rows={2} className="idk" style={{minWidth:c.mw||"100px",resize:"vertical"}}/>
                :<input value={row[c.key]||""} onChange={e=>upd(row.id,c.key,e.target.value)} className="idk" style={{minWidth:c.mw||"80px"}}/>}
              </td>
            ))}
            <td style={{padding:"5px 4px",verticalAlign:"top"}}><button onClick={()=>del(row.id)} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",padding:"8px",opacity:.5}}><Icons.Trash/></button></td>
          </tr>
        ))}</tbody>
      </table>
      <button className="btn" onClick={addRow} style={{marginTop:"12px"}}><Icons.Plus/> Aggiungi riga</button>
    </div>
  );
}

function Certificazioni({data,setData}){
  return(<div className="fade-in">
    <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700,marginBottom:"12px"}}>🎓 Certificazioni AI</h1>
    <p style={{color:"#94A3B8",fontSize:"14px",lineHeight:"1.7",marginBottom:"28px",maxWidth:"800px"}}>Il team prenderà parte alle certificazioni AI offerte da Google, proposte in base al livello e al ruolo. Costo sostenuto da ARAD. Ognuno procederà in autonomia.</p>
    <ETable columns={[{key:"name",label:"Certificazione",mw:"180px"},{key:"provider",label:"Provider",mw:"80px"},{key:"description",label:"Descrizione",type:"textarea",mw:"220px"},{key:"level",label:"Livello",mw:"90px"},{key:"members",label:"Partecipanti",type:"textarea",mw:"150px"}]}
      data={data} setData={setData} addRow={()=>setData(p=>[...p,{id:`c${Date.now()}`,name:"",provider:"",description:"",level:"",members:""}])}/>
  </div>);
}
function WorkshopAI({data,setData}){
  return(<div className="fade-in">
    <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700,marginBottom:"12px"}}>🧪 Workshop AI</h1>
    <p style={{color:"#94A3B8",fontSize:"14px",lineHeight:"1.7",marginBottom:"28px",maxWidth:"800px"}}>Sessioni di un'ora e mezza ogni sei settimane, condotte da referenti interni, per deep dive su argomenti specifici.</p>
    <ETable columns={[{key:"date",label:"Data",mw:"100px"},{key:"topic",label:"Argomento",mw:"200px"},{key:"leader",label:"Leader",mw:"120px"},{key:"notes",label:"Notes",type:"textarea",mw:"200px"}]}
      data={data} setData={setData} addRow={()=>setData(p=>[...p,{id:`w${Date.now()}`,date:"",topic:"",leader:"",notes:""}])}/>
  </div>);
}
function PracticalAI({data,setData}){
  return(<div className="fade-in">
    <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700,marginBottom:"12px"}}>⚡ Practical AI</h1>
    <p style={{color:"#94A3B8",fontSize:"14px",lineHeight:"1.7",marginBottom:"28px",maxWidth:"800px"}}>Sessioni di 30-45 minuti settimanali. Focus: mostrare una best practice AI e testarla rapidamente insieme.</p>
    <ETable columns={[{key:"date",label:"Data",mw:"80px"},{key:"topic",label:"Argomento",mw:"200px"},{key:"referente",label:"Referente",mw:"120px"},{key:"theory",label:"Teoria",type:"textarea",mw:"160px"},{key:"practice",label:"Pratica",type:"textarea",mw:"160px"}]}
      data={data} setData={setData} addRow={()=>setData(p=>[...p,{id:`p${Date.now()}`,date:"",topic:"",referente:"",theory:"",practice:""}])}/>
  </div>);
}
function Placeholder({title,text,c}){
  return(<div className="fade-in">
    <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700,marginBottom:"12px"}}>{title}</h1>
    <div style={{background:"rgba(30,41,59,.5)",border:`1px dashed rgba(${c==="EC4899"?"236,72,153":"6,182,212"},.25)`,borderRadius:"14px",padding:"48px",textAlign:"center"}}>
      <p style={{color:"#94A3B8",fontSize:"15px",lineHeight:"1.7",maxWidth:"600px",margin:"0 auto"}}>{text}</p>
      <p style={{color:"#475569",fontSize:"13px",marginTop:"20px",fontStyle:"italic"}}>Sezione in arrivo...</p>
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
// R&D HOME — landing with Kanban + Tabella Idee
// ═══════════════════════════════════════════════════════════════════
function RDHome({nav}){
  const items=[
    {id:"kanban",label:"Kanban",desc:"Board per il tracking visuale di tutte le idee R&D con post-it draggabili.",icon:<Icons.Board/>,color:"#6366F1"},
    {id:"tabella",label:"Tabella Idee",desc:"Vista Excel-like di tutte le idee con dettagli, punto di partenza e arrivo.",icon:<Icons.Table/>,color:"#06B6D4"},
  ];
  return(
    <div className="fade-in">
      <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"28px",fontWeight:700,marginBottom:"32px"}}>R&D</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"20px"}}>
        {items.map((it,i)=>(
          <div key={it.id} className="card-hover fade-in" onClick={()=>nav("rd",it.id)} style={{animationDelay:`${i*80}ms`,background:"rgba(30,41,59,.6)",border:"1px solid rgba(99,102,241,.12)",borderRadius:"14px",padding:"32px",cursor:"pointer",borderLeft:`4px solid ${it.color}`}}>
            <div style={{color:it.color,marginBottom:"12px"}}>{it.icon}</div>
            <h3 style={{fontFamily:"'Space Mono',monospace",fontSize:"18px",marginBottom:"8px"}}>{it.label}</h3>
            <p style={{color:"#94A3B8",fontSize:"13px",lineHeight:"1.6"}}>{it.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// "NUOVA IDEA" — shared modal component
// ═══════════════════════════════════════════════════════════════════
function NuovaIdeaModal({streams,ideas,onAdd,onClose}){
  const [name,setName]=useState("");
  const [numId,setNumId]=useState("");
  const [desc,setDesc]=useState("");
  const [tIdx,setTIdx]=useState(0);
  const [col,setCol]=useState("backlog");
  const [partenza,setPartenza]=useState("");
  const [arrivo,setArrivo]=useState("");
  const [err,setErr]=useState("");

  const targets=streams.flatMap(s=>[
    ...(s.substreams.length===0?[{stId:s.id,ssId:null,label:s.name}]:[]),
    ...s.substreams.map(ss=>({stId:s.id,ssId:ss.id,label:`${s.name} → ${ss.name}`})),
  ]);

  const submit=()=>{
    if(!name.trim()){setErr("Inserisci un nome");return;}
    const nid=parseInt(numId);
    if(isNaN(nid)||nid<1){setErr("ID deve essere un numero positivo");return;}
    if(ideas.some(i=>i.ideaId===nid)){setErr(`ID ${nid} già in uso`);return;}
    if(!targets.length){setErr("Nessun stream disponibile");return;}
    const t=targets[tIdx];
    onAdd({
      id:`n${Date.now()}`, ideaId:nid, text:name.trim(),
      description:desc.trim(), streamId:t.stId, substreamId:t.ssId,
      col, partenza:partenza.trim(), arrivo:arrivo.trim(),
    });
    onClose();
  };

  const L=({children})=><label style={{fontSize:"11px",color:"#64748B",textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>{children}</label>;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",overflowY:"auto"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#1E293B",borderRadius:"16px",padding:"28px",maxWidth:"520px",width:"100%",border:"1px solid rgba(99,102,241,.2)",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h3 style={{fontFamily:"'Space Mono',monospace",fontSize:"16px"}}>💡 Nuova Idea</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer"}}><Icons.X/></button>
        </div>

        {err&&<div style={{background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.3)",borderRadius:"8px",padding:"8px 12px",marginBottom:"12px",fontSize:"12px",color:"#F87171"}}>{err}</div>}

        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 100px",gap:"12px"}}>
            <div><L>Nome idea</L><input value={name} onChange={e=>setName(e.target.value)} className="idk" placeholder="Es. Contract Drafter"/></div>
            <div><L>ID (numerico)</L><input value={numId} onChange={e=>setNumId(e.target.value.replace(/[^0-9]/g,""))} className="idk" placeholder="Es. 7"/></div>
          </div>
          <div><L>Descrizione breve (max 10 parole)</L><input value={desc} onChange={e=>setDesc(e.target.value)} className="idk" placeholder="Es. Skill Claude per creazione contratti"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            <div><L>Destinazione (Stream → Substream)</L>
              <select value={tIdx} onChange={e=>setTIdx(Number(e.target.value))} className="idk">
                {targets.map((t,i)=><option key={i} value={i}>{t.label}</option>)}
              </select>
            </div>
            <div><L>Colonna Kanban</L>
              <select value={col} onChange={e=>setCol(e.target.value)} className="idk">
                {KCOLS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div><L>Punto di partenza (AS IS)</L><textarea value={partenza} onChange={e=>setPartenza(e.target.value)} className="idk" rows={2} style={{resize:"vertical"}} placeholder="Da dove si inizia..."/></div>
          <div><L>Punto d'arrivo (TO BE — done quando?)</L><textarea value={arrivo} onChange={e=>setArrivo(e.target.value)} className="idk" rows={2} style={{resize:"vertical"}} placeholder="L'idea è completata quando..."/></div>
        </div>

        <div style={{display:"flex",gap:"8px",justifyContent:"flex-end",marginTop:"20px"}}>
          <button className="btn" onClick={onClose}>Annulla</button>
          <button onClick={submit} style={{background:"#6366F1",border:"none",borderRadius:"8px",padding:"8px 20px",color:"white",cursor:"pointer",fontWeight:600,fontSize:"13px"}}>Aggiungi</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// KANBAN
// ═══════════════════════════════════════════════════════════════════
function Kanban({streams,setStreams,ideas,setIdeas}){
  const [dragId,setDragId]=useState(null);
  const [collapsed,setCollapsed]=useState({});
  const [modal,setModal]=useState(null); // "idea" | {type:"stream"} | {type:"sub",streamId} | {type:"editIdea",idea}

  // Stream / sub CRUD
  const addStream=(name,leader)=>{setStreams(p=>[...p,{id:`s${Date.now()}`,name,leader,substreams:[]}]);setModal(null);};
  const delStream=sid=>{setStreams(p=>p.filter(s=>s.id!==sid));setIdeas(p=>p.filter(n=>n.streamId!==sid));};
  const addSub=(sid,name,leader)=>{
    setStreams(p=>p.map(s=>s.id===sid?{...s,substreams:[...s.substreams,{id:`ss${Date.now()}`,name,leader:leader||"[NOME]"}]}:s));
    setModal(null);
  };
  const delSub=(sid,ssid)=>{
    setStreams(p=>p.map(s=>s.id===sid?{...s,substreams:s.substreams.filter(x=>x.id!==ssid)}:s));
    setIdeas(p=>p.filter(n=>n.substreamId!==ssid));
  };
  const updateSubLeader=(sid,ssid,val)=>{
    setStreams(p=>p.map(s=>s.id===sid?{...s,substreams:s.substreams.map(x=>x.id===ssid?{...x,leader:val}:x)}:s));
  };

  // Idea CRUD
  const addIdea=idea=>{setIdeas(p=>[...p,idea]);};
  const delIdea=id=>setIdeas(p=>p.filter(n=>n.id!==id));
  const editIdea=(id,text)=>{setIdeas(p=>p.map(n=>n.id===id?{...n,text}:n));setModal(null);};

  // Drag
  const onDS=(e,id)=>{setDragId(id);e.dataTransfer.effectAllowed="move";};
  const onDO=e=>{e.preventDefault();e.dataTransfer.dropEffect="move";};
  const onDR=(e,col,stId,ssId)=>{e.preventDefault();if(!dragId)return;setIdeas(p=>p.map(n=>n.id===dragId?{...n,col,streamId:stId,substreamId:ssId}:n));setDragId(null);};

  const toggle=id=>setCollapsed(p=>({...p,[id]:!p[id]}));

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px",flexWrap:"wrap"}}>
        <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700}}>Kanban</h1>
        <button className="btn" onClick={()=>setModal("idea")}><Icons.Plus/> Nuova Idea</button>
        <button className="btn" onClick={()=>setModal({type:"stream"})}><Icons.Plus/> Stream</button>
      </div>

      {/* Nuova Idea modal */}
      {modal==="idea"&&<NuovaIdeaModal streams={streams} ideas={ideas} onAdd={addIdea} onClose={()=>setModal(null)}/>}
      {/* Stream modal */}
      {modal?.type==="stream"&&<SmallModal title="Nuovo Stream" fields={[{key:"name",label:"Nome Stream"},{key:"leader",label:"Leader"}]} onSubmit={v=>addStream(v.name,v.leader)} onClose={()=>setModal(null)}/>}
      {/* Sub modal */}
      {modal?.type==="sub"&&<SmallModal title="Nuovo Substream" fields={[{key:"name",label:"Nome Substream"},{key:"leader",label:"Leader"}]} onSubmit={v=>addSub(modal.streamId,v.name,v.leader)} onClose={()=>setModal(null)}/>}
      {/* Edit idea name modal */}
      {modal?.type==="editIdea"&&<SmallModal title="Modifica Idea" fields={[{key:"text",label:"Nome",initial:modal.idea.text}]} onSubmit={v=>editIdea(modal.idea.id,v.text)} onClose={()=>setModal(null)}/>}

      <div style={{overflowX:"auto",paddingBottom:"12px"}}>
        <div style={{minWidth:"1200px"}}>
          {/* Headers */}
          <div style={{display:"grid",gridTemplateColumns:"260px repeat(6,1fr)",gap:"3px",marginBottom:"3px"}}>
            <div style={{padding:"10px 14px",fontWeight:700,fontSize:"11px",color:"#64748B",textTransform:"uppercase",letterSpacing:"1.5px"}}>Stream / Substream</div>
            {KCOLS.map(c=>(
              <div key={c.id} style={{padding:"8px 6px",textAlign:"center",fontWeight:700,fontSize:"10px",color:c.color,textTransform:"uppercase",letterSpacing:"1px",borderBottom:`3px solid ${c.color}`,background:c.bg,borderRadius:"8px 8px 0 0"}}>{c.label}</div>
            ))}
          </div>

          {streams.map(st=>{
            const isC=collapsed[st.id];
            const hasSS=st.substreams.length>0;
            const directIdeas=ideas.filter(n=>n.streamId===st.id&&!n.substreamId);
            return(
              <div key={st.id} style={{marginBottom:"6px"}}>
                {/* STREAM ROW */}
                <div style={{display:"grid",gridTemplateColumns:"260px repeat(6,1fr)",gap:"3px"}}>
                  <div style={{padding:"10px 12px",background:"rgba(99,102,241,.08)",borderRadius:"8px",borderLeft:"4px solid #6366F1",display:"flex",alignItems:"center",gap:"6px"}}>
                    {hasSS&&<button onClick={()=>toggle(st.id)} style={{background:"none",border:"none",color:"#A5B4FC",cursor:"pointer",padding:"2px",display:"flex"}}>{isC?<Icons.ChevronRight/>:<Icons.ChevronDown/>}</button>}
                    {!hasSS&&<div style={{width:"18px"}}/>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:"13px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{st.name}</div>
                      <div style={{fontSize:"11px",color:"#A5B4FC"}}>{st.leader}</div>
                    </div>
                    <div style={{display:"flex",gap:"2px",flexShrink:0}}>
                      <button className="btn btn-sm" style={{padding:"3px 6px",fontSize:"10px"}} onClick={()=>setModal({type:"sub",streamId:st.id})} title="Aggiungi substream"><Icons.Plus/></button>
                      <button style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",padding:"3px",opacity:.3}} onClick={()=>delStream(st.id)}><Icons.Trash/></button>
                    </div>
                  </div>
                  {!hasSS&&KCOLS.map(col=>(
                    <KCell key={col.id} col={col} items={directIdeas.filter(n=>n.col===col.id)}
                      onDrop={e=>onDR(e,col.id,st.id,null)} onDragOver={onDO} onDragStart={onDS}
                      onDel={delIdea} onEdit={(id,t)=>setModal({type:"editIdea",idea:{id,text:t}})} dragId={dragId}/>
                  ))}
                  {hasSS&&KCOLS.map(col=><div key={col.id} style={{background:"rgba(99,102,241,.03)",borderRadius:"4px",minHeight:"12px"}}/>)}
                </div>

                {/* SUBSTREAM ROWS */}
                {hasSS&&!isC&&st.substreams.map(ss=>{
                  const ssIdeas=ideas.filter(n=>n.substreamId===ss.id);
                  return(
                    <div key={ss.id} style={{display:"grid",gridTemplateColumns:"260px repeat(6,1fr)",gap:"3px",marginTop:"2px"}}>
                      <div style={{padding:"8px 12px 8px 40px",background:"rgba(30,41,59,.4)",borderRadius:"6px",display:"flex",alignItems:"center",gap:"6px",borderLeft:"4px solid rgba(99,102,241,.25)"}}>
                        <span style={{fontSize:"10px",color:"#475569",lineHeight:1}}>└</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:"12px",fontWeight:600,color:"#CBD5E1",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ss.name}</div>
                          <input value={ss.leader} onChange={e=>updateSubLeader(st.id,ss.id,e.target.value)}
                            style={{background:"transparent",border:"none",borderBottom:"1px dashed rgba(99,102,241,.2)",color:"#A5B4FC",fontSize:"10px",padding:"1px 0",width:"90px",outline:"none"}}
                            placeholder="[NOME]"/>
                        </div>
                        <button style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",padding:"2px",opacity:.3,flexShrink:0}} onClick={()=>delSub(st.id,ss.id)}><Icons.Trash/></button>
                      </div>
                      {KCOLS.map(col=>(
                        <KCell key={col.id} col={col} items={ssIdeas.filter(n=>n.col===col.id)}
                          onDrop={e=>onDR(e,col.id,st.id,ss.id)} onDragOver={onDO} onDragStart={onDS}
                          onDel={delIdea} onEdit={(id,t)=>setModal({type:"editIdea",idea:{id,text:t}})} dragId={dragId}/>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginTop:"12px",padding:"10px 16px",background:"rgba(30,41,59,.4)",borderRadius:"10px"}}>
        {KCOLS.map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"11px",color:"#94A3B8"}}>
            <div style={{width:"12px",height:"12px",borderRadius:"3px",background:c.color}}/>{c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KANBAN CELL ────────────────────────────────────────────────────
function KCell({col,items,onDrop,onDragOver,onDragStart,onDel,onEdit,dragId}){
  const [over,setOver]=useState(false);
  return(
    <div onDragOver={onDragOver} onDrop={e=>{onDrop(e);setOver(false);}} onDragEnter={()=>setOver(true)} onDragLeave={()=>setOver(false)}
      style={{background:over?"rgba(99,102,241,.1)":"rgba(15,23,42,.25)",borderRadius:"6px",padding:"5px",minHeight:"44px",display:"flex",flexDirection:"column",gap:"4px",transition:"background .15s"}}>
      {items.map(p=>(
        <div key={p.id} className="postit" draggable onDragStart={e=>onDragStart(e,p.id)}
          style={{background:col.color,color:"#1E293B",padding:"7px 9px",borderRadius:"5px",fontSize:"11px",fontWeight:600,position:"relative",boxShadow:"2px 2px 8px rgba(0,0,0,.2)",lineHeight:"1.3",paddingRight:"38px",opacity:dragId===p.id?.4:1}}>
          {p.text}
          <div style={{position:"absolute",top:"3px",right:"3px",display:"flex",gap:"1px"}}>
            <button onClick={e=>{e.stopPropagation();onEdit(p.id,p.text);}} style={{background:"rgba(0,0,0,.12)",border:"none",borderRadius:"3px",padding:"2px",cursor:"pointer",color:"#1E293B",lineHeight:0}}><Icons.Edit/></button>
            <button onClick={e=>{e.stopPropagation();onDel(p.id);}} style={{background:"rgba(0,0,0,.12)",border:"none",borderRadius:"3px",padding:"2px",cursor:"pointer",color:"#1E293B",lineHeight:0}}><Icons.Trash/></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SMALL MODAL (for stream/sub/edit) ──────────────────────────────
function SmallModal({title,fields,onSubmit,onClose}){
  const [vals,setVals]=useState(()=>{
    const o={};fields.forEach(f=>o[f.key]=f.initial||"");return o;
  });
  const go=()=>{if(fields.some(f=>f.key==="name"&&!vals.name?.trim()))return;onSubmit(vals);};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#1E293B",borderRadius:"16px",padding:"28px",maxWidth:"400px",width:"100%",border:"1px solid rgba(99,102,241,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h3 style={{fontFamily:"'Space Mono',monospace",fontSize:"16px"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#64748B",cursor:"pointer"}}><Icons.X/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {fields.map(f=>(
            <div key={f.key}>
              <label style={{fontSize:"11px",color:"#64748B",textTransform:"uppercase",letterSpacing:"1px",display:"block",marginBottom:"4px"}}>{f.label}</label>
              <input value={vals[f.key]} onChange={e=>setVals(p=>({...p,[f.key]:e.target.value}))} autoFocus={f===fields[0]} className="idk" onKeyDown={e=>e.key==="Enter"&&go()}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px",justifyContent:"flex-end",marginTop:"20px"}}>
          <button className="btn" onClick={onClose}>Annulla</button>
          <button onClick={go} style={{background:"#6366F1",border:"none",borderRadius:"8px",padding:"8px 20px",color:"white",cursor:"pointer",fontWeight:600,fontSize:"13px"}}>Aggiungi</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TABELLA IDEE
// ═══════════════════════════════════════════════════════════════════
function TabellaIdee({streams,ideas,setIdeas}){
  const [modal,setModal]=useState(false);
  const [editId,setEditId]=useState(null);

  const addIdea=idea=>{setIdeas(p=>[...p,idea]);};
  const upd=(id,f,v)=>setIdeas(p=>p.map(r=>r.id===id?{...r,[f]:v}:r));
  const del=id=>{setIdeas(p=>p.filter(r=>r.id!==id));if(editId===id)setEditId(null);};

  // Resolve stream/substream names
  const getStreamName=sid=>streams.find(s=>s.id===sid)?.name||"—";
  const getSubName=(sid,ssid)=>{
    if(!ssid)return "—";
    const st=streams.find(s=>s.id===sid);
    return st?.substreams.find(ss=>ss.id===ssid)?.name||"—";
  };
  const colLabel=cid=>KCOLS.find(c=>c.id===cid)?.label||cid;
  const colColor=cid=>KCOLS.find(c=>c.id===cid)?.color||"#94A3B8";

  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px",flexWrap:"wrap"}}>
        <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700}}>Tabella Idee</h1>
        <button className="btn" onClick={()=>setModal(true)}><Icons.Plus/> Nuova Idea</button>
      </div>

      {modal&&<NuovaIdeaModal streams={streams} ideas={ideas} onAdd={addIdea} onClose={()=>setModal(false)}/>}

      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 3px",fontSize:"13px"}}>
          <thead><tr>
            {["ID","Nome","Stream","Substream","Descrizione","Punto di Partenza","Punto d'Arrivo","Kanban"].map(h=>(
              <th key={h} style={{padding:"10px 12px",textAlign:"left",color:"#A5B4FC",fontWeight:600,fontSize:"10px",textTransform:"uppercase",letterSpacing:"1px",whiteSpace:"nowrap",borderBottom:"1px solid rgba(99,102,241,.15)"}}>{h}</th>
            ))}
            <th style={{width:"60px",borderBottom:"1px solid rgba(99,102,241,.15)"}}/>
          </tr></thead>
          <tbody>
            {ideas.map(r=>{
              const isEdit=editId===r.id;
              return(
                <tr key={r.id} className="trow" style={{background:isEdit?"rgba(99,102,241,.06)":"rgba(30,41,59,.25)",cursor:"pointer"}} onClick={()=>setEditId(isEdit?null:r.id)}>
                  <td style={{padding:"10px 12px",fontFamily:"'Space Mono',monospace",fontWeight:700,color:"#6366F1",borderRadius:"8px 0 0 8px",whiteSpace:"nowrap"}}>{r.ideaId}</td>
                  <td style={{padding:"10px 12px",fontWeight:600,whiteSpace:"nowrap",maxWidth:"180px",overflow:"hidden",textOverflow:"ellipsis"}}>{r.text}</td>
                  <td style={{padding:"10px 12px",fontSize:"12px",color:"#94A3B8"}}>{getStreamName(r.streamId)}</td>
                  <td style={{padding:"10px 12px",fontSize:"12px",color:"#94A3B8"}}>{getSubName(r.streamId,r.substreamId)}</td>
                  <td style={{padding:"10px 12px",maxWidth:"200px"}}>
                    {isEdit?<textarea value={r.description||""} onChange={e=>{e.stopPropagation();upd(r.id,"description",e.target.value);}} onClick={e=>e.stopPropagation()} className="idk" rows={2} style={{resize:"vertical",minWidth:"180px"}}/>
                    :<span style={{fontSize:"12px",color:"#CBD5E1"}}>{r.description||<span style={{color:"#475569",fontStyle:"italic"}}>—</span>}</span>}
                  </td>
                  <td style={{padding:"10px 12px",maxWidth:"200px"}}>
                    {isEdit?<textarea value={r.partenza||""} onChange={e=>{e.stopPropagation();upd(r.id,"partenza",e.target.value);}} onClick={e=>e.stopPropagation()} className="idk" rows={2} style={{resize:"vertical",minWidth:"180px"}}/>
                    :<span style={{fontSize:"12px",color:"#CBD5E1"}}>{r.partenza||<span style={{color:"#475569",fontStyle:"italic"}}>—</span>}</span>}
                  </td>
                  <td style={{padding:"10px 12px",maxWidth:"200px"}}>
                    {isEdit?<textarea value={r.arrivo||""} onChange={e=>{e.stopPropagation();upd(r.id,"arrivo",e.target.value);}} onClick={e=>e.stopPropagation()} className="idk" rows={2} style={{resize:"vertical",minWidth:"180px"}}/>
                    :<span style={{fontSize:"12px",color:"#CBD5E1"}}>{r.arrivo||<span style={{color:"#475569",fontStyle:"italic"}}>—</span>}</span>}
                  </td>
                  <td style={{padding:"10px 12px"}}>
                    {isEdit?<select value={r.col} onChange={e=>{e.stopPropagation();upd(r.id,"col",e.target.value);}} onClick={e=>e.stopPropagation()} className="idk" style={{width:"140px"}}>
                      {KCOLS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    :<span style={{fontSize:"11px",fontWeight:600,padding:"3px 10px",borderRadius:"5px",background:`${colColor(r.col)}22`,color:colColor(r.col)}}>{colLabel(r.col)}</span>}
                  </td>
                  <td style={{padding:"10px 8px",borderRadius:"0 8px 8px 0"}}>
                    <button onClick={e=>{e.stopPropagation();del(r.id);}} style={{background:"none",border:"none",color:"#EF4444",cursor:"pointer",opacity:.4,padding:"4px"}}><Icons.Trash/></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {ideas.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#475569",fontStyle:"italic"}}>Nessuna idea ancora. Clicca "Nuova Idea" per iniziare.</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AI OFFERING
// ═══════════════════════════════════════════════════════════════════
function AIOffering({data,setData}){
  const [expId,setExpId]=useState(null);
  const [view,setView]=useState("table");
  const upd=(id,f,v)=>setData(p=>p.map(r=>r.id===id?{...r,[f]:v}:r));
  const md=data.map(d=>({id:d.id,title:d.title,stream:d.stream,x:10-d.sforzo,y:d.appetibilita,noteAM:d.noteAM}));
  const sc={"Change Management / Formazione AI":"#F59E0B","Ways of Working":"#6366F1","Agentic-Commerce":"#22C55E"};
  return(
    <div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",flexWrap:"wrap"}}>
        <h1 style={{fontFamily:"'Space Mono',monospace",fontSize:"24px",fontWeight:700}}>AI Offering Decision Sheet</h1>
        <div style={{display:"flex",gap:"4px",background:"rgba(30,41,59,.6)",borderRadius:"8px",padding:"3px"}}>
          <button onClick={()=>setView("table")} style={{background:view==="table"?"#6366F1":"transparent",border:"none",borderRadius:"6px",padding:"6px 14px",color:view==="table"?"white":"#94A3B8",cursor:"pointer",fontSize:"12px",fontWeight:600}}>Tabella</button>
          <button onClick={()=>setView("matrix")} style={{background:view==="matrix"?"#6366F1":"transparent",border:"none",borderRadius:"6px",padding:"6px 14px",color:view==="matrix"?"white":"#94A3B8",cursor:"pointer",fontSize:"12px",fontWeight:600}}>Matrice</button>
        </div>
      </div>
      {view==="table"?<OfferTable data={data} expId={expId} setExpId={setExpId} upd={upd} sc={sc}/>:<DMatrix data={md} sc={sc}/>}
    </div>
  );
}

function OfferTable({data,expId,setExpId,upd,sc}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"0 4px",fontSize:"13px"}}>
        <thead><tr>{["Stream","Titolo","Sforzo","Appetibilità","Score","Note AM"].map(h=>(
          <th key={h} style={{padding:"10px 14px",textAlign:"left",color:"#A5B4FC",fontWeight:600,fontSize:"11px",textTransform:"uppercase",letterSpacing:"1px",whiteSpace:"nowrap"}}>{h}</th>
        ))}</tr></thead>
        <tbody>{data.map(r=>{
          const score=((10-r.sforzo)+r.appetibilita).toFixed(1);
          const isE=expId===r.id;const c=sc[r.stream]||"#6366F1";
          return[
            <tr key={r.id} onClick={()=>setExpId(isE?null:r.id)} style={{cursor:"pointer",background:isE?"rgba(99,102,241,.08)":"rgba(30,41,59,.3)"}}>
              <td style={{padding:"12px 14px",borderLeft:`3px solid ${c}`,borderRadius:"8px 0 0 8px"}}><span style={{fontSize:"11px",background:`${c}22`,color:c,padding:"3px 10px",borderRadius:"4px",fontWeight:600}}>{r.stream}</span></td>
              <td style={{padding:"12px 14px",fontWeight:600,maxWidth:"300px"}}>{r.title}</td>
              <td style={{padding:"12px 14px"}}><span style={{background:r.sforzo>7?"rgba(239,68,68,.2)":r.sforzo>5?"rgba(251,191,36,.2)":"rgba(34,197,94,.2)",color:r.sforzo>7?"#F87171":r.sforzo>5?"#FBBF24":"#4ADE80",padding:"4px 10px",borderRadius:"6px",fontWeight:700}}>{r.sforzo}</span></td>
              <td style={{padding:"12px 14px"}}><span style={{background:r.appetibilita>=8?"rgba(34,197,94,.2)":r.appetibilita>=6?"rgba(251,191,36,.2)":"rgba(239,68,68,.2)",color:r.appetibilita>=8?"#4ADE80":r.appetibilita>=6?"#FBBF24":"#F87171",padding:"4px 10px",borderRadius:"6px",fontWeight:700}}>{r.appetibilita}</span></td>
              <td style={{padding:"12px 14px"}}><span style={{fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:"15px",color:parseFloat(score)>=12?"#4ADE80":parseFloat(score)>=9?"#FBBF24":"#F87171"}}>{score}</span></td>
              <td style={{padding:"12px 14px",borderRadius:"0 8px 8px 0"}}><textarea value={r.noteAM||""} onChange={e=>{e.stopPropagation();upd(r.id,"noteAM",e.target.value);}} onClick={e=>e.stopPropagation()} rows={1} className="idk" style={{minWidth:"180px",resize:"vertical"}}/></td>
            </tr>,
            isE&&<tr key={`${r.id}-d`}><td colSpan={6} style={{padding:"0 14px 16px 14px"}}>
              <div style={{background:"rgba(15,23,42,.5)",borderRadius:"10px",padding:"20px",marginTop:"4px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
                <div><label style={{fontSize:"10px",color:"#6366F1",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Descrizione</label><textarea value={r.description} onChange={e=>upd(r.id,"description",e.target.value)} rows={4} className="idk" style={{marginTop:"6px",resize:"vertical"}}/></div>
                <div><label style={{fontSize:"10px",color:"#6366F1",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Value Proposition</label><textarea value={r.valueProp} onChange={e=>upd(r.id,"valueProp",e.target.value)} rows={4} className="idk" style={{marginTop:"6px",resize:"vertical"}}/></div>
                <div style={{gridColumn:"1/-1",display:"flex",gap:"16px"}}>
                  <div><label style={{fontSize:"10px",color:"#6366F1",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Sforzo (1-10)</label><input type="number" min="0" max="10" step="0.1" value={r.sforzo} onChange={e=>upd(r.id,"sforzo",parseFloat(e.target.value)||0)} className="idk" style={{width:"100px",marginTop:"6px"}}/></div>
                  <div><label style={{fontSize:"10px",color:"#6366F1",textTransform:"uppercase",letterSpacing:"1px",fontWeight:600}}>Appetibilità (1-10)</label><input type="number" min="0" max="10" step="0.1" value={r.appetibilita} onChange={e=>upd(r.id,"appetibilita",parseFloat(e.target.value)||0)} className="idk" style={{width:"100px",marginTop:"6px"}}/></div>
                </div>
              </div>
            </td></tr>
          ];
        })}</tbody>
      </table>
    </div>
  );
}

// ─── DECISION MATRIX ────────────────────────────────────────────────
function DMatrix({data,sc}){
  const [hov,setHov]=useState(null);
  const W=700,H=500,P=60;
  const tX=v=>P+(v/10)*(W-P*2);
  const tY=v=>H-P-(v/10)*(H-P*2);
  return(
    <div style={{background:"rgba(30,41,59,.4)",borderRadius:"16px",padding:"24px",overflow:"hidden"}}>
      <div style={{display:"flex",gap:"16px",marginBottom:"16px",flexWrap:"wrap"}}>
        {Object.entries(sc).map(([n,c])=><div key={n} style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"12px",color:"#94A3B8"}}><div style={{width:"10px",height:"10px",borderRadius:"50%",background:c}}/>{n}</div>)}
      </div>
      <div style={{overflowX:"auto"}}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:"700px",height:"auto"}}>
          <rect x={tX(5)} y={tY(10)} width={tX(10)-tX(5)} height={tY(5)-tY(10)} fill="rgba(34,197,94,.06)"/>
          <rect x={tX(0)} y={tY(10)} width={tX(5)-tX(0)} height={tY(5)-tY(10)} fill="rgba(251,191,36,.06)"/>
          <rect x={tX(5)} y={tY(5)} width={tX(10)-tX(5)} height={tY(0)-tY(5)} fill="rgba(251,191,36,.04)"/>
          <rect x={tX(0)} y={tY(5)} width={tX(5)-tX(0)} height={tY(0)-tY(5)} fill="rgba(239,68,68,.04)"/>
          <text x={tX(7.5)} y={tY(9.3)} fill="#4ADE80" fontSize="11" textAnchor="middle" opacity=".6" fontWeight="700">🎯 GO</text>
          <text x={tX(2.5)} y={tY(9.3)} fill="#FBBF24" fontSize="11" textAnchor="middle" opacity=".6" fontWeight="700">⚠️ VALUTA</text>
          <text x={tX(7.5)} y={tY(.8)} fill="#94A3B8" fontSize="10" textAnchor="middle" opacity=".4">FACILE MA BASSA APP.</text>
          <text x={tX(2.5)} y={tY(.8)} fill="#F87171" fontSize="10" textAnchor="middle" opacity=".4">❌ SKIP</text>
          {[0,2,4,5,6,8,10].map(v=><g key={v}><line x1={tX(v)} y1={tY(0)} x2={tX(v)} y2={tY(10)} stroke="rgba(99,102,241,.08)"/><line x1={tX(0)} y1={tY(v)} x2={tX(10)} y2={tY(v)} stroke="rgba(99,102,241,.08)"/></g>)}
          <line x1={tX(0)} y1={tY(0)} x2={tX(10)} y2={tY(0)} stroke="#475569" strokeWidth="1.5"/>
          <line x1={tX(0)} y1={tY(0)} x2={tX(0)} y2={tY(10)} stroke="#475569" strokeWidth="1.5"/>
          <text x={tX(5)} y={H-8} fill="#94A3B8" fontSize="12" textAnchor="middle" fontWeight="600">Fattibilità (10 - Sforzo) →</text>
          <text x={12} y={tY(5)} fill="#94A3B8" fontSize="12" textAnchor="middle" fontWeight="600" transform={`rotate(-90,12,${tY(5)})`}>Appetibilità →</text>
          {[0,2,4,6,8,10].map(v=><g key={v}><text x={tX(v)} y={H-P+18} fill="#64748B" fontSize="10" textAnchor="middle">{v}</text><text x={P-10} y={tY(v)+4} fill="#64748B" fontSize="10" textAnchor="end">{v}</text></g>)}
          {data.map(d=>{const c=sc[d.stream]||"#6366F1";const h=hov===d.id;return(
            <g key={d.id} onMouseEnter={()=>setHov(d.id)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
              <circle cx={tX(d.x)} cy={tY(d.y)} r={h?10:7} fill={c} opacity={h?1:.75} stroke={h?"white":"none"} strokeWidth="2" style={{transition:"all .2s"}}/>
              {h&&<g><rect x={tX(d.x)+14} y={tY(d.y)-36} width={Math.min(d.title.length*6.5+20,260)} height="48" rx="6" fill="#1E293B" stroke="rgba(99,102,241,.3)"/>
                <text x={tX(d.x)+24} y={tY(d.y)-18} fill="#E2E8F0" fontSize="11" fontWeight="600">{d.title.length>38?d.title.slice(0,38)+"...":d.title}</text>
                <text x={tX(d.x)+24} y={tY(d.y)-3} fill="#94A3B8" fontSize="10">{d.noteAM}</text></g>}
            </g>
          );})}
        </svg>
      </div>
    </div>
  );
}
