import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  id?: string;
}

export function Card({ children, className = '', onClick, style, id }: CardProps) {
  return (
    <div
      id={id}
      className={`card-float ${onClick ? 'tap-effect' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'muted';
  size?: 'sm' | 'md';
}

const badgeColors = {
  blue: { bg: 'var(--accent-blue-light)', color: 'var(--accent-blue)' },
  amber: { bg: 'var(--accent-amber-light)', color: 'var(--accent-amber)' },
  green: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  red: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  purple: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  muted: { bg: 'var(--surface-2)', color: 'var(--text-muted)' },
};

export function Badge({ children, variant = 'blue', size = 'sm' }: BadgeProps) {
  const colors = badgeColors[variant];
  return (
    <span
      style={{
        background: colors.bg,
        color: colors.color,
        borderRadius: '99px',
        padding: size === 'sm' ? '3px 10px' : '5px 14px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children, variant = 'primary', size = 'md', onClick,
  className = '', disabled, id, type = 'button', fullWidth,
}: ButtonProps) {
  const base = 'tap-effect inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 border-0 cursor-pointer';

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '12px' },
    md: { padding: '13px 24px', fontSize: '15px', borderRadius: '16px' },
    lg: { padding: '16px 32px', fontSize: '17px', borderRadius: '20px' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(59,130,246,0.35)',
    },
    secondary: {
      background: 'var(--surface-2)',
      color: 'var(--text-primary)',
      border: '1.5px solid var(--border)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent-blue)',
      boxShadow: 'none',
    },
    danger: {
      background: 'rgba(239,68,68,0.12)',
      color: '#EF4444',
      boxShadow: 'none',
    },
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={{
        ...sizes[size],
        ...variants[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {children}
    </button>
  );
}

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  color?: string;
}

const avatarColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

export function Avatar({ name, src, size = 40, color }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const bgColor = color ?? avatarColors[name.charCodeAt(0) % avatarColors.length];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: '50%',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: size * 0.35,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// Divider
export function Divider({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ height: '1px', background: 'var(--border)', width: '100%' }}
    />
  );
}

// Section Header
export function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
