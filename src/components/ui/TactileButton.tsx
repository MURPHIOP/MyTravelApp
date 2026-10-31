'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export type AsProp<T extends React.ElementType> = {
  as?: T;
};

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentProps<T extends React.ElementType, Props = object> = Props &
  AsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

export interface TactileButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export type TactileButtonProps<T extends React.ElementType = 'button'> = PolymorphicComponentProps<
  T,
  TactileButtonBaseProps
>;

export default function TactileButton<T extends React.ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: TactileButtonProps<T>) {
  const baseClasses = 'flex items-center justify-center gap-2 font-bold transition-colors select-none transform-gpu';

  const variantClasses = {
    primary: 'bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(37,99,235,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)]',
    secondary: 'bg-[var(--surface-light)] text-[var(--text-primary)] border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_var(--shadow-color)]',
    danger: 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]',
    ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] shadow-none',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-xl',
    md: 'px-6 py-3.5 text-sm rounded-2xl',
    lg: 'px-8 py-4 text-base rounded-[20px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const combinedClass = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  if (as === 'a') {
    return (
      <motion.a
        whileHover={{ y: -1, scale: 1.01 }}
        whileTap={{ scale: 0.95, y: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={combinedClass}
        {...(props as HTMLMotionProps<'a'>)}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.01 }}
      whileTap={{ scale: 0.95, y: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={combinedClass}
      {...(props as HTMLMotionProps<'button'>)}
    >
      {children}
    </motion.button>
  );
}
