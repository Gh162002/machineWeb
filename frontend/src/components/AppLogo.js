import React from 'react';

/**
 * AppLogo — Logo SVG custom pour ML RH Platform
 * Concept : un cerveau stylisé avec des nœuds de réseau de neurones
 * formant la lettre "RH", avec un gradient violet→bleu ciel.
 */
export default function AppLogo({ size = 36, className = '' }) {
  const id = 'logo-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ML RH Platform logo"
      role="img"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7C6FF7" />
          <stop offset="100%" stopColor="#60C8F5" />
        </linearGradient>
      </defs>

      {/* Fond arrondi */}
      <rect width="40" height="40" rx="10" fill={`url(#${id})`} />

      {/* Nœuds du réseau de neurones */}
      {/* Nœud central */}
      <circle cx="20" cy="20" r="3.5" fill="white" opacity="0.95" />

      {/* Nœuds satellites */}
      <circle cx="10" cy="13" r="2.5" fill="white" opacity="0.85" />
      <circle cx="30" cy="13" r="2.5" fill="white" opacity="0.85" />
      <circle cx="10" cy="27" r="2.5" fill="white" opacity="0.85" />
      <circle cx="30" cy="27" r="2.5" fill="white" opacity="0.85" />
      <circle cx="20" cy="8"  r="2"   fill="white" opacity="0.7" />
      <circle cx="20" cy="32" r="2"   fill="white" opacity="0.7" />

      {/* Connexions (lignes du réseau) */}
      <line x1="20" y1="20" x2="10" y2="13" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="20" x2="30" y2="13" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="20" x2="10" y2="27" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="20" x2="30" y2="27" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="20" x2="20" y2="8"  stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="20" y1="20" x2="20" y2="32" stroke="white" strokeWidth="1.2" opacity="0.5" />

      {/* Connexions entre satellites */}
      <line x1="10" y1="13" x2="20" y2="8"  stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="30" y1="13" x2="20" y2="8"  stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="27" x2="20" y2="32" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="30" y1="27" x2="20" y2="32" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="10" y1="13" x2="10" y2="27" stroke="white" strokeWidth="0.8" opacity="0.3" />
      <line x1="30" y1="13" x2="30" y2="27" stroke="white" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}
