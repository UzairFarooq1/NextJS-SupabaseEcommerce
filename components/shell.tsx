import type React from "react";

interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div className={`container mx-auto px-4 py-6 max-w-6xl ${className}`}>
      {children}
    </div>
  );
}
