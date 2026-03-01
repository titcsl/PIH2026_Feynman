import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="drift absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
      <div className="drift-slow absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1
          className="animate-fade-up animate-delay-1 font-display font-extrabold leading-[0.9] tracking-tighter mb-8"
          style={{ fontSize: "clamp(3rem, 8vw, 8rem)" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 40%, #38bdf8 70%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Quantum
          </span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Wall
          </span>
        </h1>

        <p className="animate-fade-up animate-delay-2 text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Quantum Wall is middleware security software designed to encrypt critical information before it reaches the database, ensuring that in case of database compromise, the stored information will be secure. It provides an encryption boundary for applications, enhancing the security of information using robust encryption techniques, including those based on quantum physics, to minimize the effects of possible data breaches in modern systems.
        </p>

        <div className="animate-fade-up animate-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="xl"
            className="group mb-12 relative overflow-hidden font-display font-semibold tracking-wide"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            Test Now
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}
