export function HeroBackground() {
  return (
    <div className="hero-world absolute inset-0 z-0 overflow-hidden bg-[#050708]" aria-hidden="true">
      <img
        className="hero-world-image absolute inset-0 h-full w-full object-cover"
        src="/minecraft-sunset.jpg"
        alt=""
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-world-shade absolute inset-0" />
      <div className="hero-world-scanlines pointer-events-none absolute inset-0" />
    </div>
  );
}
