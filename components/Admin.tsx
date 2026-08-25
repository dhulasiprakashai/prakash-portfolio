"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Profile = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  availability: string;
  experience: string;
  about: string;
  avatar_url: string;
  hero_image_url: string;
  cv_url: string;
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
  tech: string[];
  image_url: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  problem: string;
  solution: string;
  features: string;
  architecture: string;
  screenshots: string[];
  challenges: string;
  results: string;
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

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
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
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  availability: "",
  experience: "",
  about: "",
  avatar_url: "",
  hero_image_url: "",
  cv_url: "",
};

const emptyAbout: About = {
  section_label: "01 / ABOUT",
  main_heading: "",
  short_intro: "",
  full_description: "",
  career_focus: "",
  published: true,
};

const emptyProject: Project = {
  id: "",
  title: "",
  slug: "",
  description: "",
  full_description: "",
  tech: [],
  image_url: "",
  live_url: "",
  github_url: "",
  featured: true,
  published: true,
  sort_order: 99,
  problem: "",
  solution: "",
  features: "",
  architecture: "",
  screenshots: [],
  challenges: "",
  results: "",
};

const emptySkill: Skill = {
  id: "",
  name: "",
  category: "Frontend",
  icon: "",
  sort_order: 99,
  published: true,
};

const emptyExperience: Experience = {
  id: "",
  job_title: "",
  company: "",
  location: "",
  description: "",
  start_date: "",
  end_date: "",
  current: false,
  sort_order: 99,
  published: true,
};

const emptyEducation: Education = {
  id: "",
  degree: "",
  institution: "",
  field_of_study: "",
  location: "",
  description: "",
  start_year: "",
  end_year: "",
  current: false,
  sort_order: 99,
  published: true,
};

const emptyService: Service = {
  id: "",
  title: "",
  short_description: "",
  full_description: "",
  icon: "",
  sort_order: 99,
  published: true,
};

const emptyStat: Stat = {
  id: "",
  label: "",
  value: "",
  description: "",
  sort_order: 99,
  published: true,
};

const emptySettings: Settings = {
  site_title: "",
  site_description: "",
  logo_text: "",
  footer_text: "",
  contact_email: "",
  social_links: {
    github: "",
    linkedin: "",
  },
  availability_status: "",
  maintenance_mode: false,
};

export default function Admin() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const [tab, setTab] = useState<
    | "dashboard"
    | "profile"
    | "about"
    | "projects"
    | "skills"
    | "experience"
    | "education"
    | "services"
    | "stats"
    | "messages"
    | "settings"
  >("dashboard");

  // State values
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [about, setAbout] = useState<About>(emptyAbout);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>(emptySettings);

  // Edit Forms
  const [projectForm, setProjectForm] = useState<Project>(emptyProject);
  const [skillForm, setSkillForm] = useState<Skill>(emptySkill);
  const [experienceForm, setExperienceForm] = useState<Experience>(emptyExperience);
  const [educationForm, setEducationForm] = useState<Education>(emptyEducation);
  const [serviceForm, setServiceForm] = useState<Service>(emptyService);
  const [statForm, setStatForm] = useState<Stat>(emptyStat);

  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Check auth session
  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setAuthLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock Bypass Login when Supabase is not configured
      setSession({ user: { email: "local-admin@mock.db" } });
      setAuthLoading(false);
    }
  }, []);

  // Fetch all CMS data upon authentication
  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  async function loadData() {
    setLoading(true);
    try {
      const headers = getHeaders();
      const fetchJson = async (url: string) => {
        const res = await fetch(url, { headers });
        if (res.ok) return res.json();
        throw new Error(`Failed to fetch ${url}`);
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
        messagesData,
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
        fetchJson("/api/messages"),
        fetchJson("/api/settings"),
      ]);

      if (profileData?.profile) setProfile(profileData.profile);
      if (aboutData?.about) setAbout(aboutData.about);
      if (projectsData?.projects) setProjects(projectsData.projects);
      if (skillsData?.skills) setSkills(skillsData.skills);
      if (experienceData?.experience) setExperienceList(experienceData.experience);
      if (educationData?.education) setEducationList(educationData.education);
      if (servicesData?.services) setServices(servicesData.services);
      if (statsData?.stats) setStats(statsData.stats);
      if (messagesData?.messages) setMessages(messagesData.messages);
      if (settingsData?.settings) setSettings(settingsData.settings);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      showToast("Error loading some dashboard datasets.");
    } finally {
      setLoading(false);
    }
  }

  function showToast(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(""), 4000);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoginMsg("Authenticating...");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoginMsg(error.message);
      } else {
        setSession(data.session);
        setLoginMsg("");
      }
    } catch (err: any) {
      setLoginMsg(err.message || "Failed to log in.");
    }
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
      setSession(null);
      showToast("Logged out successfully.");
    }
  }

  // Upload Handlers
  async function handleUpload(file: File, type: "avatar" | "hero" | "cv" | "project") {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const url = data?.url || data?.publicUrl;
        if (url) {
          updateURL(url);
          showToast("Upload completed successfully.");
          return;
        }
      }

      // Base64 fallback if upload fails or is unconfigured
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          updateURL(base64);
          showToast("Uploaded as offline Base64 URL.");
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showToast("File upload failed.");
    } finally {
      setUploading(false);
    }

    function updateURL(url: string) {
      if (type === "avatar") setProfile((p) => ({ ...p, avatar_url: url }));
      else if (type === "hero") setProfile((p) => ({ ...p, hero_image_url: url }));
      else if (type === "cv") setProfile((p) => ({ ...p, cv_url: url }));
      else if (type === "project") setProjectForm((p) => ({ ...p, image_url: url }));
    }
  }

  // CRUD actions helper
  async function sendRequest(url: string, method: "POST" | "PATCH" | "DELETE", body?: any) {
    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Operation failed.");
      throw err;
    }
  }

  // 1. SAVE PROFILE
  async function saveProfile() {
    try {
      await sendRequest("/api/profile", "POST", profile);
      showToast("Profile settings updated successfully.");
      await loadData();
    } catch (e) {}
  }

  // 2. SAVE ABOUT
  async function saveAbout() {
    try {
      await sendRequest("/api/about", "POST", about);
      showToast("About section content updated.");
      await loadData();
    } catch (e) {}
  }

  // 3. PROJECTS CRUD
  async function saveProject() {
    if (!projectForm.title.trim()) {
      showToast("Title is required.");
      return;
    }
    try {
      await sendRequest("/api/projects", "POST", projectForm);
      showToast(projectForm.id ? "Project updated." : "Project created successfully.");
      setProjectForm(emptyProject);
      await loadData();
    } catch (e) {}
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await sendRequest(`/api/projects/${id}`, "DELETE");
      showToast("Project deleted.");
      await loadData();
    } catch (e) {}
  }

  // 4. SKILLS CRUD
  async function saveSkill() {
    if (!skillForm.name.trim()) {
      showToast("Skill name is required.");
      return;
    }
    try {
      await sendRequest("/api/skills", "POST", skillForm);
      showToast(skillForm.id ? "Skill updated." : "Skill added successfully.");
      setSkillForm(emptySkill);
      await loadData();
    } catch (e) {}
  }

  async function deleteSkill(id: string) {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await sendRequest(`/api/skills/${id}`, "DELETE");
      showToast("Skill deleted.");
      await loadData();
    } catch (e) {}
  }

  // 5. EXPERIENCE CRUD
  async function saveExperience() {
    if (!experienceForm.job_title.trim() || !experienceForm.company.trim()) {
      showToast("Job title and Company are required.");
      return;
    }
    try {
      await sendRequest("/api/experience", "POST", experienceForm);
      showToast(experienceForm.id ? "Experience updated." : "Experience added.");
      setExperienceForm(emptyExperience);
      await loadData();
    } catch (e) {}
  }

  async function deleteExperience(id: string) {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await sendRequest(`/api/experience/${id}`, "DELETE");
      showToast("Experience deleted.");
      await loadData();
    } catch (e) {}
  }

  // 6. EDUCATION CRUD
  async function saveEducation() {
    if (!educationForm.degree.trim() || !educationForm.institution.trim()) {
      showToast("Degree and Institution are required.");
      return;
    }
    try {
      await sendRequest("/api/education", "POST", educationForm);
      showToast(educationForm.id ? "Education updated." : "Education record added.");
      setEducationForm(emptyEducation);
      await loadData();
    } catch (e) {}
  }

  async function deleteEducation(id: string) {
    if (!confirm("Are you sure you want to delete this education?")) return;
    try {
      await sendRequest(`/api/education/${id}`, "DELETE");
      showToast("Education record deleted.");
      await loadData();
    } catch (e) {}
  }

  // 7. SERVICES CRUD
  async function saveService() {
    if (!serviceForm.title.trim()) {
      showToast("Service title is required.");
      return;
    }
    try {
      await sendRequest("/api/services", "POST", serviceForm);
      showToast(serviceForm.id ? "Service updated." : "Service added.");
      setServiceForm(emptyService);
      await loadData();
    } catch (e) {}
  }

  async function deleteService(id: string) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await sendRequest(`/api/services/${id}`, "DELETE");
      showToast("Service deleted.");
      await loadData();
    } catch (e) {}
  }

  // 8. STATS CRUD
  async function saveStat() {
    if (!statForm.label.trim() || !statForm.value.trim()) {
      showToast("Label and Value are required.");
      return;
    }
    try {
      await sendRequest("/api/stats", "POST", statForm);
      showToast(statForm.id ? "Stat updated." : "Stat added.");
      setStatForm(emptyStat);
      await loadData();
    } catch (e) {}
  }

  async function deleteStat(id: string) {
    if (!confirm("Are you sure you want to delete this stat?")) return;
    try {
      await sendRequest(`/api/stats/${id}`, "DELETE");
      showToast("Stat deleted.");
      await loadData();
    } catch (e) {}
  }

  // 9. MESSAGES
  async function updateMessageStatus(id: string, status: "new" | "read" | "replied" | "archived") {
    try {
      await sendRequest(`/api/messages/${id}`, "PATCH", { status });
      showToast("Message status updated.");
      await loadData();
    } catch (e) {}
  }

  async function deleteMessage(id: string) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await sendRequest(`/api/messages/${id}`, "DELETE");
      showToast("Message deleted.");
      await loadData();
    } catch (e) {}
  }

  // 10. SETTINGS
  async function saveSettings() {
    try {
      await sendRequest("/api/settings", "POST", settings);
      showToast("Site settings updated successfully.");
      await loadData();
    } catch (e) {}
  }

  if (authLoading) {
    return (
      <div className="admin-shell" style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <div style={{ color: "#d4af37", fontSize: 13, letterSpacing: 2 }}>LOADING CMS SHELL...</div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!session) {
    return (
      <div className="admin-shell" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <form onSubmit={handleLogin} className="admin-card" style={{ width: "min(400px, 90%)", border: "1px solid var(--line)" }}>
          <div style={{ textAlign: "center", marginBottom: 25 }}>
            <span className="logo" style={{ margin: "0 auto 10px" }}>PS</span>
            <h1 style={{ fontFamily: "Space Grotesk", fontSize: 24, margin: 0, textTransform: "uppercase" }}>Admin Panel</h1>
            <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 5 }}>Sign in to manage portfolio content</p>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {loginMsg && (
              <div style={{ color: loginMsg.includes("Authenticating") ? "#d4af37" : "#ef4444", fontSize: 11, textAlign: "center", marginTop: 5 }}>
                {loginMsg}
              </div>
            )}

            <button type="submit" className="btn primary" style={{ width: "100%", marginTop: 10 }}>
              Authenticate
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {!supabase && (
        <div style={{ background: "#d4af37", color: "#000", padding: "8px 15px", fontSize: 11, fontWeight: "bold", textAlign: "center" }}>
          ⚠️ Supabase variables not detected in env. Saving changes to local fallback mock file (`mock-db.json`).
        </div>
      )}

      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className="sidebar" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <a className="brand" href="/">
              <span className="logo">PS</span>
              Admin
            </a>

            <div className="side-links">
              {(
                [
                  ["dashboard", "📊 Dashboard"],
                  ["profile", "👤 Profile"],
                  ["about", "ℹ️ About"],
                  ["projects", "📁 Projects"],
                  ["skills", "🛠️ Skills"],
                  ["experience", "💼 Experience"],
                  ["education", "🎓 Education"],
                  ["services", "⚡ Services"],
                  ["stats", "📈 Stats"],
                  ["messages", "✉️ Messages"],
                  ["settings", "⚙️ Settings"],
                ] as [typeof tab, string][]
              ).map(([key, label]) => (
                <button key={key} type="button" className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
            <a href="/" target="_blank" className="btn" style={{ fontSize: 10, minHeight: 38, padding: 8 }}>
              Open Portfolio ↗
            </a>
            <button type="button" className="btn danger" onClick={handleLogout} style={{ fontSize: 10, minHeight: 38, padding: 8, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="admin-main">
          <div className="admin-top">
            <div>
              <h1 style={{ textTransform: "uppercase" }}>{tab} Management</h1>
              <span style={{ color: "#758095", fontSize: 11 }}>
                Configure real metrics and details for the public website.
              </span>
            </div>

            {loading && <span style={{ color: "#d4af37", fontSize: 11 }}>Loading data...</span>}
          </div>

          {/* ================================================= */}
          {/* TAB 1: DASHBOARD */}
          {/* ================================================= */}
          {tab === "dashboard" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <div className="admin-card">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>PUBLISHED PROJECTS</span>
                  <h2 style={{ fontSize: 36, color: "var(--gold)", margin: "10px 0 0" }}>
                    {projects.filter((p) => p.published).length}
                  </h2>
                </div>
                <div className="admin-card">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>SKILLS CONFIGURED</span>
                  <h2 style={{ fontSize: 36, color: "var(--gold)", margin: "10px 0 0" }}>{skills.length}</h2>
                </div>
                <div className="admin-card">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>EXPERIENCE SLOTS</span>
                  <h2 style={{ fontSize: 36, color: "var(--gold)", margin: "10px 0 0" }}>{experienceList.length}</h2>
                </div>
                <div className="admin-card">
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>NEW MESSAGES</span>
                  <h2 style={{ fontSize: 36, color: "var(--gold)", margin: "10px 0 0" }}>
                    {messages.filter((m) => m.status === "new").length}
                  </h2>
                </div>
              </div>

              <div className="admin-card">
                <h2>Quick Overview & Status</h2>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                  Welcome to Prakash Portfolio CMS. Use the sidebar to update individual portfolio sections. All updates reflect instantly on the public portfolio index.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                  <button className="btn primary" onClick={() => setTab("profile")}>Edit Profile</button>
                  <button className="btn" onClick={() => setTab("projects")}>Add Project</button>
                  <button className="btn" onClick={() => setTab("messages")}>View Inbox</button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 2: PROFILE */}
          {/* ================================================= */}
          {tab === "profile" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>Profile Details</h2>
                <div className="form-grid">
                  {(
                    [
                      ["name", "Name"],
                      ["headline", "Headline"],
                      ["email", "Public Email"],
                      ["phone", "Phone Number"],
                      ["location", "Location / Address"],
                      ["github", "GitHub URL"],
                      ["linkedin", "LinkedIn URL"],
                      ["availability", "Availability Status"],
                      ["experience", "Overall Experience Years"],
                    ] as [keyof Profile, string][]
                  ).map(([key, label]) => (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      <input
                        value={String(profile[key] ?? "")}
                        onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      />
                    </div>
                  ))}

                  <div className="field">
                    <label>Short Biography / About Profile</label>
                    <textarea
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn primary" onClick={saveProfile}>
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Media Uploads</h2>
                <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 20 }}>
                  Select files to upload (Max size 5MB). In offline mode, files are converted to Local Base64 preview URLs.
                </p>

                <div className="form-grid" style={{ gap: 25 }}>
                  {/* Avatar Upload */}
                  <div className="upload">
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "avatar")} />
                    <div style={{ marginTop: 8 }}>Upload Avatar Image</div>
                    {profile.avatar_url && <img className="preview" src={profile.avatar_url} alt="Profile Avatar" />}
                  </div>

                  {/* Hero Image Upload */}
                  <div className="upload">
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "hero")} />
                    <div style={{ marginTop: 8 }}>Upload Hero Graphic / About Visual</div>
                    {profile.hero_image_url && <img className="preview" src={profile.hero_image_url} alt="About Graphic" />}
                  </div>

                  {/* CV Upload */}
                  <div className="upload">
                    <input type="file" accept=".pdf,application/pdf" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "cv")} />
                    <div style={{ marginTop: 8 }}>Upload CV/Resume PDF</div>
                    {profile.cv_url && (
                      <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "center" }}>
                        <a className="btn" href={profile.cv_url} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", minHeight: 34 }}>View PDF</a>
                      </div>
                    )}
                  </div>

                  {uploading && <div style={{ color: "var(--gold)", fontSize: 11 }}>Uploading file...</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 3: ABOUT */}
          {/* ================================================= */}
          {tab === "about" && (
            <div className="admin-card" style={{ maxWidth: 800 }}>
              <h2>Edit About Section Details</h2>
              <div className="form-grid">
                <div className="field">
                  <label>Section Index Label</label>
                  <input value={about.section_label} onChange={(e) => setAbout({ ...about, section_label: e.target.value })} />
                </div>
                <div className="field">
                  <label>Main Section Heading</label>
                  <input value={about.main_heading} onChange={(e) => setAbout({ ...about, main_heading: e.target.value })} />
                </div>
                <div className="field">
                  <label>Short Introduction Text</label>
                  <input value={about.short_intro} onChange={(e) => setAbout({ ...about, short_intro: e.target.value })} />
                </div>
                <div className="field">
                  <label>Full About Description</label>
                  <textarea value={about.full_description} onChange={(e) => setAbout({ ...about, full_description: e.target.value })} />
                </div>
                <div className="field">
                  <label>Career Focus Description</label>
                  <textarea value={about.career_focus} onChange={(e) => setAbout({ ...about, career_focus: e.target.value })} />
                </div>

                <div className="field" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="checkbox" checked={about.published} id="about_pub" onChange={(e) => setAbout({ ...about, published: e.target.checked })} style={{ width: "auto" }} />
                  <label htmlFor="about_pub" style={{ margin: 0, cursor: "pointer" }}>Make this section visible on portfolio</label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn primary" onClick={saveAbout}>
                    Save About Content
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 4: PROJECTS */}
          {/* ================================================= */}
          {tab === "projects" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{projectForm.id ? "Edit Project" : "Add Project"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Title *</label>
                    <input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Slug (URL identifier)</label>
                    <input value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} placeholder="e.g. cloud-crm" />
                  </div>
                  <div className="field">
                    <label>Short Description (Kicker)</label>
                    <input value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Full Case Study Description</label>
                    <textarea value={projectForm.full_description} onChange={(e) => setProjectForm({ ...projectForm, full_description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Technologies (Comma Separated)</label>
                    <input
                      value={projectForm.tech.join(", ")}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="React, Next.js, Postgres"
                    />
                  </div>

                  <div className="upload">
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], "project")} />
                    <div style={{ marginTop: 8 }}>Upload Project Banner</div>
                    {projectForm.image_url && <img className="preview" src={projectForm.image_url} alt="Banner Preview" />}
                  </div>

                  <div className="field">
                    <label>Live Demo URL</label>
                    <input value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>GitHub Code URL</label>
                    <input value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Case Study Problem Statement</label>
                    <textarea value={projectForm.problem || ""} onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })} placeholder="Describe the challenges or user problem statement..." />
                  </div>
                  <div className="field">
                    <label>Case Study Proposed Solution</label>
                    <textarea value={projectForm.solution || ""} onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })} placeholder="Describe the solution architecture and engineering approach..." />
                  </div>
                  <div className="field">
                    <label>Key Product Features</label>
                    <textarea value={projectForm.features || ""} onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })} placeholder="List core user features..." />
                  </div>
                  <div className="field">
                    <label>System Architecture Details</label>
                    <textarea value={projectForm.architecture || ""} onChange={(e) => setProjectForm({ ...projectForm, architecture: e.target.value })} placeholder="Describe databases, APIs, scaling, or infrastructure..." />
                  </div>
                  <div className="field">
                    <label>Case Study Screenshots (Comma Separated URLs)</label>
                    <input
                      value={projectForm.screenshots?.join(", ") || ""}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          screenshots: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="https://image1.png, https://image2.png"
                    />
                  </div>
                  <div className="field">
                    <label>Engineering Challenges Overcome</label>
                    <textarea value={projectForm.challenges || ""} onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })} placeholder="Describe performance, integration, or deployment bugs solved..." />
                  </div>
                  <div className="field">
                    <label>Business Results & Metrics</label>
                    <textarea value={projectForm.results || ""} onChange={(e) => setProjectForm({ ...projectForm, results: e.target.value })} placeholder="List load speeds, conversion rate jumps, or cost savings..." />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={projectForm.sort_order} onChange={(e) => setProjectForm({ ...projectForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>

                  <div style={{ display: "flex", gap: 20 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, cursor: "pointer" }}>
                      <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} style={{ width: "auto" }} />
                      Featured Project
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, cursor: "pointer" }}>
                      <input type="checkbox" checked={projectForm.published} onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })} style={{ width: "auto" }} />
                      Published (Publicly Visible)
                    </label>
                  </div>

                  <div className="form-actions">
                    {projectForm.id && (
                      <button type="button" className="btn" onClick={() => setProjectForm(emptyProject)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveProject}>
                      {projectForm.id ? "Update Project" : "Add Project"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Project List ({projects.length})</h2>
                <div className="project-list" style={{ marginTop: 15 }}>
                  {projects.map((p) => (
                    <div className="project-row" key={p.id}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} />
                      ) : (
                        <div style={{ width: 70, height: 50, background: "#111", border: "1px solid var(--line)" }} />
                      )}
                      <div className="grow">
                        <b>{p.title}</b>
                        <span style={{ fontSize: 10 }}>
                          Order: {p.sort_order} · {p.published ? "Published" : "Draft"} · {p.featured ? "Featured" : "Standard"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button type="button" className="btn" onClick={() => setProjectForm(p)} style={{ minHeight: 32, padding: "5px 10px", fontSize: 10 }}>
                          Edit
                        </button>
                        <button type="button" className="btn danger" onClick={() => deleteProject(p.id)} style={{ minHeight: 32, padding: "5px 10px", fontSize: 10, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && <div className="empty-state">No projects loaded yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 5: SKILLS */}
          {/* ================================================= */}
          {tab === "skills" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{skillForm.id ? "Edit Skill" : "Add Skill"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Skill Name *</label>
                    <input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. Next.js" />
                  </div>
                  <div className="field">
                    <label>Category Group</label>
                    <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                      <option value="AI & Automation">AI & Automation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Icon identifier (optional)</label>
                    <input value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} placeholder="e.g. react-icon" />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={skillForm.sort_order} onChange={(e) => setSkillForm({ ...skillForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={skillForm.published} id="skill_pub" onChange={(e) => setSkillForm({ ...skillForm, published: e.target.checked })} style={{ width: "auto" }} />
                    <label htmlFor="skill_pub" style={{ margin: 0, cursor: "pointer" }}>Published / Visible</label>
                  </div>

                  <div className="form-actions">
                    {skillForm.id && (
                      <button type="button" className="btn" onClick={() => setSkillForm(emptySkill)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveSkill}>
                      {skillForm.id ? "Update Skill" : "Add Skill"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Toolkit Skills ({skills.length})</h2>
                <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                  {skills.map((s) => (
                    <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, border: "1px solid var(--line)", background: "#0c0c0c" }}>
                      <div>
                        <strong>{s.name}</strong>
                        <span style={{ display: "block", color: "var(--muted)", fontSize: 10 }}>
                          Category: {s.category} | Order: {s.sort_order} | {s.published ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button type="button" className="btn" onClick={() => setSkillForm(s)} style={{ minHeight: 32, padding: "5px 10px", fontSize: 10 }}>
                          Edit
                        </button>
                        <button type="button" className="btn danger" onClick={() => deleteSkill(s.id)} style={{ minHeight: 32, padding: "5px 10px", fontSize: 10, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {skills.length === 0 && <div className="empty-state">No skills available yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 6: EXPERIENCE */}
          {/* ================================================= */}
          {tab === "experience" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{experienceForm.id ? "Edit Experience" : "Add Experience"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Job Title *</label>
                    <input value={experienceForm.job_title} onChange={(e) => setExperienceForm({ ...experienceForm, job_title: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Company *</label>
                    <input value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Start Date</label>
                    <input value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} placeholder="e.g. Jan 2023" />
                  </div>
                  <div className="field">
                    <label>End Date</label>
                    <input value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} placeholder="e.g. Present" disabled={experienceForm.current} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={experienceForm.current} id="exp_curr" onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked, end_date: e.target.checked ? "Present" : "" })} style={{ width: "auto" }} />
                    <label htmlFor="exp_curr" style={{ margin: 0, cursor: "pointer" }}>Current Position</label>
                  </div>
                  <div className="field">
                    <label>Description / Achievements</label>
                    <textarea value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={experienceForm.sort_order} onChange={(e) => setExperienceForm({ ...experienceForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={experienceForm.published} id="exp_pub" onChange={(e) => setExperienceForm({ ...experienceForm, published: e.target.checked })} style={{ width: "auto" }} />
                    <label htmlFor="exp_pub" style={{ margin: 0, cursor: "pointer" }}>Published</label>
                  </div>

                  <div className="form-actions">
                    {experienceForm.id && (
                      <button type="button" className="btn" onClick={() => setExperienceForm(emptyExperience)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveExperience}>
                      {experienceForm.id ? "Update Experience" : "Add Experience"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Experience Record List ({experienceList.length})</h2>
                <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                  {experienceList.map((e) => (
                    <div key={e.id} style={{ padding: 12, border: "1px solid var(--line)", background: "#0c0c0c" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "var(--gold)" }}>{e.job_title}</strong>
                          <div style={{ fontSize: 11, fontWeight: "bold" }}>{e.company} <span style={{ color: "var(--muted)", fontWeight: "normal" }}>({e.location})</span></div>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{e.start_date} - {e.end_date}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" className="btn" onClick={() => setExperienceForm(e)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9 }}>Edit</button>
                          <button type="button" className="btn danger" onClick={() => deleteExperience(e.id)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {experienceList.length === 0 && <div className="empty-state">No experience cards loaded.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 7: EDUCATION */}
          {/* ================================================= */}
          {tab === "education" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{educationForm.id ? "Edit Education" : "Add Education"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Degree / Qualification *</label>
                    <input value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} placeholder="e.g. Bachelor of Technology" />
                  </div>
                  <div className="field">
                    <label>Institution / University *</label>
                    <input value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Field of Study</label>
                    <input value={educationForm.field_of_study} onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })} placeholder="e.g. Computer Science" />
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input value={educationForm.location} onChange={(e) => setEducationForm({ ...educationForm, location: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Start Year</label>
                    <input value={educationForm.start_year} onChange={(e) => setEducationForm({ ...educationForm, start_year: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>End Year</label>
                    <input value={educationForm.end_year} onChange={(e) => setEducationForm({ ...educationForm, end_year: e.target.value })} disabled={educationForm.current} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={educationForm.current} id="edu_curr" onChange={(e) => setEducationForm({ ...educationForm, current: e.target.checked, end_year: e.target.checked ? "Present" : "" })} style={{ width: "auto" }} />
                    <label htmlFor="edu_curr" style={{ margin: 0, cursor: "pointer" }}>Currently Enrolled</label>
                  </div>
                  <div className="field">
                    <label>Description / Extra Details</label>
                    <textarea value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={educationForm.sort_order} onChange={(e) => setEducationForm({ ...educationForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={educationForm.published} id="edu_pub" onChange={(e) => setEducationForm({ ...educationForm, published: e.target.checked })} style={{ width: "auto" }} />
                    <label htmlFor="edu_pub" style={{ margin: 0, cursor: "pointer" }}>Published</label>
                  </div>

                  <div className="form-actions">
                    {educationForm.id && (
                      <button type="button" className="btn" onClick={() => setEducationForm(emptyEducation)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveEducation}>
                      {educationForm.id ? "Update Education" : "Add Education"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Education List ({educationList.length})</h2>
                <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                  {educationList.map((e) => (
                    <div key={e.id} style={{ padding: 12, border: "1px solid var(--line)", background: "#0c0c0c" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "var(--gold)" }}>{e.degree}</strong>
                          <div style={{ fontSize: 11, fontWeight: "bold" }}>{e.institution} <span style={{ color: "var(--muted)", fontWeight: "normal" }}>({e.location})</span></div>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{e.start_year} - {e.end_year}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" className="btn" onClick={() => setEducationForm(e)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9 }}>Edit</button>
                          <button type="button" className="btn danger" onClick={() => deleteEducation(e.id)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {educationList.length === 0 && <div className="empty-state">No education records loaded.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 8: SERVICES */}
          {/* ================================================= */}
          {tab === "services" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{serviceForm.id ? "Edit Service" : "Add Service"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Service Title *</label>
                    <input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="e.g. Full Stack Development" />
                  </div>
                  <div className="field">
                    <label>Short Description (Public text)</label>
                    <input value={serviceForm.short_description} onChange={(e) => setServiceForm({ ...serviceForm, short_description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Full Service Capabilities</label>
                    <textarea value={serviceForm.full_description} onChange={(e) => setServiceForm({ ...serviceForm, full_description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Icon identifier (optional)</label>
                    <input value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} placeholder="e.g. dev-icon" />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={serviceForm.sort_order} onChange={(e) => setServiceForm({ ...serviceForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={serviceForm.published} id="serv_pub" onChange={(e) => setServiceForm({ ...serviceForm, published: e.target.checked })} style={{ width: "auto" }} />
                    <label htmlFor="serv_pub" style={{ margin: 0, cursor: "pointer" }}>Published</label>
                  </div>

                  <div className="form-actions">
                    {serviceForm.id && (
                      <button type="button" className="btn" onClick={() => setServiceForm(emptyService)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveService}>
                      {serviceForm.id ? "Update Service" : "Add Service"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Services Directory ({services.length})</h2>
                <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                  {services.map((s) => (
                    <div key={s.id} style={{ padding: 12, border: "1px solid var(--line)", background: "#0c0c0c" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <strong style={{ fontSize: 13, color: "var(--gold)" }}>{s.title}</strong>
                          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{s.short_description}</div>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button type="button" className="btn" onClick={() => setServiceForm(s)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9 }}>Edit</button>
                          <button type="button" className="btn danger" onClick={() => deleteService(s.id)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && <div className="empty-state">No services added.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 9: STATS */}
          {/* ================================================= */}
          {tab === "stats" && (
            <div className="admin-grid">
              <div className="admin-card">
                <h2>{statForm.id ? "Edit Stat" : "Add Stat"}</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Stat Metric Label *</label>
                    <input value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} placeholder="e.g. Happy Clients" />
                  </div>
                  <div className="field">
                    <label>Stat Value *</label>
                    <input value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} placeholder="e.g. 50+" />
                  </div>
                  <div className="field">
                    <label>Optional Description</label>
                    <input value={statForm.description} onChange={(e) => setStatForm({ ...statForm, description: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Display Sort Order</label>
                    <input type="number" value={statForm.sort_order} onChange={(e) => setStatForm({ ...statForm, sort_order: parseInt(e.target.value) || 99 })} />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <input type="checkbox" checked={statForm.published} id="stat_pub" onChange={(e) => setStatForm({ ...statForm, published: e.target.checked })} style={{ width: "auto" }} />
                    <label htmlFor="stat_pub" style={{ margin: 0, cursor: "pointer" }}>Published</label>
                  </div>

                  <div className="form-actions">
                    {statForm.id && (
                      <button type="button" className="btn" onClick={() => setStatForm(emptyStat)}>
                        Cancel
                      </button>
                    )}
                    <button type="button" className="btn primary" onClick={saveStat}>
                      {statForm.id ? "Update Stat" : "Add Stat"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Stats List ({stats.length})</h2>
                <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
                  {stats.map((s) => (
                    <div key={s.id} style={{ padding: 12, border: "1px solid var(--line)", background: "#0c0c0c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ fontSize: 18, color: "var(--gold)" }}>{s.value}</strong>
                        <span style={{ marginLeft: 10, fontSize: 12 }}>{s.label}</span>
                      </div>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button type="button" className="btn" onClick={() => setStatForm(s)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9 }}>Edit</button>
                        <button type="button" className="btn danger" onClick={() => deleteStat(s.id)} style={{ minHeight: 30, padding: "4px 8px", fontSize: 9, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {stats.length === 0 && <div className="empty-state">No custom stats configured yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 10: MESSAGES */}
          {/* ================================================= */}
          {tab === "messages" && (
            <div className="admin-card">
              <h2>Guest Messages Inbox ({messages.length})</h2>
              <div style={{ marginTop: 20, display: "grid", gap: 15 }}>
                {messages.map((m) => (
                  <div key={m.id} style={{ border: "1px solid var(--line)", padding: 18, background: "#0c0c0c" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div>
                        <strong style={{ fontSize: 14 }}>{m.name}</strong>{" "}
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>({m.email})</span>
                        <div style={{ fontSize: 11, color: "var(--gold)", marginTop: 2, fontWeight: "500" }}>
                          Subject: {m.subject}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                        <select
                          value={m.status}
                          onChange={(e) => updateMessageStatus(m.id, e.target.value as any)}
                          style={{
                            background: "#050505",
                            color: m.status === "new" ? "var(--gold)" : "#fff",
                            border: "1px solid var(--line)",
                            fontSize: 10,
                            padding: "4px 8px",
                            outline: "none",
                          }}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          type="button"
                          className="btn danger"
                          onClick={() => deleteMessage(m.id)}
                          style={{ minHeight: 26, padding: "4px 8px", fontSize: 9, background: "#ef4444", color: "#fff", borderColor: "#ef4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p style={{ color: "var(--text)", fontSize: 12, margin: "12px 0 6px", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {m.message}
                    </p>

                    <div style={{ textAlign: "right", fontSize: 9, color: "var(--muted)" }}>
                      Submitted: {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <div className="empty-state">No messages in inbox.</div>}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* TAB 11: SETTINGS */}
          {/* ================================================= */}
          {tab === "settings" && (
            <div className="admin-card" style={{ maxWidth: 800 }}>
              <h2>Site Configurations</h2>
              <div className="form-grid">
                <div className="field">
                  <label>Site Title</label>
                  <input value={settings.site_title} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} />
                </div>
                <div className="field">
                  <label>Site Meta Description</label>
                  <textarea value={settings.site_description} onChange={(e) => setSettings({ ...settings, site_description: e.target.value })} />
                </div>
                <div className="field">
                  <label>Logo Text</label>
                  <input value={settings.logo_text} onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })} />
                </div>
                <div className="field">
                  <label>Footer Copyright Text</label>
                  <input value={settings.footer_text} onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })} />
                </div>
                <div className="field">
                  <label>Primary Contact Email</label>
                  <input value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} />
                </div>

                <div className="field">
                  <label>GitHub Social URL</label>
                  <input
                    value={settings.social_links?.github || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, github: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="field">
                  <label>LinkedIn Social URL</label>
                  <input
                    value={settings.social_links?.linkedin || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, linkedin: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="field">
                  <label>Availability Announcement</label>
                  <input value={settings.availability_status} onChange={(e) => setSettings({ ...settings, availability_status: e.target.value })} placeholder="Available for work" />
                </div>

                <div className="field" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input type="checkbox" checked={settings.maintenance_mode} id="maint_mode" onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })} style={{ width: "auto" }} />
                  <label htmlFor="maint_mode" style={{ margin: 0, cursor: "pointer" }}>Enable Site Maintenance Mode</label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn primary" onClick={saveSettings}>
                    Save Configurations
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {msg && <div className="toast">{msg}</div>}
    </div>
  );
}