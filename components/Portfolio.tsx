"use client";

import { useEffect, useState } from "react";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

type Profile = {
  id: string;
  name: string;
  headline: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string | null;
  hero_image_url: string | null;
  github: string;
  linkedin: string;
  cv_url: string | null;
  availability: string;
  experience: string;
};

type About = {
  section_label: string;
  main_heading: string;
  short_intro: string;
  full_description: string;
  career_focus: string;
  published: boolean;
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
  sort_order: number;
  problem?: string | null;
  solution?: string | null;
  features?: string | null;
  architecture?: string | null;
  screenshots?: string[] | null;
  challenges?: string | null;
  results?: string | null;
};

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
  sort_order: number;
  published: boolean;
};

type Experience = {
  id: string;
  job_title: string;
  company: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  current: boolean;
  sort_order: number;
  published: boolean;
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  field_of_study: string;
  location: string;
  description: string;
  start_year: string;
  end_year: string;
  current: boolean;
  sort_order: number;
  published: boolean;
};

type Service = {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  sort_order: number;
  published: boolean;
};

type Stat = {
  id: string;
  label: string;
  value: string;
  description: string;
  sort_order: number;
  published: boolean;
};

type Settings = {
  site_title: string;
  site_description: string;
  logo_text: string;
  footer_text: string;
  contact_email: string;
  social_links: {
    github?: string;
    linkedin?: string;
  };
  availability_status: string;
  maintenance_mode: boolean;
};

const emptyProfile: Profile = {
  id: "default",
  name: "",
  headline: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  avatar_url: null,
  hero_image_url: null,
  github: "",
  linkedin: "",
  cv_url: null,
  availability: "",
  experience: "",
};

const emptyAbout: About = {
  section_label: "01 / ABOUT",
  main_heading: "I DON'T JUST WRITE CODE. I BUILD SOLUTIONS.",
  short_intro: "Focused on turning complex requirements into simple, maintainable digital products.",
  full_description: "",
  career_focus: "",
  published: true,
};

const emptySettings: Settings = {
  site_title: "Prakash S — Web Apps • Automation • Integrations",
  site_description: "Prakash S portfolio and project management website.",
  logo_text: "PS",
  footer_text: "© 2026 Prakash Sharma. All rights reserved.",
  contact_email: "",
  social_links: {},
  availability_status: "",
  maintenance_mode: false,
};

export default function Portfolio() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [about, setAbout] = useState<About>(emptyAbout);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [loading, setLoading] = useState(true);

  // Form submission states
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formMsg, setFormMsg] = useState("");
  const [formErr, setFormErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const fetchJson = async (url: string) => {
          const res = await fetch(url);
          if (res.ok) return res.json();
          return null;
        };

        const [
          profileData,
          aboutData,
          projectsData,
          skillsData,
          experienceData,
          educationData,
          servicesData,
          statsData,
          settingsData,
        ] = await Promise.all([
          fetchJson("/api/profile"),
          fetchJson("/api/about"),
          fetchJson("/api/projects"),
          fetchJson("/api/skills"),
          fetchJson("/api/experience"),
          fetchJson("/api/education"),
          fetchJson("/api/services"),
          fetchJson("/api/stats"),
          fetchJson("/api/settings"),
        ]);

        if (!active) return;

        if (profileData?.profile) setProfile(profileData.profile);
        if (aboutData?.about) setAbout(aboutData.about);
        if (projectsData?.projects) setProjects(projectsData.projects);
        if (skillsData?.skills) setSkills(skillsData.skills);
        if (experienceData?.experience) setExperiences(experienceData.experience);
        if (educationData?.education) setEducations(educationData.education);
        if (servicesData?.services) setServices(servicesData.services);
        if (statsData?.stats) setStats(statsData.stats);
        if (settingsData?.settings) setSettings(settingsData.settings);
      } catch (err) {
        console.error("Failed to load portfolio dynamic data:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

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
  }, [loading, projects, skills, experiences, educations, services, stats]);


  // Submit contact message handler
  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormMsg("Name, Email and Message fields are required.");
      setFormErr(true);
      return;
    }

    setSubmitting(true);
    setFormMsg("");
    setFormErr(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setFormMsg("Transmission initialized successfully. Prakash will respond shortly.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormMsg(data?.error || "Failed to deliver transmission.");
        setFormErr(true);
      }
    } catch (err) {
      console.error(err);
      setFormMsg("Network error. Please try again.");
      setFormErr(true);
    } finally {
      setSubmitting(false);
    }
  }

  // Filter lists based on publication states
  const visibleProjects = projects
    .filter((p) => p.published)
    .sort((a, b) => {
      // Put featured first, then by sort_order
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.sort_order || 99) - (b.sort_order || 99);
    });

  const visibleSkills = skills.filter((s) => s.published);
  const visibleExperiences = experiences.filter((e) => e.published);
  const visibleEducations = educations.filter((e) => e.published);
  const visibleServices = services.filter((s) => s.published);
  const visibleStats = stats.filter((s) => s.published);

  // Group skills by category (normalized)
  const skillsByCategory = visibleSkills.reduce((acc, skill) => {
    let catName = skill.category ? skill.category.trim() : "Other";
    const lower = catName.toLowerCase();
    if (lower === "frontend" || lower === "front-end" || lower === "ui" || lower === "client") {
      catName = "Frontend";
    } else if (lower === "backend" || lower === "back-end" || lower === "server") {
      catName = "Backend";
    } else if (lower === "database" || lower === "db" || lower === "postgres" || lower === "sql") {
      catName = "Database";
    } else if (lower === "tools" || lower === "tool" || lower === "devops" || lower === "infra") {
      catName = "Tools";
    } else if (lower === "ai" || lower === "ml" || lower === "artificial intelligence") {
      catName = "AI";
    }
    
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const orderedCategories = ["Frontend", "Backend", "Database", "Tools", "AI"];
  const allGroupedCategories = Object.keys(skillsByCategory);
  const extraCategories = allGroupedCategories.filter(c => !orderedCategories.includes(c));
  const renderCategories = [
    ...orderedCategories.filter(c => skillsByCategory[c]?.length > 0),
    ...extraCategories.filter(c => skillsByCategory[c]?.length > 0)
  ];

  const cvDownload = profile.cv_url
    ? `${profile.cv_url}${profile.cv_url.includes("?") ? "&" : "?"}download=resume.pdf`
    : "#";

  const initials = settings.logo_text || (profile.name
    ? profile.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PS");

  if (settings.maintenance_mode) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#050505", color: "#f5f3ed", textAlign: "center", padding: 20 }}>
        <div>
          <span className="logo" style={{ margin: "0 auto 20px" }}>{initials}</span>
          <h1 style={{ fontFamily: "Space Grotesk", fontSize: "2.5rem", letterSpacing: -2, textTransform: "uppercase" }}>System Offline</h1>
          <p style={{ color: "var(--muted)", maxWidth: 500, margin: "10px auto 0", lineHeight: 1.6 }}>
            {settings.site_title || "Portfolio"} is undergoing scheduled maintenance operations. Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        brandInitials={initials}
        brandName={profile.name || "Portfolio"}
        email={settings.contact_email || profile.email || undefined}
      />

      <main id="top">
        {/* HERO SECTION */}
        <section className="container hero">
          <div className="hero-copy">
            <span className="hero-role animate-reveal-up">FULL STACK DEVELOPER</span>
            <h1 className="hero-title animate-reveal-up delay-100">
              {profile.name ? (
                <>
                  I&apos;M <span className="accent">{profile.name.replace(/\s+S\.?$/i, "").toUpperCase()}</span>
                  <br />
                  {profile.headline ? profile.headline.toUpperCase() : "I BUILD DIGITAL EXPERIENCES."}
                </>
              ) : (
                profile.headline || "I BUILD DIGITAL EXPERIENCES."
              )}
            </h1>
            <p className="hero-desc animate-reveal-up delay-200" style={{ whiteSpace: "pre-line" }}>
              {profile.about ||
                "I build modern web applications, automation workflows and practical digital products with clean engineering."}
            </p>

            <div className="actions animate-reveal-up delay-300">
              <a className="btn primary" href="#projects">VIEW MY WORK ↓</a>
              {profile.cv_url && (
                <a className="btn outline" href={cvDownload} download="resume.pdf">DOWNLOAD CV ↗</a>
              )}
            </div>

            <div className="social-row animate-reveal-up delay-400">
              {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
              {(settings.contact_email || profile.email) && <a href={`mailto:${settings.contact_email || profile.email}`}>Email ↗</a>}
            </div>
          </div>

          <div className="visual animate-scale-up delay-200">
            <div className="visual-ring" />
            <div className="visual-glow" />
            <div className="avatar avatar-animate">
              {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.name || "Profile"} /> : <span>{initials}</span>}
            </div>
            {visibleProjects.length > 0 && <div className="floating-stat stat-projects animate-fade-in delay-400"><small>PROJECTS</small><strong>{visibleProjects.length}</strong></div>}
            {profile.availability && <div className="floating-stat stat-availability animate-fade-in delay-500"><small>AVAILABILITY</small><strong>{profile.availability}</strong></div>}
            {profile.experience && <div className="floating-stat stat-experience animate-fade-in delay-300"><small>EXPERIENCE</small><strong>{profile.experience}</strong></div>}
          </div>
        </section>

        {/* ABOUT SECTION */}
        {about.published && (
          <section id="about" className="section-dark reveal-on-scroll">
            <div className="container about-grid">
              <div className="section-label">{about.section_label}</div>
              <div className="about-content">
                <h2>{about.main_heading || "I DON'T JUST WRITE CODE. I BUILD SOLUTIONS."}</h2>
                <p style={{ whiteSpace: "pre-line" }}>{about.full_description || about.short_intro || "Focused on turning complex requirements into simple, maintainable digital products."}</p>
                
                {about.career_focus && (
                  <div style={{ marginTop: 25, borderLeft: "1px solid var(--gold)", paddingLeft: 20 }} className="stagger-item">
                    <span className="eyebrow" style={{ fontSize: 9 }}>Career Focus</span>
                    <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 8, lineHeight: 1.7 }}>{about.career_focus}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* STATS SECTION */}
        {visibleStats.length > 0 && (
          <section id="stats" className="reveal-on-scroll">
            <div className="container">
              <div className="stats-grid">
                {visibleStats.map((st, idx) => (
                  <div className="statbox stagger-item" key={st.id}>
                    <span className="stat-index">0{idx + 1}</span>
                    <strong className="stat-value">{st.value}</strong>
                    <span className="stat-label">{st.label}</span>
                    {st.description && <p className="stat-desc">{st.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROJECTS SECTION */}
        {visibleProjects.length > 0 && (
          <section id="projects" className="reveal-on-scroll">
            <div className="container">
              <div className="section-heading">
                <div className="section-label">02 / SELECTED WORK</div>
                <h2>ENGINEERED VALUE.</h2>
                <p>Real projects, practical engineering and technology chosen for the problem.</p>
              </div>

              <div className="projects-grid">
                {visibleProjects.map((project, index) => {
                  const isFeatured = project.featured;
                  return (
                    <article 
                      className={`project-card ${isFeatured ? "project-card-featured" : ""} stagger-item`} 
                      key={project.id}
                    >
                      <div className="project-card-media">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} loading="lazy" />
                        ) : (
                          <div className="project-card-placeholder">
                            <span>{project.title.slice(0, 2).toUpperCase()}</span>
                          </div>
                        )}
                        {isFeatured && <span className="project-badge">Featured Work</span>}
                      </div>
                      <div className="project-card-content">
                        <div className="project-card-index">0{index + 1}</div>
                        <h3 className="project-card-title">{project.title}</h3>
                        <p className="project-card-desc">{project.description}</p>
                        
                        {project.full_description && (
                          <p className="project-card-full-desc">{project.full_description}</p>
                        )}

                        {project.tech && project.tech.length > 0 && (
                          <div className="project-card-tech">
                            {project.tech.map((tech) => (
                              <span className="tech-pill" key={tech}>{tech}</span>
                            ))}
                          </div>
                        )}
                        <div className="project-card-links">
                          {project.slug ? (
                            <a className="project-link-btn primary" href={`/projects/${project.slug}`}>
                              Case Study ↗
                            </a>
                          ) : (
                            project.live_url && (
                              <a className="project-link-btn primary" href={project.live_url} target="_blank" rel="noreferrer">
                                Live Demo ↗
                              </a>
                            )
                          )}
                          {project.github_url && (
                            <a className="project-link-btn outline" href={project.github_url} target="_blank" rel="noreferrer">
                              Source Code ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {visibleSkills.length > 0 && (
          <section id="skills" className="section-dark reveal-on-scroll">
            <div className="container">
              <div className="section-heading">
                <div className="section-label">03 / TOOLKIT</div>
                <h2>TECH STACK.</h2>
                <p>A curated set of technologies and tools I specialize in to build production-grade software.</p>
              </div>
              <div className="skills-grid">
                {renderCategories.map((category) => {
                  const categorySkills = skillsByCategory[category] || [];
                  return (
                    <div className="skills-category-card stagger-item" key={category}>
                      <h3 className="category-title">
                        <span>{"//"}</span> {category}
                      </h3>
                      <div className="skills-pill-container">
                        {categorySkills.map((skill) => (
                          <div className="skill-pill" key={skill.id}>
                            {skill.icon && <span className="skill-icon">{skill.icon}</span>}
                            <span className="skill-name">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE & EDUCATION SECTION */}
        {(visibleExperiences.length > 0 || visibleEducations.length > 0) && (
          <section id="experience" style={{ borderBottom: "1px solid var(--line)" }} className="reveal-on-scroll">
            <div className="container" style={{ display: "grid", gridTemplateColumns: visibleExperiences.length > 0 && visibleEducations.length > 0 ? "1fr 1fr" : "1fr", gap: 60 }}>
              {/* Experiences */}
              {visibleExperiences.length > 0 && (
                <div>
                  <div className="section-label" style={{ marginBottom: 30 }}>04 / PROFESSIONAL TIMELINE</div>
                  <div style={{ display: "grid", gap: 40 }}>
                    {visibleExperiences.map((exp) => (
                      <div className="experience-card stagger-item" key={exp.id}>
                        <div className="timeline-dot" />
                        <div className="experience-meta">
                          <span className="experience-date">
                            {exp.start_date} — {exp.current ? "Present" : exp.end_date}
                          </span>
                          {exp.current && <span className="current-badge">Current Role</span>}
                        </div>
                        <h3 className="experience-title">{exp.job_title}</h3>
                        <h4 className="experience-company">
                          {exp.company} {exp.location && <span className="experience-location">· {exp.location}</span>}
                        </h4>
                        <p className="experience-desc">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educations */}
              {visibleEducations.length > 0 && (
                <div>
                  <div className="section-label" style={{ marginBottom: 30 }}>05 / ACADEMIC BACKGROUND</div>
                  <div style={{ display: "grid", gap: 40 }}>
                    {visibleEducations.map((edu) => (
                      <div className="experience-card education-card stagger-item" key={edu.id}>
                        <div className="timeline-dot education-dot" />
                        <div className="experience-meta">
                          <span className="experience-date">
                            {edu.start_year} — {edu.current ? "Present" : edu.end_year}
                          </span>
                        </div>
                        <h3 className="experience-title">{edu.degree}</h3>
                        <h4 className="experience-company">
                          {edu.institution} {edu.field_of_study && <span className="experience-location">({edu.field_of_study})</span>} {edu.location && <span className="experience-location">· {edu.location}</span>}
                        </h4>
                        <p className="experience-desc">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SERVICES SECTION */}
        {visibleServices.length > 0 && (
          <section id="services" className="section-dark reveal-on-scroll">
            <div className="container">
              <div className="section-heading">
                <div className="section-label">06 / SERVICES</div>
                <h2>CAPABILITIES.</h2>
                <p>Areas of specialization, custom services, and technical engineering solutions.</p>
              </div>

              <div className="services-grid">
                {visibleServices.map((ser, index) => {
                  const cardNumber = String(index + 1).padStart(2, "0");
                  return (
                    <div className="service-card stagger-item" key={ser.id}>
                      <div className="service-header">
                        <span className="service-number">{cardNumber}</span>
                        {ser.icon && <span className="service-icon-label">{ser.icon}</span>}
                      </div>
                      <h3 className="service-title">{ser.title}</h3>
                      <p className="service-desc">{ser.short_description}</p>
                      {ser.full_description && (
                        <p className="service-full-desc">{ser.full_description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* RESUME strip */}
        {profile.cv_url && (
          <section className="resume-strip reveal-on-scroll">
            <div className="container resume-inner">
              <div className="stagger-item">
                <div className="section-label">07 / RESUME</div>
                <h2>READY TO GO DEEPER?</h2>
              </div>
              <div className="actions stagger-item">
                <a className="btn" href={profile.cv_url} target="_blank" rel="noreferrer">View Resume ↗</a>
                <a className="btn primary" href={cvDownload}>Download CV ↓</a>
              </div>
            </div>
          </section>
        )}

        {/* CONTACT SECTION */}
        <section id="contact" className="contact-section reveal-on-scroll">
          <div className="container contact-premium-card">
            <div className="stagger-item">
              <div className="section-label">08 / CONTACT</div>
              <h2 className="contact-info-title">LET&apos;S BUILD<br /><span>SOMETHING GREAT.</span></h2>
              <p className="contact-info-desc">
                {(settings.contact_email || profile.email) ? "Have a project, product idea or automation challenge? Initialize transmission and start the conversation." : "Transmission channel is currently unconfigured."}
              </p>
              
              {profile.phone && (
                <div className="contact-detail-row">
                  <span className="contact-detail-label">Direct Communication</span>
                  <div className="contact-detail-value">{profile.phone}</div>
                </div>
              )}
            </div>

            {/* MESSAGE SUBMISSION FORM */}
            <form onSubmit={handleContactSubmit} className="contact-form stagger-item">
              <div className="contact-form-field">
                <label htmlFor="name-field">Name *</label>
                <input 
                  id="name-field" 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Your Name" 
                  required 
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="email-field">Email Address *</label>
                <input 
                  id="email-field" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="name@domain.com" 
                  required 
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="subject-field">Subject</label>
                <input 
                  id="subject-field" 
                  type="text" 
                  value={formData.subject} 
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })} 
                  placeholder="Project Proposal / Question" 
                />
              </div>
              <div className="contact-form-field">
                <label htmlFor="message-field">Message Content *</label>
                <textarea 
                  id="message-field" 
                  value={formData.message} 
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })} 
                  placeholder="Describe details of the project or message..." 
                  required 
                />
              </div>

              {formMsg && (
                <div className={`form-feedback-message ${formErr ? "error" : "success"}`}>
                  {formMsg}
                </div>
              )}

              <button 
                type="submit" 
                className="contact-submit-btn" 
                disabled={submitting}
              >
                {submitting ? "Transmitting..." : "Initialize Transmission ↗"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer
        brandName={profile.name || "Portfolio"}
        location={profile.location || undefined}
        githubUrl={profile.github || undefined}
        linkedinUrl={profile.linkedin || undefined}
      />
    </>
  );
}
