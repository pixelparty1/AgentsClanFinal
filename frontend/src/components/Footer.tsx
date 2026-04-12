import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#0b1a13] border-t border-[#00ff88]/10 px-6 md:px-[120px] py-12 md:py-16 relative overflow-hidden">
      {/* Background: inner.png overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/inner.png"
          alt=""
          fill
          className="object-cover opacity-40 mix-blend-screen"
        />
        {/* Gradient fade so content remains readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a13] via-[#0b1a13]/70 to-transparent" />
      </div>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent z-[1]" />
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 relative z-10">

        {/* Brand */}
        <div className="flex flex-col gap-4 max-w-xs">
          <Link href="/" className="text-[#e6fff5] text-lg font-semibold tracking-tight hover:text-[#00ff88] transition-colors duration-300">
            AgentsClan
          </Link>
          <p className="text-[#e6fff5]/40 text-sm leading-relaxed">
            Where Builders Become Legends. A next-gen community built for creators, developers, and innovators.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_6px_#00ff88]" />
            <span className="text-[#00ff88] text-xs font-medium">Community Active</span>
          </div>
        </div>

        {/* Nav Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-14">
          <div className="flex flex-col gap-3">
            <span className="text-[#e6fff5]/80 text-xs font-semibold uppercase tracking-widest">Platform</span>
            <Link href="/membership" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Membership</Link>
            <Link href="/events" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Events</Link>
            <Link href="/achievements" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Achievements</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[#e6fff5]/80 text-xs font-semibold uppercase tracking-widest">Company</span>
            <Link href="/services" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Services</Link>
            <Link href="/book-a-call" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Book a Call</Link>
            <Link href="#" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Careers</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[#e6fff5]/80 text-xs font-semibold uppercase tracking-widest">Community</span>
            <a href="https://x.com/AgentsClan2" target="_blank" rel="noopener noreferrer" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Twitter / X</a>
            <a href="https://www.instagram.com/agents_clan2" target="_blank" rel="noopener noreferrer" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Instagram</a>
            <a href="https://www.linkedin.com/company/agents-clan/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">LinkedIn</a>
            <a href="https://www.youtube.com/@AgentsClan2" target="_blank" rel="noopener noreferrer" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">YouTube</a>
            <Link href="/rewards/leaderboard" className="text-[#e6fff5]/40 text-sm hover:text-[#00ff88] transition-colors duration-300">Leaderboard</Link>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-6 border-t border-[#00ff88]/10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-[#e6fff5]/25 text-xs">
          &copy; 2026 AgentsClan. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="#" className="text-[#e6fff5]/25 text-xs hover:text-[#00ff88]/60 transition-colors duration-300">Privacy Policy</Link>
          <Link href="#" className="text-[#e6fff5]/25 text-xs hover:text-[#00ff88]/60 transition-colors duration-300">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
