import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`custom-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        border: "1px solid var(--border)",
        background: "rgba(255, 255, 255, 0.02)",
        color: "#aaa69d",
        padding: "6px 12px",
        fontSize: "9px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        borderRadius: "4px",
        transition: "all 0.2s ease",
      }}
    >
      {children}

      <style jsx>{`
        .custom-badge:hover {
          border-color: rgba(212, 175, 55, 0.4);
          color: var(--gold);
          background: rgba(212, 175, 55, 0.02);
        }
      `}</style>
    </span>
  );
}
