import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary: 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/30 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]',
  secondary: 'bg-secondary/20 border-secondary/50 text-secondary hover:bg-secondary/30 hover:shadow-[0_0_20px_rgba(188,19,254,0.3)]',
  ghost: 'bg-transparent border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20',
  danger: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export function NeonButton({ children, variant = 'primary', size = 'md', icon, loading, className, disabled, onClick, type }: NeonButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
}
