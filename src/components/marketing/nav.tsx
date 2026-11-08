import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { ThemeToggle } from '@/components/theme-provider';
import { useAuth } from '@/features/auth';

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Product', href: '/#features' },
    { label: 'Agents', href: '/#agents' },
    { label: 'Demo', href: '/#demo' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8',
        isScrolled
          ? 'py-3 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-lg'
          : 'py-5 bg-transparent border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Lockup */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg p-1"
        >
          <img
            src="/logo-mark.svg"
            alt="Cadre logo"
            className="w-8 h-8 rounded-xl transition-transform group-hover:scale-105"
          />
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-xl tracking-tight text-[var(--text)]">
              Cadre
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[var(--text-muted)]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="hover:text-[var(--text)] transition-colors focus-visible:outline-none focus-visible:text-[var(--primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Magnetic strength={0.2}>
              <Link to="/app">
                <Button variant="primary" size="sm" className="h-9 px-4 font-semibold">
                  <span>Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </Magnetic>
          ) : (
            <>
              <Link to="/login" search={{}}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Log in
                </Button>
              </Link>
              <Magnetic strength={0.25}>
                <Link to="/signup" search={{}}>
                  <Button variant="primary" size="sm" className="h-9 px-4 font-semibold shadow-md shadow-[var(--primary)]/15">
                    <span>Start free</span>
                    <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] focus-ring"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Screen Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[var(--background)]/95 backdrop-blur-2xl p-6 flex flex-col justify-between border-t border-[var(--border)] animate-in fade-in duration-200 z-50">
          <div className="flex flex-col space-y-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-lg font-heading font-semibold text-[var(--text)] hover:text-[var(--primary)] transition-colors py-2 border-b border-[var(--border)]/50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-8 space-y-3 pb-8">
            {user ? (
              <Link to="/app" className="w-full">
                <Button variant="primary" className="w-full h-11 text-sm font-semibold">
                  Go to Command Center
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" search={{}} className="w-full">
                  <Button variant="primary" className="w-full h-11 text-sm font-semibold">
                    Start free (40 daily analyses)
                  </Button>
                </Link>
                <Link to="/login" search={{}} className="w-full">
                  <Button variant="secondary" className="w-full h-11 text-sm font-medium">
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

