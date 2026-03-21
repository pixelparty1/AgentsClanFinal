interface SectionBadgeProps {
  text: string;
}

export default function SectionBadge({ text }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-[20px] bg-[#00ff88]/[0.06] border border-[#00ff88]/20 backdrop-blur-sm">
      <div className="w-1 h-1 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
      <p className="text-[13px] font-medium leading-none text-[#e6fff5]">{text}</p>
    </div>
  );
}
