import { useState } from "react";
import { Btn, SectionLabel, Tag } from "@/components/QuantumUI";
import { rnd, hex, useInterval } from "@/lib/quantum-utils";

export default function CircuitLab() {
    const [inputText, setInputText] = useState("Hello World");
    const [activeGate, setActiveGate] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [step, setStep] = useState(0);
    const [results, setResults] = useState<{
        shots: number;
        counts: Record<string, number>;
        entropy: string;
        fidelity: string;
        depth: number;
        width: number;
        key_bits: string;
    } | null>(null);

    useInterval(() => { }, null);

    const nQ = Math.min(8, Math.max(2, Math.ceil(inputText.length / 2)));
    const gates = [
        { id: "h", label: "H", name: "Hadamard", color: "#3b82f6", desc: "Puts qubit into superposition — equal probability of |0⟩ and |1⟩." },
        { id: "cnot", label: "⊕", name: "CNOT", color: "#B9A7FF", desc: "Entangles two qubits. Target flips if control is |1⟩." },
        { id: "m", label: "M", name: "Measure", color: "#00F5D4", desc: "Collapses superposition. Wavefunction collapse produces the final bit." },
    ];

    const runCircuit = () => {
        setRunning(true); setStep(0); setResults(null);
        let s = 0;
        const iv = setInterval(() => {
            s++; setStep(s);
            if (s >= 3) {
                clearInterval(iv); setRunning(false);
                setResults({
                    shots: 1024,
                    counts: { "00": 258, "01": 247, "10": 252, "11": 267 },
                    entropy: (97 + Math.random() * 3).toFixed(3),
                    fidelity: (98.5 + Math.random() * 1.4).toFixed(2),
                    depth: 3,
                    width: nQ,
                    key_bits: hex(32),
                });
            }
        }, 900);
    };

    const colX = [80, 180, 280];
    const wireH = 48;
    const svgH = nQ * wireH + 40;

    return (
        <div
            style={{
                fontFamily: "'JetBrains Mono',monospace",
                padding: "calc(58px + 32px) 32px 60px",
                maxWidth: 1400,
                margin: "0 auto",
                animation: "pageIn .4s ease",
            }}
        >
            <div style={{ marginBottom: 36 }}>
                <SectionLabel>CIRCUIT LAB</SectionLabel>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 700, color: "#E6E8EE", marginBottom: 8 }}>
                    Qiskit Circuit Designer
                </h2>
                <p style={{ fontSize: 12, color: "#88A3D6", lineHeight: 1.7, maxWidth: 560 }}>
                    Enter any text and watch the Qiskit circuit auto-generate based on payload length. Each character pair requires one qubit. Run the circuit to simulate quantum key generation.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    <div className="card" style={{ padding: "22px 26px", display: "flex", gap: 14, alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 8, color: "#88A3D6", letterSpacing: 2.5, marginBottom: 8 }}>PAYLOAD INPUT</div>
                            <input
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                style={{ width: "100%", background: "rgba(0,0,0,.4)", border: "1px solid var(--border)", borderRadius: 9, padding: "10px 14px", color: "#E6E8EE", fontSize: 12, fontFamily: "'JetBrains Mono',monospace", outline: "none" }}
                                onFocus={e => { e.target.style.borderColor = "rgba(0,245,212,.4)"; }}
                                onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: "#00F5D4" }}>{nQ}</div>
                                <div style={{ fontSize: 8, color: "#88A3D6", letterSpacing: 2 }}>QUBITS</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: "#B9A7FF" }}>3</div>
                                <div style={{ fontSize: 8, color: "#88A3D6", letterSpacing: 2 }}>DEPTH</div>
                            </div>
                            <Btn onClick={runCircuit} disabled={running} style={{ padding: "10px 24px", marginTop: 20 }}>
                                {running ? "◉ RUNNING..." : "▶ RUN CIRCUIT"}
                            </Btn>
                        </div>
                    </div>

                    <div className="card" style={{ padding: "28px" }}>
                        <SectionLabel>LIVE QISKIT CIRCUIT · {nQ}Q / DEPTH 3</SectionLabel>
                        <div style={{ overflowX: "auto" }}>
                            <svg width="100%" viewBox={`0 0 380 ${svgH}`} style={{ fontFamily: "'JetBrains Mono',monospace", minWidth: 340 }}>
                                {Array.from({ length: nQ }, (_, i) => {
                                    const y = i * wireH + wireH / 2 + 20;
                                    const hActive = running && step >= 1;
                                    const cActive = running && step >= 2;
                                    const mActive = (running && step >= 3) || !!results;
                                    return (
                                        <g key={i}>
                                            <line x1={25} y1={y} x2={340} y2={y}
                                                stroke={hActive ? "rgba(0,245,212,.35)" : "rgba(136,163,214,.15)"}
                                                strokeWidth={hActive ? 1.5 : 1} style={{ transition: "stroke .3s" }} />
                                            <text x={20} y={y + 4} fontSize={8} fill="#88A3D6" textAnchor="end">q{i}|0⟩</text>

                                            <g onMouseEnter={() => setActiveGate("h")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                                <rect x={colX[0] - 16} y={y - 14} width={32} height={28} rx={5}
                                                    fill={hActive ? "rgba(59,130,246,.65)" : "rgba(59,130,246,.3)"}
                                                    stroke={activeGate === "h" ? "#93c5fd" : "#3b82f6"} strokeWidth={1.5}
                                                    style={{ filter: hActive || activeGate === "h" ? "drop-shadow(0 0 8px rgba(59,130,246,.8))" : "none", transition: "all .3s" }} />
                                                <text x={colX[0]} y={y + 5} fontSize={13} fontWeight="700" fill="white" textAnchor="middle">H</text>
                                            </g>

                                            {i % 2 === 0 && i + 1 < nQ && (
                                                <g onMouseEnter={() => setActiveGate("cnot")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                                    <line x1={colX[1]} y1={y} x2={colX[1]} y2={y + wireH}
                                                        stroke={cActive ? "rgba(185,167,255,.6)" : "rgba(185,167,255,.3)"}
                                                        strokeWidth={1.5} strokeDasharray="3,2" />
                                                    <circle cx={colX[1]} cy={y} r={6} fill={cActive ? "#B9A7FF" : "rgba(185,167,255,.5)"} style={{ filter: cActive ? "drop-shadow(0 0 7px #B9A7FF)" : "none" }} />
                                                    <circle cx={colX[1]} cy={y + wireH} r={10} fill="none"
                                                        stroke={cActive ? "#B9A7FF" : "rgba(185,167,255,.4)"} strokeWidth={1.5} />
                                                    <line x1={colX[1] - 10} y1={y + wireH} x2={colX[1] + 10} y2={y + wireH} stroke={cActive ? "#B9A7FF" : "rgba(185,167,255,.4)"} strokeWidth={1.5} />
                                                    <line x1={colX[1]} y1={y + wireH - 10} x2={colX[1]} y2={y + wireH + 10} stroke={cActive ? "#B9A7FF" : "rgba(185,167,255,.4)"} strokeWidth={1.5} />
                                                </g>
                                            )}

                                            <g onMouseEnter={() => setActiveGate("m")} onMouseLeave={() => setActiveGate(null)} style={{ cursor: "pointer" }}>
                                                <rect x={colX[2] - 16} y={y - 14} width={32} height={28} rx={5}
                                                    fill={mActive ? "rgba(0,245,212,.2)" : "rgba(20,20,35,.9)"}
                                                    stroke={mActive ? "#00F5D4" : "rgba(185,167,255,.3)"} strokeWidth={1.5}
                                                    style={{ filter: mActive || activeGate === "m" ? "drop-shadow(0 0 8px rgba(0,245,212,.7))" : "none", transition: "all .3s" }} />
                                                <path d={`M${colX[2] - 9} ${y + 6} A9 9 0 0 1 ${colX[2] + 9} ${y + 6}`}
                                                    stroke={mActive ? "#00F5D4" : "#88A3D6"} strokeWidth={1.5} fill="none" />
                                                <line x1={colX[2]} y1={y + 6} x2={colX[2] + 6} y2={y - 4}
                                                    stroke={mActive ? "#00F5D4" : "#88A3D6"} strokeWidth={1.5} />
                                            </g>

                                            {running && (
                                                <circle r={4} fill={step === 1 ? "#3b82f6" : step === 2 ? "#B9A7FF" : "#00F5D4"}
                                                    style={{ filter: "drop-shadow(0 0 5px currentColor)" }}>
                                                    <animateMotion dur={`${step * .8}s`} fill="freeze" path={`M25,0 L${colX[Math.min(step, 2)]},0`} />
                                                </circle>
                                            )}
                                        </g>
                                    );
                                })}

                                {(["H-GATE SUPERPOSITION", "CNOT ENTANGLEMENT", "MEASURE COLLAPSE"] as const).map((lbl, i) => (
                                    <text key={lbl} x={colX[i]} y={12} fontSize={6.5} fill="rgba(136,163,214,.5)" textAnchor="middle" letterSpacing={1}>{lbl}</text>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {results && (
                        <div className="card ct" style={{ padding: "28px", animation: "fadeUp .5s ease" }}>
                            <SectionLabel>CIRCUIT EXECUTION RESULTS</SectionLabel>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                                {[
                                    { l: "SHOTS", v: results.shots.toLocaleString(), c: "#00F5D4" },
                                    { l: "ENTROPY SCORE", v: `${results.entropy}%`, c: "#B9A7FF" },
                                    { l: "FIDELITY", v: `${results.fidelity}%`, c: "#10b981" },
                                    { l: "CIRCUIT DEPTH", v: String(results.depth), c: "#E6E8EE" },
                                ].map(m => (
                                    <div key={m.l} style={{ textAlign: "center", padding: "16px", background: "rgba(0,0,0,.3)", borderRadius: 12, border: "1px solid var(--border)" }}>
                                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: m.c }}>{m.v}</div>
                                        <div style={{ fontSize: 7, color: "#88A3D6", letterSpacing: 2, marginTop: 5 }}>{m.l}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ fontSize: 9, color: "#88A3D6", letterSpacing: 2, marginBottom: 12 }}>MEASUREMENT HISTOGRAM (1024 shots)</div>
                            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 80 }}>
                                {Object.entries(results.counts).map(([k, v]) => (
                                    <div key={k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                                        <span style={{ fontSize: 9, color: "#00F5D4" }}>{v}</span>
                                        <div style={{ width: "100%", height: `${(v / 267) * 60}px`, background: "linear-gradient(180deg,#00F5D4,rgba(0,245,212,.3))", borderRadius: "4px 4px 0 0", boxShadow: "0 0 10px rgba(0,245,212,.3)", transition: "height .5s" }} />
                                        <span style={{ fontSize: 8, color: "#88A3D6" }}>{k}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <div style={{ fontSize: 8, color: "#88A3D6", letterSpacing: 2, marginBottom: 8 }}>GENERATED KEY BITS</div>
                                <div style={{ fontSize: 10, color: "#00F5D4", background: "rgba(0,0,0,.45)", border: "1px solid rgba(0,245,212,.15)", borderRadius: 10, padding: "12px 16px", wordBreak: "break-all", lineHeight: 1.7 }}>
                                    {results.key_bits}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div className="card" style={{ padding: "26px" }}>
                        <SectionLabel>GATE REFERENCE</SectionLabel>
                        {gates.map(g => (
                            <div key={g.id} style={{
                                padding: "14px 16px", borderRadius: 10, marginBottom: 12,
                                background: activeGate === g.id ? `${g.color}14` : "rgba(0,0,0,.25)",
                                border: `1px solid ${activeGate === g.id ? `${g.color}44` : "var(--border)"}`,
                                transition: "all .2s",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 6, background: `${g.color}22`, border: `1px solid ${g.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: g.color }}>{g.label}</div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: "#E6E8EE" }}>{g.name}</div>
                                        <div style={{ fontSize: 8, color: g.color, letterSpacing: 1.5, marginTop: 2 }}>QUANTUM GATE</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 11, color: "#88A3D6", lineHeight: 1.7 }}>{g.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ padding: "26px" }}>
                        <SectionLabel>EXECUTION PIPELINE</SectionLabel>
                        {[
                            { s: 1, label: "Apply Hadamard", sub: "Create superposition on all qubits", color: "#3b82f6" },
                            { s: 2, label: "CNOT Entangle", sub: "Entangle adjacent qubit pairs", color: "#B9A7FF" },
                            { s: 3, label: "Measure", sub: "Collapse wavefunction to classical bits", color: "#00F5D4" },
                        ].map(p => (
                            <div key={p.s} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step >= p.s || results ? `${p.color}22` : "rgba(0,0,0,.4)", border: `1.5px solid ${step >= p.s || results ? p.color : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: step >= p.s || results ? p.color : "#88A3D6", flexShrink: 0, transition: "all .4s", boxShadow: step >= p.s ? `0 0 12px ${p.color}44` : "none" }}>{p.s}</div>
                                <div>
                                    <div style={{ fontSize: 11, color: step >= p.s || results ? "#E6E8EE" : "#88A3D6", fontWeight: step >= p.s ? 600 : 400, transition: "color .3s" }}>{p.label}</div>
                                    <div style={{ fontSize: 9, color: "#88A3D6", marginTop: 3 }}>{p.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="card cl" style={{ padding: "26px" }}>
                        <SectionLabel color="#B9A7FF">QUANTUM ADVANTAGE</SectionLabel>
                        <div style={{ fontSize: 11, color: "#88A3D6", lineHeight: 1.85 }}>
                            Classical RNGs use deterministic algorithms that can be predicted with enough compute. Quantum measurement outcomes are fundamentally non-deterministic — governed by physical law, not math.
                            <br /><br />
                            This makes every key generated by Quantum Wall <span style={{ color: "#00F5D4" }}>provably random</span> — not just computationally random.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

void rnd;
