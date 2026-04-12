'use client';

const items = [
  'FREE SHIPPING OVER ₹8,000',
  'NEW COLLECTION LIVE NOW',
  'SECURE CHECKOUT',
  '30-DAY RETURNS',
];

export default function StoreMarquee() {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#10B981] h-9 overflow-hidden select-none">
      <div className="store-ticker-track flex items-center h-full whitespace-nowrap">
        {doubled.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white"
          >
            <span className="w-1 h-1 rounded-full bg-white/50" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
