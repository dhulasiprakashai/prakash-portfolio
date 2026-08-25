"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

type Profile = {
  name: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description: string;
  image_url: string | null;
  tech: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  published: boolean;
  problem?: string | null;
  solution?: string | null;
  features?: string | null;
  architecture?: string | null;
  screenshots?: string[] | null;
  challenges?: string | null;
  results?: string | null;
};

type Settings = {
  logo_text: string;
  contact_email: string;
};

export default function ProjectDetails() {
  const params = useParams();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const fetchJson = async (url: string) => {
          const res = await fetch(url);
          if (res.ok) return res.json();
          return null;
        };

        const [projectsData, profileData, settingsData] = await Promise.all([
          fetchJson("/api/projects"),
          fetchJson("/api/profile"),
          fetchJson("/api/settings"),
        ]);

        if (!active) return;

        if (profileData?.profile) setProfile(profileData.profile);
        if (settingsData?.settings) setSettings(settingsData.settings);

        if (projectsData?.projects) {
          const found = projectsData.projects.find((p: Project) => p.slug === slug && p.published);
          if (found) {
            setProject(found);
          }
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  // Scroll reveal Observer
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading, project]);

  const initials = settings?.logo_text || (profile?.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PS");

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#050505", color: "#f5f3ed" }}>
        <div style={{ color: "#d4af37", fontSize: 13, letterSpacing: 2 }}>LOADING CASE STUDY...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#050505", color: "#f5f3ed", textAlign: "center", padding: 20 }}>
        <div>
          <span className="logo" style={{ margin: "0 auto 20px" }}>{initials}</span>
          <h1 style={{ fontFamily: "Space Grotesk", fontSize: "2.5rem", letterSpacing: -2, textTransform: "uppercase" }}>Project Not Found</h1>
          <p style={{ color: "var(--muted)", maxWidth: 500, margin: "10px auto 25px", lineHeight: 1.6 }}>
            The requested project study does not exist or has not been published yet.
          </p>
          <a href="/" className="btn primary">Back to Portfolio</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        brandInitials={initials}
        brandName={profile?.name || "Portfolio"}
        email={settings?.contact_email || profile?.email || undefined}
      />

      <main>
        {/* HERO SECTION */}
        <section className="container hero reveal-on-scroll" style={{ minHeight: "auto", paddingBlock: "80px 40px" }}>
          <div className="hero-copy" style={{ alignSelf: "center" }}>
            <span className="hero-role">CASE STUDY</span>
            <h1 className="hero-title" style={{ fontSize: "clamp(38px, 5.5vw, 68px)", letterSpacing: "-2px", marginBottom: 20 }}>
              {project.title.toUpperCase()}
            </h1>
            <p className="hero-desc" style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 25 }}>
              {project.description}
            </p>

            {project.tech && project.tech.length > 0 && (
              <div className="project-card-tech animate-fade-in delay-200" style={{ marginBottom: 30 }}>
                {project.tech.map((tech) => (
                  <span className="tech-pill" key={tech}>{tech}</span>
                ))}
              </div>
            )}

            <div className="actions animate-reveal-up delay-300">
              {project.live_url && (
                <a className="btn primary" href={project.live_url} target="_blank" rel="noreferrer">
                  LIVE DEMO ↗
                </a>
              )}
              {project.github_url && (
                <a className="btn outline" href={project.github_url} target="_blank" rel="noreferrer">
                  VIEW CODE ↗
                </a>
              )}
              <a className="btn outline" href="/#projects">
                ← BACK
              </a>
            </div>
          </div>

          <div className="visual animate-scale-up" style={{ minHeight: "auto" }}>
            {project.image_url ? (
              <div className="avatar" style={{ width: "100%", height: "clamp(260px, 40vw, 420px)", borderRadius: 0 }}>
                <img src={project.image_url} alt={project.title} style={{ filter: "grayscale(20%)" }} />
              </div>
            ) : (
              <div className="project-card-placeholder" style={{ width: "100%", height: 350 }}>
                <span>{project.title.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
        </section>

        {/* CASE STUDY SECTION */}
        <section className="section-dark reveal-on-scroll" style={{ borderBottom: "none" }}>
          <div className="container" style={{ maxWidth: 800, margin: "auto", display: "grid", gap: 50 }}>
            {/* Overview / Full Description */}
            {project.full_description && (
              <div className="stagger-item">
                <span className="section-label">01 / Project Overview</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.full_description}
                </p>
              </div>
            )}

            {/* Problem Statement */}
            {project.problem && (
              <div className="stagger-item" style={{ borderLeft: "2px solid var(--gold)", paddingLeft: 24 }}>
                <span className="section-label">02 / Problem Statement</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.problem}
                </p>
              </div>
            )}

            {/* Solution Description */}
            {project.solution && (
              <div className="stagger-item">
                <span className="section-label">03 / Proposed Solution</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.solution}
                </p>
              </div>
            )}

            {/* Features list */}
            {project.features && (
              <div className="stagger-item">
                <span className="section-label">04 / Core Features</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.features}
                </p>
              </div>
            )}

            {/* Architecture Details */}
            {project.architecture && (
              <div className="stagger-item">
                <span className="section-label">05 / System Architecture</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.architecture}
                </p>
              </div>
            )}

            {/* Screenshots Gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="stagger-item">
                <span className="section-label">06 / Gallery & Interface</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 15, marginTop: 20 }}>
                  {project.screenshots.map((url, idx) => (
                    <div key={idx} style={{ overflow: "hidden", border: "1px solid var(--line)", background: "#111" }}>
                      <img src={url} alt={`Screenshot ${idx + 1}`} style={{ width: "100%", height: "auto", display: "block" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engineering Challenges */}
            {project.challenges && (
              <div className="stagger-item" style={{ borderLeft: "2px solid rgba(255,255,255,0.15)", paddingLeft: 24 }}>
                <span className="section-label">07 / Engineering Challenges</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.challenges}
                </p>
              </div>
            )}

            {/* Results */}
            {project.results && (
              <div className="stagger-item">
                <span className="section-label">08 / Results & Impact</span>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginTop: 15, whiteSpace: "pre-line" }}>
                  {project.results}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer
        brandName={profile?.name || "Portfolio"}
        location={profile?.location || undefined}
        githubUrl={profile?.github || undefined}
        linkedinUrl={profile?.linkedin || undefined}
      />
    </>
  );
}
