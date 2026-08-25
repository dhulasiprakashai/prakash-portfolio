import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Styles based on variant
  const getStyles = () => {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 24px",
      fontSize: "12px",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.8px",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      transition: "all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      outline: "none",
      opacity: disabled || loading ? 0.6 : 1,
      minHeight: "44px",
      borderRadius: "4px", // rounded but not overly pill-shaped
      gap: "8px",
    };

    if (variant === "primary") {
      return {
        ...base,
        background: "var(--gold)",
        border: "1px solid var(--gold)",
        color: "#050505",
      };
    }

    if (variant === "outline") {
      return {
        ...base,
        background: "transparent",
        border: "1px solid var(--border)",
        color: "var(--text)",
      };
    }

    // ghost variant
    return {
      ...base,
      background: "transparent",
      border: "1px solid transparent",
      color: "var(--muted)",
    };
  };

  return (
    <button
      disabled={disabled || loading}
      style={getStyles()}
      className={`custom-btn ${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
      ) : null}
      {children}

      <style jsx>{`
        .custom-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .custom-btn.primary:hover:not(:disabled) {
          background: #f0c95b;
          border-color: #f0c95b;
        }
        .custom-btn.outline:hover:not(:disabled) {
          border-color: var(--gold);
          color: var(--text);
        }
        .custom-btn.ghost:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
