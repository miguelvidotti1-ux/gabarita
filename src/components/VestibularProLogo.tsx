import React from 'react';

/**
 * Exact 3D V Letter Logo with Graduation Cap from Photo 1
 */
export function VestibularPro3DMark({ className = 'w-full h-full' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Left deep shadow facet */}
        <linearGradient id="vFacetLeftDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="60%" stopColor="#172554" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        {/* Central main vibrant cobalt blue body */}
        <linearGradient id="vMainBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Right lighter accent facet */}
        <linearGradient id="vFacetRightLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Cap Diamond Gradient */}
        <linearGradient id="capDiamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>

        {/* Subtle drop shadow */}
        <filter id="vLogoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g filter="url(#vLogoShadow)">
        {/* Left under-facet / dark wing bevel */}
        <path
          d="M24 38 L58 106 L51 106 L33 38 Z"
          fill="url(#vFacetLeftDark)"
        />

        {/* Right outer facet / bright wing bevel */}
        <path
          d="M96 38 L60 106 L67 106 L87 38 Z"
          fill="url(#vFacetRightLight)"
        />

        {/* Main 3D front V shape */}
        <path
          d="M33 38 L59 90 L69 90 L87 38 L74 38 L61 68 L48 38 Z"
          fill="url(#vMainBodyGrad)"
        />

        {/* Inner geometric depth lines */}
        <path
          d="M48 38 L61 68 L59 90 L58 106 L48 38 Z"
          fill="#1e3a8a"
          opacity="0.55"
        />
        <path
          d="M69 90 L61 68 L74 38 L87 38 Z"
          fill="#60a5fa"
          opacity="0.3"
        />

        {/* GRADUATION CAP (Positioned on top-left of V) */}
        <g transform="translate(16, 10) scale(0.92)">
          {/* Cap Base Band */}
          <path
            d="M14 20 V27 C14 31 38 31 38 27 V20"
            fill="#1e3a8a"
            stroke="#60a5fa"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Cap Diamond Roof */}
          <path
            d="M26 6 L48 15 L26 24 L4 15 Z"
            fill="url(#capDiamondGrad)"
            stroke="#93c5fd"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Cap Center Button */}
          <circle cx="26" cy="15" r="1.8" fill="#ffffff" />

          {/* White Tassel hanging to right */}
          <path
            d="M26 15 Q38 18 42 29"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="42" cy="29.5" r="1.9" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
}

/**
 * The Second Image (Black Rounded Squircle) containing the First Image (3D V + Graduation Cap)
 * Keeps the exact black squircle container geometry and properties without altering the outer container.
 */
export default function VestibularProLogo({
  className = 'w-9 h-9',
  bgVariant = 'black',
}: {
  className?: string;
  bgVariant?: 'black' | 'dark' | 'white' | 'auto' | 'primary';
}) {
  const bgClasses = {
    black: 'bg-black text-white border border-white/15 shadow-sm',
    dark: 'bg-[#0B0D13] text-white border border-white/10 shadow-sm',
    white: 'bg-white text-slate-900 border border-slate-200/80 shadow-sm',
    auto: 'bg-black dark:bg-[#14161B] text-white border border-white/15 shadow-sm',
    primary: 'bg-[var(--primary)] text-white shadow-sm',
  }[bgVariant];

  return (
    <div
      className={`relative rounded-[24%] flex items-center justify-center p-1.5 overflow-hidden shrink-0 select-none ${bgClasses} ${className}`}
      style={{
        aspectRatio: '1 / 1',
      }}
    >
      <VestibularPro3DMark className="w-full h-full object-contain" />
    </div>
  );
}

/**
 * Complete Header Lockup matching the user's image:
 * [ Black Squircle with 3D V Cap Icon ] VESTIBULARPRO
 */
export function VestibularProBrandLockup({
  iconSize = 'w-9 h-9',
  textSize = 'text-lg',
  className = '',
}: {
  iconSize?: string;
  textSize?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <VestibularProLogo className={iconSize} bgVariant="black" />
      <span className={`font-extrabold tracking-tight ${textSize} text-white`}>
        Gabarita
      </span>
    </div>
  );
}

/**
 * Gabarita Brand Lockup
 */
export function VestHubBrandLockup({
  iconSize = 'w-9 h-9',
  textSize = 'text-lg',
  className = '',
}: {
  iconSize?: string;
  textSize?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <VestibularProLogo className={iconSize} bgVariant="black" />
      <span className={`font-extrabold tracking-tight ${textSize} text-white`}>
        Gabarita
      </span>
    </div>
  );
}


