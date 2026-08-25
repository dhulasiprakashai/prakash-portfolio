import React from "react";

interface FooterProps {
  brandName?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function Footer({
  brandName = "Portfolio",
  location = "",
  githubUrl,
  linkedinUrl,
}: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "30px 0", color: "#68645d", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
      <div className="container footer" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
        
        {/* Social placeholders */}
        <div style={{ display: "flex", gap: 20 }}>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" style={{ transition: "0.2s color" }} className="social-link">
              GitHub ↗
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" style={{ transition: "0.2s color" }} className="social-link">
              LinkedIn ↗
            </a>
          )}
        </div>

        {location && <span>{location}</span>}
      </div>

      <style jsx>{`
        .social-link:hover {
          color: var(--gold);
        }
      `}</style>
    </footer>
  );
}
