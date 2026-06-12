/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Eye, EyeOff, Sparkles, HelpCircle } from "lucide-react";
import { Child, Language } from "../types";
import { C, F, T, S } from "../utils/config";
import { MascotImage } from "./Onboarding";
import { sfx } from "../utils/audio";

interface ChildLoginScreenProps {
  onLoginSuccess: (child: Child) => void;
  onNavigateParentRegister: () => void;
  onBack: () => void;
  lang: Language;
  theme?: "light" | "dark";
}

export const ChildLoginScreen: React.FC<ChildLoginScreenProps> = ({
  onLoginSuccess,
  onNavigateParentRegister,
  onBack,
  lang,
  theme
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [parentWithGoogleChildren, setParentWithGoogleChildren] = useState<Child[] | null>(null);

  React.useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === "GOOGLE_OAUTH_SUCCESS" && event.data?.parent) {
        const payloadParent = event.data.parent;
        
        // Connect and sync locally
        const parents = JSON.parse(localStorage.getItem("clats_parents_v1") || "{}");
        const parentKey = payloadParent.email.toLowerCase().trim();
        
        const existingNode = parents[parentKey];
        if (existingNode && (!payloadParent.children || payloadParent.children.length === 0)) {
          payloadParent.children = existingNode.children || [];
        }

        parents[parentKey] = payloadParent;
        localStorage.setItem("clats_parents_v1", JSON.stringify(parents));

        const kids = payloadParent.children || [];
        if (kids.length === 0) {
          setErrorMsg("Verified Google account login successfully, but no student profiles were found. Please ask your parent to create an account first!");
        } else if (kids.length === 1) {
          sfx.playCoin();
          onLoginSuccess(kids[0]);
        } else {
          sfx.playCoin();
          setParentWithGoogleChildren(kids);
        }
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [onLoginSuccess]);

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(window.location.origin)}`);
      const data = await res.json();
      if (data && data.url) {
        const width = 500;
        const height = 620;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open(data.url, "CLATS Google OAuth", `width=${width},height=${height},left=${left},top=${top}`);
      } else {
        setErrorMsg("Failed to start Google Authentication flow.");
      }
    } catch (e) {
      setErrorMsg("Error initiating Google sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim()) {
      setErrorMsg("Please enter your Username or Parent's Gmail.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your PIN or password.");
      return;
    }

    setLoading(true);

    // Playful check delay
    setTimeout(() => {
      const parentData = S.getParents();
      let matchedChild: Child | null = null;
      let associatedChildren: Child[] = [];

      const normalizedQuery = username.trim().toLowerCase();
      const parentMatch = Object.values(parentData).find(
        (p: any) => p.email.trim().toLowerCase() === normalizedQuery
      );

      if (parentMatch) {
        // Dual Mode A: Parent Gmail + Student's Private PIN code
        if (parentMatch.children && Array.isArray(parentMatch.children)) {
          const matchedByPin = parentMatch.children.find(
            (c: any) => c.pin.trim() === password.trim()
          );
          if (matchedByPin) {
            matchedChild = matchedByPin;
          }
        }

        // Dual Mode B: Parent Gmail + Parent General Account Password
        if (!matchedChild && (parentMatch.password || "").trim() === password.trim()) {
          if (parentMatch.children && parentMatch.children.length > 0) {
            associatedChildren = parentMatch.children;
          } else {
            setErrorMsg("Your parent credentials are correct, but they have not completed enrolling any student profile yet!");
            setLoading(false);
            return;
          }
        }
      }

      // Dual Mode C: Fallback to direct Child Name + PIN login representation
      if (!matchedChild && associatedChildren.length === 0) {
        Object.values(parentData).forEach((p: any) => {
          if (p.children && Array.isArray(p.children)) {
            p.children.forEach((c: Child) => {
              if (
                c.name.trim().toLowerCase() === normalizedQuery &&
                c.pin.trim() === password.trim()
              ) {
                matchedChild = c;
              }
            });
          }
        });
      }

      if (matchedChild) {
        sfx.playCoin();
        onLoginSuccess(matchedChild);
      } else if (associatedChildren.length > 0) {
        sfx.playCoin();
        setParentWithGoogleChildren(associatedChildren);
      } else {
        sfx.playBuzzer();
        setErrorMsg("Incorrect credentials / PIN. Please try again or ask your parent!");
      }
      setLoading(false);
    }, 500);
  };

  const isDark = theme === "dark";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark 
          ? "linear-gradient(150deg, #0F172A 0%, #020617 80%)" 
          : "linear-gradient(165deg, #ECFDF5 0%, #F0FDFA 40%, #E0F2FE 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        transition: "all 0.3s ease"
      }}
    >
      {/* Back Button */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            color: isDark ? "#94A3B8" : "#475569",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 800,
            fontFamily: F.display,
            display: "flex",
            alignItems: "center",
            gap: 6,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            transition: "all 0.15s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#19C6C6";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDark ? "#94A3B8" : "#475569";
            e.currentTarget.style.transform = "none";
          }}
        >
          ← {T[lang].back}
        </button>
      </div>

      {/* Main card */}
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: isDark ? "#1E293B" : "#FFFFFF",
          borderRadius: 24,
          border: isDark ? "1.5px solid rgba(255, 255, 255, 0.08)" : "2px solid #19C6C6",
          boxShadow: isDark ? "0 12px 48px rgba(0,0,0,0.5)" : "0 16px 48px rgba(25, 198, 198, 0.12)",
          padding: "32px 28px",
          textAlign: "center",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          transition: "all 0.3s ease"
        }}
      >
        {/* Support characters header illustration */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 20,
            marginBottom: 20,
            marginTop: 4
          }}
        >
          <div
            style={{
              background: isDark ? "rgba(34, 211, 238, 0.08)" : "rgba(34, 211, 238, 0.12)",
              padding: 8,
              borderRadius: 20,
              border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(34, 211, 238, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90
            }}
          >
            <MascotImage character="kobe" height={80} />
          </div>
          <div
            style={{
              background: isDark ? "rgba(167, 139, 250, 0.08)" : "rgba(167, 139, 250, 0.12)",
              padding: 8,
              borderRadius: 20,
              border: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(167, 139, 250, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90
            }}
          >
            <MascotImage character="chibi" height={76} />
          </div>
        </div>

        {parentWithGoogleChildren ? (
          <div style={{ padding: "10px 0" }}>
            <h3 style={{ fontFamily: F.display, fontSize: 20, fontWeight: 900, color: isDark ? "#FFFFFF" : "#0F172A", marginBottom: 6 }}>
              Select Student Profile
            </h3>
            <p style={{ fontFamily: F.body, fontSize: 13, color: isDark ? "#94A3B8" : "#64748B", marginBottom: 24 }}>
              Choose your account to resume your learning quests & levels:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "20px 0" }}>
              {parentWithGoogleChildren.map((child: Child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => {
                    sfx.playCoin();
                    onLoginSuccess(child);
                  }}
                  style={{
                    background: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                    border: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                    borderRadius: 20,
                    padding: "20px 12px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.15s ease",
                    boxSizing: "border-box"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#19C6C6";
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(25, 198, 198, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: 38 }}>{child.avatar || "👦🏾"}</span>
                  <span style={{ fontFamily: F.display, fontSize: 15, fontWeight: 900, color: isDark ? "#FFF" : "#1E293B" }}>
                    {child.name}
                  </span>
                  <span style={{ fontSize: 11, fontFamily: F.mono, textTransform: "uppercase", color: "#19C6C6", fontWeight: 700 }}>
                    ✨ {child.xp} XP
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setParentWithGoogleChildren(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#19C6C6",
                fontFamily: F.display,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                marginTop: 10,
                textDecoration: "underline"
              }}
            >
              ← Back to login details
            </button>
          </div>
        ) : (
          <>
            {/* Heading */}
            <h2
              style={{
                fontFamily: F.display,
                fontSize: 28,
                fontWeight: 900,
                color: isDark ? "#FFFFFF" : "#0F172A",
                letterSpacing: "-0.02em",
                marginBottom: 6,
                marginTop: 0
              }}
            >
              Welcome Explorer!
            </h2>

            {/* Subheading */}
            <p
              style={{
                fontFamily: F.body,
                fontSize: 14,
                fontWeight: 500,
                color: isDark ? "#94A3B8" : "#475569",
                lineHeight: 1.5,
                margin: "0 auto 28px",
                maxWidth: 320
              }}
            >
              Log in to continue your learning journey.
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Username Field */}
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? C.stone : "#475569",
                    letterSpacing: 1.5,
                    textTransform: "uppercase"
                  }}
                >
                  Child Name or Parent's Gmail
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or parent's email"
                  autoFocus
                  style={{
                    width: "100%",
                    background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                    border: "2px solid " + (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"),
                    borderRadius: 14,
                    padding: "14px 16px",
                    fontFamily: F.body,
                    fontSize: 15,
                    color: isDark ? "#FFFFFF" : "#1E293B",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.15s ease"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#19C6C6";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(25, 198, 198, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password (PIN) Field */}
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  style={{
                    fontFamily: F.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: isDark ? C.stone : "#475569",
                    letterSpacing: 1.5,
                    textTransform: "uppercase"
                  }}
                >
                  PIN Code or Parent Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your PIN or password"
                    style={{
                      width: "100%",
                      background: isDark ? "rgba(0,0,0,0.35)" : "#F8FAFC",
                      border: "2px solid " + (isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"),
                      borderRadius: 14,
                      padding: "14px 44px 14px 16px",
                      fontFamily: F.body,
                      fontSize: 15,
                      color: isDark ? "#FFFFFF" : "#1E293B",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "all 0.15s ease"
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#19C6C6";
                      e.currentTarget.style.boxShadow = "0 0 12px rgba(25, 198, 198, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: isDark ? C.stone : "#64748B",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 4,
                      transition: "color 0.15s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#19C6C6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isDark ? C.stone : "#64748B")}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Verification Error */}
              {errorMsg && (
                <div
                  style={{
                    background: "rgba(244, 63, 94, 0.08)",
                    border: `1px solid ${C.red}`,
                    borderRadius: 12,
                    padding: "10px 14px",
                    textAlign: "left",
                    fontFamily: F.body,
                    fontSize: 13,
                    color: C.red,
                    fontWeight: 600,
                    lineHeight: 1.4
                  }}
                >
                  ⚠ {errorMsg}
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: "#19C6C6",
                  color: "#0A0A0B",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 20px",
                  fontFamily: F.display,
                  fontSize: 16,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 20px rgba(25, 198, 198, 0.25)",
                  transition: "all 0.15s ease",
                  marginTop: 4
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(25, 198, 198, 0.35)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(25, 198, 198, 0.25)";
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", margin: "8px 0", gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#64748B" : "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 }}>or</span>
                <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0" }} />
              </div>

              {/* google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                  width: "100%",
                  background: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                  borderRadius: "14px",
                  padding: "12px 16px",
                  color: isDark ? "#F8FAFC" : "#1E293B",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.15s ease",
                  boxSizing: "border-box"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.08)" : "#F8FAFC";
                  e.currentTarget.style.borderColor = "#19C6C6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF";
                  e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.86-3.577-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.125C18.29 1.84 15.54 1 12.24 1 6.12 1 1.16 5.925 1.16 12s4.96 11 11.08 11c6.39 0 10.63-4.49 10.63-10.84 0-.73-.08-1.285-.18-1.875h-10.45z"/>
                </svg>
                <span>Sign In with Parent's Google</span>
              </button>
            </form>
          </>
        )}

        {/* Secondary parent registration prompt link */}
        <div style={{ marginTop: 20 }}>
          <button
            type="button"
            onClick={() => {
              sfx.playTap();
              onNavigateParentRegister();
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#19C6C6",
              fontFamily: F.display,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s",
              textDecoration: "underline"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0891b2")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#19C6C6")}
          >
            My Parent Needs to Enroll Me
          </button>
        </div>

        {/* Separator Line */}
        <hr
          style={{
            border: "none",
            height: "1px",
            background: isDark ? "rgba(255,255,255,0.06)" : "#E2E8F0",
            margin: "24px 0 20px"
          }}
        />

        {/* Help Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: isDark ? "rgba(255,255,255,0.02)" : "#F1F5F9",
            borderRadius: 16,
            padding: "12px 14px",
            border: isDark ? "1px solid rgba(255,255,255,0.03)" : "1px solid #E2E8F0"
          }}
        >
          <HelpCircle size={18} style={{ color: isDark ? C.stone : "#64748B", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: F.body,
              fontSize: 12.5,
              fontWeight: 500,
              color: isDark ? C.stone : "#475569",
              lineHeight: 1.4,
              margin: 0,
              textAlign: "left"
            }}
          >
            <span style={{ color: isDark ? "#FFFFFF" : "#0F172A", fontWeight: 700 }}>
              Don't have a learning account yet?
            </span>{" "}
            Ask your parent or guardian to create one for you.
          </p>
        </div>
      </div>
    </div>
  );
};
