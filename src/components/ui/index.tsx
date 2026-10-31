import React from 'react';
import Image from 'next/image';

export type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type PolymorphicComponentProps<T extends React.ElementType, Props = object> = Props &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

// ==========================================
// Card
// ==========================================
export type CardProps<T extends React.ElementType = 'div'> = PolymorphicComponentProps<
  T,
  {
    children: React.ReactNode;
    className?: string;
  }
>;

export function Card<T extends React.ElementType = 'div'>({
  as,
  children,
  className = '',
  ...props
}: CardProps<T>) {
  const Component = as || 'div';
  return (
    <Component
      className={`card-float ${props.onClick ? 'tap-effect' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

// ==========================================
// Badge
// ==========================================
const badgeColors = {
  blue: { bg: 'var(--accent-light)', color: 'var(--accent)' },
  amber: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
  green: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  red: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
  purple: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  muted: { bg: 'var(--surface-light)', color: 'var(--text-muted)' },
};

export type BadgeProps<T extends React.ElementType = 'span'> = PolymorphicComponentProps<
  T,
  {
    children: React.ReactNode;
    variant?: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'muted';
    size?: 'sm' | 'md';
    className?: string;
  }
>;

export function Badge<T extends React.ElementType = 'span'>({
  as,
  children,
  variant = 'blue',
  size = 'sm',
  className = '',
  style,
  ...props
}: BadgeProps<T>) {
  const Component = as || 'span';
  const colors = badgeColors[variant];
  return (
    <Component
      className={className}
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
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

// ==========================================
// Button
// ==========================================
export type ButtonProps<T extends React.ElementType = 'button'> = PolymorphicComponentProps<
  T,
  {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
  }
>;

export function Button<T extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  disabled,
  style,
  ...props
}: ButtonProps<T>) {
  const Component = as || 'button';
  const base = 'tap-effect inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 border-0 cursor-pointer';

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '12px' },
    md: { padding: '13px 24px', fontSize: '15px', borderRadius: '16px' },
    lg: { padding: '16px 32px', fontSize: '17px', borderRadius: '20px' },
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: '0 8px 24px var(--accent-glow)',
    },
    secondary: {
      background: 'var(--surface-light)',
      color: 'var(--text-primary)',
      border: '1.5px solid var(--border-color)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--accent)',
      boxShadow: 'none',
    },
    danger: {
      background: 'rgba(239,68,68,0.12)',
      color: '#EF4444',
      boxShadow: 'none',
    },
  };

  return (
    <Component
      disabled={disabled}
      className={`${base} ${className}`}
      style={{
        ...sizes[size],
        ...variants[variant],
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'Inter, sans-serif',
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

// ==========================================
// Avatar
// ==========================================
export interface AvatarProps {
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
      <div 
        style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}
      >
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
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

// ==========================================
// Divider
// ==========================================
export function Divider({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ height: '1px', background: 'var(--border-color)', width: '100%' }}
    />
  );
}

// ==========================================
// Section Header
// ==========================================
export function SectionHeader({ title, subtitle, action }: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="section-title text-2xl font-black uppercase tracking-tight">{title}</h2>
        {subtitle && <p className="section-subtitle font-mono text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
