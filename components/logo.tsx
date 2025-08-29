import Link from "next/link"

interface LogoProps {
  variant?: "navbar" | "footer"
  showText?: boolean
}

export function Logo({ variant = "navbar", showText = true }: LogoProps) {
  const isNavbar = variant === "navbar"
  const size = isNavbar ? "h-10 w-10" : "h-8 w-8"
  const textSize = isNavbar ? "text-xl md:text-2xl" : "text-lg md:text-xl"
  
  return (
    <Link href="/" aria-label="MARK-IT Home" className="group flex items-center gap-3">
      {/* Enhanced logo with gradient and better animations */}
      <span className={`relative inline-flex ${size} items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground ring-2 ring-primary/20 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:ring-primary/40`}>
        {/* Main icon */}
        <svg viewBox="0 0 24 24" className={`${isNavbar ? 'h-5 w-5' : 'h-4 w-4'} text-primary-foreground`} role="img" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M9.5 12.5l2 2.5 4-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {/* Animated accent rings */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-accent/30 animate-ping-slow" />
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/20 animate-pulse" />
        
        {/* Glow effect */}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </span>
      
      {showText && (
        <span className={`heading ${textSize} font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-1`}>
          MARK-IT
        </span>
      )}
    </Link>
  )
}


