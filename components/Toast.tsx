'use client';

export default function Toast({ message }: { message: string }) {
  return (
    <div
      className="fixed z-[400] flex items-center gap-2 font-semibold text-sm rounded-xl border transition-all duration-250 pointer-events-none"
      style={{
        top: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${message ? '0' : '-20px'})`,
        opacity: message ? 1 : 0,
        background: 'var(--surface)',
        color: 'var(--text)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '12px 24px',
        maxWidth: 'calc(100vw - 32px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
      role="status"
      aria-live="polite"
    >
      <span style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>&#10003;</span>
      {message}
    </div>
  );
}
