import { STARDUST_SPECS } from "@/lib/constants";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.12),transparent_50%),radial-gradient(ellipse_80%_60%_at_100%_50%,rgba(167,139,250,0.08),transparent_45%),linear-gradient(180deg,#070a14_0%,#0b1020_40%,#060913_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        {STARDUST_SPECS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/55"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `stardust-drift ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes stardust-drift {
          from { opacity: 0.15; transform: translate(0, 0); }
          to { opacity: 0.55; transform: translate(4px, -6px); }
        }
      `}</style>
      <Dashboard />
    </div>
  );
}
