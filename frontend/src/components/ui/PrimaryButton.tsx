import Link from 'next/link';

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  className = '',
  type = 'button',
}: PrimaryButtonProps) {
  const inner = (
    <div className={`group relative inline-block ${className}`}>
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
      <div className="relative bg-gradient-to-r from-[#00ff88] to-[#00cc66] rounded-full px-[29px] py-[11px] overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.03] shadow-[0_0_16px_rgba(0,255,136,0.2)]">
        <span className="text-[#0b1a13] text-sm font-semibold relative z-10">{children}</span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button type={type} onClick={onClick} className="group relative">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#00ff88] to-[#00cc66] opacity-40 blur-md group-hover:opacity-70 transition-opacity duration-300" />
      <div className="relative bg-gradient-to-r from-[#00ff88] to-[#00cc66] rounded-full px-[29px] py-[11px] overflow-hidden transition-all duration-300 active:scale-95 hover:scale-[1.03] shadow-[0_0_16px_rgba(0,255,136,0.2)]">
        <span className="text-[#0b1a13] text-sm font-semibold relative z-10">{children}</span>
      </div>
    </button>
  );
}
