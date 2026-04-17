/**
 * Roadmap route loading state. Mirrors the proportions of `/roadmap` so the
 * layout doesn't shift when the real canvas swaps in.
 */
export default function Loading() {
  return (
    <main className="min-h-fill px-4 py-4" style={{ background: "var(--color-bg-page)" }}>
      <section
        aria-label="Roadmap loading"
        className="relative w-full h-[calc(100vh-7rem)] overflow-hidden rounded-xl"
        style={{
          border: "1px solid rgba(124,158,248,0.18)",
          background: "var(--color-bg-page)",
          boxShadow: "inset 0 0 80px rgba(124,158,248,0.03)",
        }}
      >
        {/* subtle background grid dots to match React Flow background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(124,158,248,0.35) 1px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* centered spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            aria-label="Loading roadmap"
            role="status"
            className="h-12 w-12 rounded-full border-[3px] border-transparent animate-spin"
            style={{
              borderTopColor: "rgba(124, 158, 248, 0.45)",
              borderRightColor: "rgba(124, 158, 248, 0.25)",
              animationDuration: "0.75s",
            }}
          />
        </div>
      </section>
    </main>
  );
}
