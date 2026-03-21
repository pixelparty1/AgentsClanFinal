interface GradientHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export default function GradientHeading({
  children,
  className = '',
  as: Tag = 'h2',
}: GradientHeadingProps) {
  return (
    <Tag
      className={`font-semibold leading-[1.2] tracking-tight text-transparent bg-clip-text ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(160deg, #e6fff5 35%, rgba(0,255,136,0.55) 100%)',
      }}
    >
      {children}
    </Tag>
  );
}
