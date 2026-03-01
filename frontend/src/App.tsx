import { useState, useEffect, useRef } from "react";
import { Dot, Tag } from "@/components/QuantumUI";
import { rnd, useInterval } from "@/lib/quantum-utils";
import Landing from "@/pages/Landing";
import TestPage from "@/pages/TestPage";
import CircuitLab from "@/pages/CircuitLab";

const PAGES = [
  { id: "home", label: "HOME" },
  { id: "console", label: "CONSOLE" },
  { id: "circuit", label: "CIRCUIT LAB" },
] as const;

type PageId = typeof PAGES[number]["id"];

function Nav({ page, setPage, stats }: { page: PageId; setPage: (p: PageId) => void; stats: number }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 58, borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(24px)", background: "rgba(7,7,10,.88)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", animation: "navIn .5s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F5D4" /><stop offset="100%" stopColor="#B9A7FF" />
          </linearGradient></defs>
          <polygon points="14,1 27,7.5 27,20.5 14,27 1,20.5 1,7.5" fill="none" stroke="url(#lg)" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="4" fill="url(#lg)" />
        </svg>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: ".08em", color: "#E6E8EE" }}>
          QUANTUM<span style={{ background: "linear-gradient(135deg,#00F5D4,#B9A7FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> WALL</span>
        </span>
        <Tag color="#00F5D4">v1.0</Tag>
      </div>

      <div style={{ display: "flex", gap: 4 }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)} style={{
            background: page === p.id ? "rgba(0,245,212,.1)" : "transparent",
            border: `1px solid ${page === p.id ? "rgba(0,245,212,.35)" : "transparent"}`,
            borderRadius: 8, padding: "5px 14px",
            color: page === p.id ? "#00F5D4" : "#88A3D6",
            fontSize: 9, letterSpacing: 2, cursor: "pointer",
            fontFamily: "'JetBrains Mono',monospace", transition: "all .2s",
          }}
            onMouseEnter={e => { if (page !== p.id) (e.currentTarget as HTMLButtonElement).style.color = "#E6E8EE"; }}
            onMouseLeave={e => { if (page !== p.id) (e.currentTarget as HTMLButtonElement).style.color = "#88A3D6"; }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot pulse /><span style={{ fontSize: 9, color: "#10b981", letterSpacing: 2 }}>IBM Q ONLINE</span>
        </div>
        <div style={{ width: 1, height: 16, background: "var(--border)" }} />
        <span style={{ fontSize: 9, color: "#88A3D6" }}>
          <span style={{ color: "#00F5D4" }}></span>
        </span>
      </div>
    </nav>
  );
}

export default function App() {
  const [page, setPage] = useState<PageId>("home");
  const [stats, setStats] = useState(58291);
  useInterval(() => setStats(s => s + Math.floor(rnd(0, 4))), 1200);

  return (
    <div style={{ background: "radial-gradient(circle at 50% 50%, #0f172a 0%, #07070a 100%)", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: .018, backgroundImage: "linear-gradient(rgba(0,245,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,1) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "-20%", left: "15%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,212,.03),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(185,167,255,.04),transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav page={page} setPage={setPage} stats={stats} />

        {page === "home" && (
          <div style={{ paddingTop: 58 }}>
            <LandingWrapper setPage={setPage} />
          </div>
        )}
        {page === "console" && <div style={{ paddingTop: 58 }}><TestPage /></div>}
        {page === "circuit" && <CircuitLab />}
      </div>
    </div>
  );
}

function LandingWrapper({ setPage }: { setPage: (p: PageId) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("button");
      if (target && target.textContent?.includes("Test Now")) {
        e.preventDefault();
        e.stopPropagation();
        setPage("console");
      }
    };
    el.addEventListener("click", handler, true);
    return () => el.removeEventListener("click", handler, true);
  }, [setPage]);

  return (
    <div ref={wrapRef}>
      <Landing />
    </div>
  );
}
