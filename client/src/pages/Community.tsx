/**
 * COMMUNITY — Find Your Tribe, Find Your Partner, Find Your Collaborator
 * 
 * Upload contacts, invite friends, discover connections.
 * The community platform for building an abundant future together.
 */

import { useState, useRef, useMemo, useEffect } from "react";
import {
  Section,
  FadeIn,
  Divider,
  Spacer,
  Eyebrow,
  NextPage,
} from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ── TYPES ── */

interface ContactRow {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  note: string;
}

const LOOKING_FOR_OPTIONS = [
  { value: "tribe", label: "My Tribe", desc: "People who share my values and vision" },
  { value: "partner", label: "Life Partner", desc: "Romantic connection built on depth" },
  { value: "business", label: "Business Partner", desc: "Co-founder, collaborator, investor" },
  { value: "mentor", label: "Mentor / Guide", desc: "Someone further along the path" },
  { value: "collaborator", label: "Creative Collaborator", desc: "Build something together" },
  { value: "community", label: "Community Builder", desc: "Organize, convene, connect" },
];

const INTEREST_TAGS = [
  "Consciousness", "Psychedelics", "Regenerative Medicine", "Longevity",
  "Impact Investing", "Web3", "Tokenization", "Climate", "Ocean Cleanup",
  "Relationships", "Biochemistry", "Meditation", "Sacred Geometry",
  "Consumer Advocacy", "Enterprise Tech", "AI", "Payments",
  "Writing", "Philosophy", "Kintsugi", "Music", "Art",
];

export default function Community() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "invite" | "members">("overview");

  // Profile state
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    bio: "",
    lookingFor: [] as string[],
    interests: [] as string[],
    location: "",
    website: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Contact upload state
  const [contacts, setContacts] = useState<ContactRow[]>([
    { name: "", email: "", phone: "", relationship: "", note: "" },
  ]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC queries
  const statsQuery = trpc.community.stats.useQuery();
  const profileQuery = trpc.community.myProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Populate profile form when data loads
  const [profileLoaded, setProfileLoaded] = useState(false);
  useEffect(() => {
    if (profileQuery.data && !profileLoaded) {
      setProfileForm({
        displayName: profileQuery.data.displayName || "",
        bio: profileQuery.data.bio || "",
        lookingFor: profileQuery.data.lookingFor ? JSON.parse(profileQuery.data.lookingFor) : [],
        interests: profileQuery.data.interests ? JSON.parse(profileQuery.data.interests) : [],
        location: profileQuery.data.location || "",
        website: profileQuery.data.website || "",
      });
      setProfileLoaded(true);
    }
  }, [profileQuery.data, profileLoaded]);
  const myContactsQuery = trpc.community.myContacts.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const membersQuery = trpc.community.members.useQuery(undefined);

  // Mutations
  const updateProfile = trpc.community.updateProfile.useMutation({
    onSuccess: () => {
      setProfileSaving(false);
      toast.success("Profile updated — your community profile has been saved.");
      profileQuery.refetch();
    },
    onError: () => setProfileSaving(false),
  });

  const uploadContactsMutation = trpc.community.uploadContacts.useMutation({
    onSuccess: (data: any) => {
      setUploading(false);
      toast.success(`${data.uploaded} contacts uploaded — you can now invite them to join.`);
      myContactsQuery.refetch();
      setContacts([{ name: "", email: "", phone: "", relationship: "", note: "" }]);
    },
    onError: () => setUploading(false),
  });

  const sendInviteMutation = trpc.community.sendInvite.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent — your friend will receive an invite.");
      myContactsQuery.refetch();
    },
  });

  const handleSaveProfile = () => {
    if (!profileForm.displayName.trim()) return;
    setProfileSaving(true);
    updateProfile.mutate(profileForm);
  };

  const handleUploadContacts = () => {
    const valid = contacts.filter(c => c.name.trim());
    if (valid.length === 0) return;
    setUploading(true);
    uploadContactsMutation.mutate({ contacts: valid });
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      // Parse CSV header
      const header = lines[0].toLowerCase().split(",").map(h => h.trim().replace(/"/g, ""));
      const nameIdx = header.findIndex(h => h.includes("name"));
      const emailIdx = header.findIndex(h => h.includes("email"));
      const phoneIdx = header.findIndex(h => h.includes("phone"));

      const parsed: ContactRow[] = [];
      for (let i = 1; i < lines.length && parsed.length < 500; i++) {
        const cols = lines[i].split(",").map(c => c.trim().replace(/"/g, ""));
        const name = cols[nameIdx >= 0 ? nameIdx : 0] || "";
        if (!name) continue;
        parsed.push({
          name,
          email: emailIdx >= 0 ? cols[emailIdx] || "" : "",
          phone: phoneIdx >= 0 ? cols[phoneIdx] || "" : "",
          relationship: "",
          note: "",
        });
      }
      if (parsed.length > 0) {
        setContacts(parsed);
        toast.success(`${parsed.length} contacts loaded from CSV — review and upload when ready.`);
      }
    };
    reader.readAsText(file);
  };

  const addContactRow = () => {
    setContacts(prev => [...prev, { name: "", email: "", phone: "", relationship: "", note: "" }]);
  };

  const updateContact = (idx: number, field: keyof ContactRow, value: string) => {
    setContacts(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const removeContact = (idx: number) => {
    setContacts(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleLookingFor = (value: string) => {
    setProfileForm(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter(v => v !== value)
        : [...prev.lookingFor, value],
    }));
  };

  const toggleInterest = (value: string) => {
    setProfileForm(prev => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter(v => v !== value)
        : [...prev.interests, value],
    }));
  };

  const stats = statsQuery.data || { members: 0, contacts: 0, invitations: 0 };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "0.95rem",
    color: "#222",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "4px",
    padding: "0.6rem 0.8rem",
    outline: "none",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: active ? "#0A0A10" : "#888",
    background: active ? "#D4B96A" : "transparent",
    border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
    padding: "0.6rem 1.2rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="Community | Tony Greenberg"
        description="Find your tribe, your partner, your collaborator. Upload contacts, invite friends, and build community toward an abundant future."
        path="/community"
        indexable={true}
      />

      {/* ── HERO ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1.2rem",
            }}
          >
            THE COMMUNITY
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: "#F5F0E0",
              lineHeight: 1.1,
              marginBottom: "1rem",
              maxWidth: "700px",
              margin: "0 auto 1rem",
            }}
          >
            Find Your Tribe. Build{" "}
            <em style={{ fontStyle: "normal" }} className="gold-shimmer">
              What's Next.
            </em>
          </h1>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "560px",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
            }}
          >
            Upload your contacts. Invite your people. Find your partner, your business collaborator, your tribe. Every great movement started with two people who shouldn't have met but did.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "clamp(2rem, 5vw, 4rem)",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: stats.members, label: "Members" },
              { value: stats.contacts, label: "Contacts Shared" },
              { value: stats.invitations, label: "Invitations Sent" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#D4B96A",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                    marginTop: "0.2rem",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── AUTH GATE ── */}
      {!isAuthenticated && !authLoading ? (
        <Section>
          <FadeIn>
            <div
              style={{
                textAlign: "center",
                maxWidth: "500px",
                margin: "0 auto",
                padding: "3rem 0",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: "#111",
                  marginBottom: "1rem",
                }}
              >
                Sign In to Join the Community
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#555",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                }}
              >
                Create your profile, upload contacts, invite friends, and start building your tribe. It takes 30 seconds.
              </p>
              <a
                href={getLoginUrl()}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#F5F0E0",
                  background: "#0A0A10",
                  textDecoration: "none",
                  padding: "0.9rem 2.5rem",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                Sign In →
              </a>
            </div>
          </FadeIn>
        </Section>
      ) : isAuthenticated ? (
        <>
          {/* ── TAB NAVIGATION ── */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "1.5rem clamp(1.5rem, 5vw, 4rem)",
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {(["overview", "contacts", "invite", "members"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={tabStyle(activeTab === tab)}
              >
                {tab === "overview" ? "My Profile" : tab === "contacts" ? "Upload Contacts" : tab === "invite" ? "Send Invites" : "Members"}
              </button>
            ))}
          </div>

          {/* ── PROFILE TAB ── */}
          {activeTab === "overview" && (
            <Section>
              <FadeIn>
                <Eyebrow>YOUR COMMUNITY PROFILE</Eyebrow>
                <div style={{ maxWidth: "600px" }}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={profileForm.displayName}
                      onChange={e => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                      placeholder={user?.name || "Your name"}
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                      placeholder="What brings you here? What are you building?"
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" as const }}
                    />
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      I'm Looking For...
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {LOOKING_FOR_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => toggleLookingFor(opt.value)}
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            color: profileForm.lookingFor.includes(opt.value) ? "#0A0A10" : "#555",
                            background: profileForm.lookingFor.includes(opt.value) ? "#D4B96A" : "#fff",
                            border: `1px solid ${profileForm.lookingFor.includes(opt.value) ? "#D4B96A" : "rgba(0,0,0,0.12)"}`,
                            padding: "0.4rem 0.8rem",
                            borderRadius: "20px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      Interests
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {INTEREST_TAGS.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleInterest(tag)}
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.68rem",
                            letterSpacing: "0.05em",
                            color: profileForm.interests.includes(tag) ? "#0A0A10" : "#666",
                            background: profileForm.interests.includes(tag) ? "rgba(212,185,106,0.2)" : "transparent",
                            border: `1px solid ${profileForm.interests.includes(tag) ? "#D4B96A" : "rgba(0,0,0,0.08)"}`,
                            padding: "0.3rem 0.6rem",
                            borderRadius: "3px",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>Location</label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))}
                        placeholder="City, Country"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>Website</label>
                      <input
                        type="text"
                        value={profileForm.website}
                        onChange={e => setProfileForm(p => ({ ...p, website: e.target.value }))}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={profileSaving || !profileForm.displayName.trim()}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.78rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#F5F0E0",
                      background: "#0A0A10",
                      border: "none",
                      padding: "0.8rem 2rem",
                      borderRadius: "4px",
                      cursor: profileSaving ? "wait" : "pointer",
                      opacity: profileSaving ? 0.6 : 1,
                    }}
                  >
                    {profileSaving ? "Saving..." : profileQuery.data ? "Update Profile" : "Create Profile"}
                  </button>
                </div>
              </FadeIn>
            </Section>
          )}

          {/* ── CONTACTS TAB ── */}
          {activeTab === "contacts" && (
            <Section>
              <FadeIn>
                <Eyebrow>UPLOAD YOUR CONTACTS</Eyebrow>
                <p style={{ fontSize: "1rem", color: "#444", lineHeight: 1.7, maxWidth: "600px", marginBottom: "1.5rem" }}>
                  Add 10 friends or upload your entire address book. Every connection you share strengthens the community. CSV files with name, email, and phone columns are supported.
                </p>

                {/* CSV Upload */}
                <div style={{ marginBottom: "2rem" }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                      background: "transparent",
                      border: "1px dashed #D4B96A",
                      padding: "1rem 2rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: "600px",
                      transition: "all 0.15s",
                    }}
                  >
                    📎 Upload CSV File (name, email, phone)
                  </button>
                </div>

                {/* Manual entry */}
                <div style={{ maxWidth: "800px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px 40px", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Name *</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Email</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Phone</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>Relation</div>
                    <div />
                  </div>
                  {contacts.map((c, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px 40px", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <input value={c.name} onChange={e => updateContact(i, "name", e.target.value)} placeholder="Name" style={{ ...inputStyle, fontSize: "0.85rem", padding: "0.5rem" }} />
                      <input value={c.email} onChange={e => updateContact(i, "email", e.target.value)} placeholder="email@..." style={{ ...inputStyle, fontSize: "0.85rem", padding: "0.5rem" }} />
                      <input value={c.phone} onChange={e => updateContact(i, "phone", e.target.value)} placeholder="+1..." style={{ ...inputStyle, fontSize: "0.85rem", padding: "0.5rem" }} />
                      <input value={c.relationship} onChange={e => updateContact(i, "relationship", e.target.value)} placeholder="Friend" style={{ ...inputStyle, fontSize: "0.85rem", padding: "0.5rem" }} />
                      <button onClick={() => removeContact(i)} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      onClick={addContactRow}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.72rem",
                        color: "#8B6914",
                        background: "transparent",
                        border: "1px solid rgba(139,105,20,0.3)",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      + Add Row
                    </button>
                    <button
                      onClick={handleUploadContacts}
                      disabled={uploading || contacts.filter(c => c.name.trim()).length === 0}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#F5F0E0",
                        background: "#0A0A10",
                        border: "none",
                        padding: "0.6rem 1.5rem",
                        borderRadius: "4px",
                        cursor: uploading ? "wait" : "pointer",
                        opacity: uploading ? 0.6 : 1,
                      }}
                    >
                      {uploading ? "Uploading..." : `Upload ${contacts.filter(c => c.name.trim()).length} Contacts`}
                    </button>
                  </div>
                </div>

                {/* Existing contacts */}
                {myContactsQuery.data && myContactsQuery.data.length > 0 && (
                  <div style={{ marginTop: "3rem" }}>
                    <Eyebrow>YOUR UPLOADED CONTACTS ({myContactsQuery.data.length})</Eyebrow>
                    <div style={{ maxWidth: "800px" }}>
                      {myContactsQuery.data.map((c: any) => (
                        <div
                          key={c.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.6rem 0",
                            borderBottom: "1px solid rgba(0,0,0,0.04)",
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{c.name}</span>
                            {c.email && <span style={{ color: "#888", marginLeft: "0.8rem", fontSize: "0.85rem" }}>{c.email}</span>}
                            {c.relationship && <span style={{ color: "#D4B96A", marginLeft: "0.8rem", fontSize: "0.75rem", fontFamily: "'DM Mono', monospace" }}>{c.relationship}</span>}
                          </div>
                          {c.email && !c.invited && (
                            <button
                              onClick={() => sendInviteMutation.mutate({ contactId: c.id, email: c.email })}
                              style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.65rem",
                                color: "#8B6914",
                                background: "transparent",
                                border: "1px solid rgba(139,105,20,0.3)",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "3px",
                                cursor: "pointer",
                              }}
                            >
                              Invite
                            </button>
                          )}
                          {c.invited && (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#2E8B57" }}>
                              Invited ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FadeIn>
            </Section>
          )}

          {/* ── INVITE TAB ── */}
          {activeTab === "invite" && (
            <Section>
              <FadeIn>
                <Eyebrow>SPREAD THE JOY, SPREAD THE LOVE</Eyebrow>
                <p style={{ fontSize: "1rem", color: "#444", lineHeight: 1.7, maxWidth: "600px", marginBottom: "2rem" }}>
                  Invite someone directly by email. They'll receive a personal invitation to join the community. Every person you invite strengthens the network for everyone.
                </p>

                <InviteForm onSend={(email, message) => sendInviteMutation.mutate({ email, message })} sending={sendInviteMutation.isPending} />
              </FadeIn>
            </Section>
          )}

          {/* ── MEMBERS TAB ── */}
          {activeTab === "members" && (
            <Section>
              <FadeIn>
                <Eyebrow>COMMUNITY MEMBERS</Eyebrow>
                {membersQuery.data && membersQuery.data.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "1.2rem",
                      maxWidth: "900px",
                    }}
                  >
                    {membersQuery.data.map((m: any) => (
                      <div
                        key={m.id}
                        style={{
                          background: "#fff",
                          border: "1px solid rgba(0,0,0,0.06)",
                          borderRadius: "6px",
                          padding: "1.2rem",
                        }}
                      >
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "#111", marginBottom: "0.3rem" }}>
                          {m.displayName}
                        </div>
                        {m.location && (
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#888", marginBottom: "0.5rem" }}>
                            {m.location}
                          </div>
                        )}
                        {m.bio && (
                          <p style={{ fontSize: "0.88rem", color: "#555", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                            {m.bio.length > 120 ? m.bio.slice(0, 120) + "..." : m.bio}
                          </p>
                        )}
                        {m.lookingFor && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                            {JSON.parse(m.lookingFor).map((lf: string) => (
                              <span
                                key={lf}
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.6rem",
                                  color: "#8B6914",
                                  background: "rgba(212,185,106,0.1)",
                                  padding: "0.15rem 0.4rem",
                                  borderRadius: "2px",
                                }}
                              >
                                {lf}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "1rem", color: "#888", fontStyle: "italic" }}>
                    No members yet. Be the first to create a profile and start building the community.
                  </p>
                )}
              </FadeIn>
            </Section>
          )}
        </>
      ) : null}

      <Spacer />

      {/* ── MANIFESTO LINK ── */}
      <div
        style={{
          background: "#0A0A10",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
          textAlign: "center",
        }}
      >
        <FadeIn>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
              fontStyle: "italic",
              color: "#F5F0E0",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.6,
            }}
          >
            "The best architecture is the one your community finishes for you."
          </div>
          <Link
            href="/living-declaration"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#D4B96A",
              textDecoration: "none",
            }}
          >
            Read the Manifesto →
          </Link>
        </FadeIn>
      </div>

      <Spacer />
      <NextPage href="/living-declaration" label="The Manifesto" />
    </div>
  );
}

/* ── INVITE FORM COMPONENT ── */

function InviteForm({ onSend, sending }: { onSend: (email: string, message: string) => void; sending: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!email.trim() || !email.includes("@")) return;
    onSend(email, message);
    setEmail("");
    setMessage("");
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "0.95rem",
    color: "#222",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: "4px",
    padding: "0.6rem 0.8rem",
    outline: "none",
    boxSizing: "border-box" as const,
    width: "100%",
  };

  return (
    <div style={{ maxWidth: "500px" }}>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>
          Their Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="friend@example.com"
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.3rem", fontSize: "0.9rem" }}>
          Personal Message (optional)
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Hey, I think you'd love this community..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" as const }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={sending || !email.includes("@")}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.78rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#F5F0E0",
          background: "#0A0A10",
          border: "none",
          padding: "0.8rem 2rem",
          borderRadius: "4px",
          cursor: sending ? "wait" : "pointer",
          opacity: sending ? 0.6 : 1,
        }}
      >
        {sending ? "Sending..." : "Send Invitation →"}
      </button>
    </div>
  );
}
