import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-7' };

export function GlassPanel({ children, className, hover = false, padding = 'md', ...props }: GlassPanelProps) {
  return (
    <motion.div
      className={clsx(
        'rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-lg',
        hover && 'transition-colors hover:border-primary/30 hover:bg-white/[0.06]',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
