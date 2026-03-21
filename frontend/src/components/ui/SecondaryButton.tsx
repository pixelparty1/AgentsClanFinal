import Link from 'next/link';

interface SecondaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({
  children,
  href,
  onClick,
  className = '',
}: SecondaryButtonProps) {
  const inner = (
    <div className={`group relative inline-block ${className}`}>
      <div className="absolute inset-0 rounded-full border border-[#00ff88]/30 group-hover:border-[#00ff88]/60 transition-colors duration-300" />
      <div className="relative bg-transparent hover:bg-[#00ff88]/[0.06] transition-all duration-300 rounded-full px-[29px] py-[11px] overflow-hidden active:scale-95 hover:scale-[1.03]">
        <span className="text-[#e6fff5] text-sm font-medium relative z-10 group-hover:text-[#00ff88] transition-colors duration-300">{children}</span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button onClick={onClick} className="group relative">
      <div className="absolute inset-0 rounded-full border border-[#00ff88]/30 group-hover:border-[#00ff88]/60 transition-colors duration-300" />
      <div className="relative bg-transparent hover:bg-[#00ff88]/[0.06] transition-all duration-300 rounded-full px-[29px] py-[11px] overflow-hidden active:scale-95 hover:scale-[1.03]">
        <span className="text-[#e6fff5] text-sm font-medium relative z-10 group-hover:text-[#00ff88] transition-colors duration-300">{children}</span>
      </div>
    </button>
  );
}
