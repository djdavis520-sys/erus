export default function Hero() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 50%, var(--secondary) 100%)',
        padding: 'clamp(36px, 8vw, 64px) 16px clamp(32px, 6vw, 56px)',
      }}
    >
      {/* Radial overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
        }}
      />
      <div className="relative z-10 mx-auto" style={{ maxWidth: 640 }}>
        <h1
          className="text-white font-bold mb-3"
          style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
            textWrap: 'balance',
          }}
        >
          Nature&apos;s Best, Delivered to You
        </h1>
        <p
          className="mb-6 mx-auto"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 500,
          }}
        >
          Premium exotic herbs and wellness solutions sourced from around the world.
        </p>
        <a
          href="#products"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-block font-semibold no-underline transition-transform hover:-translate-y-0.5"
          style={{
            background: '#fff',
            color: 'var(--primary)',
            padding: '14px 32px',
            borderRadius: 28,
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '1.05rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
