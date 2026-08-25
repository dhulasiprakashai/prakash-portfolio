import React from "react";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`} style={{ marginBottom: "50px", maxWidth: "800px" }}>
      <span className="section-label" style={{ display: "block", color: "var(--gold)", fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: "12px" }}>
        {label}
      </span>
      <h2 style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: "clamp(32px, 5vw, 64px)", lineHeight: "0.95", letterSpacing: "-2px", textTransform: "uppercase", margin: "0 0 20px" }}>
        {title}
      </h2>
      {description && (
        <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: "1.7", margin: "0", maxWidth: "700px" }}>
          {description}
        </p>
      )}
    </div>
  );
}
