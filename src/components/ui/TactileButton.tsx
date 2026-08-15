'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TactileButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export default function TactileButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: TactileButtonProps) {
  
  const baseClasses = "flex items-center justify-center gap-2 font-bold transition-colors select-none";
  
  const variantClasses = {
    primary: "bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(255,90,54,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)]",
    secondary: "bg-[var(--surface-2)] text-[var(--text-primary)] shadow-[var(--elevation-1),inset_0_1px_0_var(--highlight-color)] border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]",
    danger: "bg-[var(--accent-danger)] text-white shadow-[0_4px_12px_rgba(255,59,48,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] shadow-none"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-xs rounded-xl",
    md: "px-6 py-3.5 text-sm rounded-2xl",
    lg: "px-8 py-4 text-base rounded-[20px]"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.95, y: 2, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
