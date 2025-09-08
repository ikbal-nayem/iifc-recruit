
import React from 'react';

export function LoginBanner() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad1)" />
      <g transform="translate(400 300)">
        {/* Abstract shape 1 */}
        <path
          d="M -200 -150 Q -150 -250 0 -150 T 200 -150"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="50s"
            repeatCount="indefinite"
          />
        </path>
        {/* Abstract shape 2 */}
        <path
          d="M -250 100 Q -100 200 0 100 T 250 100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="15"
          strokeLinecap="round"
          opacity="0.5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360"
            to="0"
            dur="40s"
            repeatCount="indefinite"
          />
        </path>
        {/* Central Element */}
        <circle cx="0" cy="0" r="50" fill="hsl(var(--primary))" opacity="0.6">
          <animate
            attributeName="r"
            values="50;60;50"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="0" cy="0" r="30" fill="hsl(var(--primary-foreground))" opacity="0.8" />

        {/* Floating dots */}
        <circle cx="150" cy="-100" r="8" fill="hsl(var(--accent))" opacity="0.7">
            <animateMotion path="M 0 0 C 10 -20, -10 -40, 0 -60 S 10 -100, 0 -120 Z" dur="8s" repeatCount="indefinite" />
        </circle>
         <circle cx="-180" cy="80" r="12" fill="hsl(var(--accent))" opacity="0.6">
             <animateMotion path="M 0 0 C -15 25, 15 50, 0 75 S -15 125, 0 150 Z" dur="10s" repeatCount="indefinite" />
        </circle>
        <rect x="200" y="150" width="15" height="15" rx="4" fill="hsl(var(--primary))" opacity="0.4">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 207.5 157.5"
                to="360 207.5 157.5"
                dur="12s"
                repeatCount="indefinite"
          />
        </rect>
      </g>
      <text x="50%" y="90%" dominantBaseline="middle" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="24" fill="hsl(var(--foreground))" opacity="0.7">
        Connecting Talent with Opportunity
      </text>
    </svg>
  );
}
