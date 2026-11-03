
import React from 'react';

export default function Loader({ className = '' }) {
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500 z-50 ${className}`}>
        
        <div className="flex flex-col items-center gap-6">
            {/* Minimal Logo Spinner */}
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Thin, elegant spinner ring */}
                <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-800" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
                
                {/* Static Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-slate-900 dark:text-white transition-colors">
                        <rect x="8" y="8" width="16" height="16" rx="4" fill="currentColor" transform="rotate(45 16 16)" />
                    </svg>
                </div>
            </div>
            
            {/* Simple Text */}
            <h2 className="text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">
                Loading
            </h2>
        </div>
    </div>
  );
}
