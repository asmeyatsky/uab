import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-white/[0.03] px-3 py-2 text-sm text-gray-100 backdrop-blur-sm',
          'placeholder:text-gray-600 focus:outline-none transition-all',
          error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
NeonInput.displayName = 'NeonInput';

interface NeonTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const NeonTextarea = forwardRef<HTMLTextAreaElement, NeonTextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-400">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-lg border bg-white/[0.03] px-3 py-2 text-sm text-gray-100 backdrop-blur-sm',
          'placeholder:text-gray-600 focus:outline-none transition-all resize-none',
          error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-primary/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
NeonTextarea.displayName = 'NeonTextarea';
