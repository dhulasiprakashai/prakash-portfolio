"use client";

import React, { useState } from "react";

interface NavbarProps {
  brandInitials?: string;
  brandName?: string;
  email?: string;
}

export default function Navbar({
  brandInitials = "PS",
  brandName = "Portfolio",
  email,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header" style={{ width: "100%" }}>
      <div className="container nav" style={{ position: "relative" }}>
        <a className="brand" href="#top" aria-label="Home">
          <span className="logo">{brandInitials}</span>
          <span>{brandName}</span>
        </a>

        {/* Desktop Links */}
        <nav className="links" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Action Button & Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          {email && (
            <a className="btn nav-cta" href={`mailto:${email}`}>
              Let&apos;s Talk ↗
            </a>
          )}

          {/* Hamburger Icon */}
          <button
            type="button"
            aria-label="Toggle Navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontSize: 24,
              cursor: "pointer",
              display: "none", // Controlled via css media query in globals or inline styles
            }}
            className="hamburger-btn"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="mobile-drawer"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--panel)",
              borderBottom: "1px solid var(--border)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              zIndex: 100,
            }}
          >
            <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Skills</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Experience</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Contact</a>
            {email && (
              <a className="btn" href={`mailto:${email}`} onClick={() => setMobileMenuOpen(false)} style={{ textAlign: "center" }}>
                Let&apos;s Talk ↗
              </a>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 950px) {
          .hamburger-btn {
            display: block !important;
          }
          .links {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
