import React from 'react';

interface LaundryIconProps {
  name: string;
  size?: number;
  className?: string;
}

const icons: { [key: string]: JSX.Element } = {
  shirt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8l-4-4H8L4 8l2 12h12l2-12z"/>
      <path d="M12 4v16"/>
    </svg>
  ),
  washer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  iron: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16v4c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6z"/>
      <path d="M20 10v6"/>
      <path d="M4 10v6"/>
      <path d="M8 6V4"/>
      <path d="M16 6V4"/>
    </svg>
  ),
  hanger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v4"/>
      <path d="M3 14l9-6 9 6"/>
      <path d="M4 14h16"/>
      <path d="M12 20v-8"/>
    </svg>
  ),
  bed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/>
      <path d="M2 8h20"/>
      <path d="M2 16h20"/>
      <path d="M22 4v16"/>
    </svg>
  ),
  towel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v8H4z"/>
      <path d="M4 12h16v4H4z"/>
      <path d="M4 16h16v4H4z"/>
    </svg>
  ),
  needle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20"/>
      <path d="M12 6l4-4"/>
      <path d="M12 6l-4-4"/>
      <circle cx="12" cy="18" r="2"/>
    </svg>
  ),
  scissors: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3"/>
      <circle cx="6" cy="18" r="3"/>
      <path d="M20 4L8.12 15.88"/>
      <path d="M14.47 14.48L20 20"/>
      <path d="M8.12 8.12L12 12"/>
    </svg>
  ),
  dress: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l-6 2v14h12V6l-6-2z"/>
      <path d="M8 4h8"/>
      <path d="M12 4v16"/>
    </svg>
  ),
  suit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l-6 2v14h12V6l-6-2z"/>
      <path d="M8 6h8"/>
      <path d="M12 4v8"/>
      <path d="M10 8h4"/>
    </svg>
  ),
  pants: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8"/>
      <path d="M12 4v16"/>
      <path d="M8 4v16"/>
      <path d="M16 4v16"/>
    </svg>
  ),
  delivery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h12v10H3z"/>
      <path d="M15 8h4l2 4v2h-6V8z"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
    </svg>
  )
};

export const LaundryIcon: React.FC<LaundryIconProps> = ({ name, size = 24, className = '' }) => {
  const icon = icons[name] || icons.shirt; // Default to shirt if icon not found
  
  return (
    <div style={{ width: size, height: size }} className={className}>
      {icon}
    </div>
  );
};

export type LaundryIconName = keyof typeof icons; 