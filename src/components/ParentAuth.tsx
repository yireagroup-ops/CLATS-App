/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Parent, Language } from "../types";
import { T, C, getDeviceInfo, detectAndStoreLocation } from "../utils/config";
import { Card, FieldInput, Btn, Txt, Heading, Label } from "./Primitives";
import { CLATSLogo } from "./CLATSLogo";

interface ParentAuthScreenProps {
  mode: "login" | "register";
  onAuth: (p: Parent) => void;
  onBack: () => void;
  lang: Language;
  theme?: "light" | "dark";
}

export const ParentAuthScreen: React.FC<ParentAuthScreenProps> = ({
  mode = "login",
  onAuth,
  onBack,
  lang,
  theme
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  
  const [currentMode, setCurrentMode] = useState<"login" | "register">(mode);
  const [googleLoading, setGoogleLoading] = useState(false);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  React.useEffect(() => {
    const handleMsg = (event: MessageEvent) => {
      if (event.data?.type === "GOOGLE_OAUTH_SUCCESS" && event.data?.parent) {
        const payloadParent = event.data.parent;
        // Connect and sync
        localStorage.setItem("clats_sess_v1", JSON.stringify({ type: "parent", email: payloadParent.email.toLowerCase().trim() }));
        
        // Run location and timezone background tracker for dynamic profiling
        detectAndStoreLocation(payloadParent.email);

        onAuth(payloadParent);
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [onAuth]);

  const handleGoogleLogin = async () => {
    setErr("");
    setGoogleLoading(true);
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
        setErr("Failed to start Google Authentication flow.");
      }
    } catch (e) {
      setErr("Error initiating Google sign in.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const isLogin = currentMode === "login";
  const isDark = theme === "dark";
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr("");
    if (!email.includes("@")) {
      setErr("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (!isLogin && !name.trim()) {
      setErr("Enter your name.");
      return;
    }

    setLoading(true);
    try {
      // Direct integration with Supabase (Required)
      const endpoint = isLogin 
        ? "/api/supabase/auth/login" 
        : "/api/supabase/auth/register";

      const { browser, device } = getDeviceInfo();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";

      const authRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, device, browser, timezone })
      });

      // Try to parse the response as JSON (if Vercel returns HTML it will throw here)
      const rawText = await authRes.text();
      let authData: any = null;
      try {
        authData = JSON.parse(rawText);
      } catch {
        // Response wasn't JSON (likely a Vercel/server error page)
        console.error(`Server returned non-JSON (HTTP ${authRes.status}):`, rawText.substring(0, 500));
        setErr(`Server error (HTTP ${authRes.status}). The API function may have crashed. Check Vercel logs.`);
        setLoading(false);
        return;
      }

      if (authRes.ok && authData && authData.ok) {
        // Success! Set session token
        const parentKey = email.toLowerCase().trim();
        localStorage.setItem("clats_sess_v1", JSON.stringify({ type: "parent", email: parentKey }));

        // Run location and timezone background tracker to catch telemetry metrics
        detectAndStoreLocation(email);

        setLoading(false);
        onAuth(authData.parent as Parent);
        return;
      } else {
        setErr((authData && authData.msg) || `Authentication failed (HTTP ${authRes.status}).`);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Cloud Auth Error:", e);
      setErr("Failed to connect to the authentication server.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark 
          ? "linear-gradient(160deg, #0F172A 0%, #020617 100%)" 
          : "linear-gradient(165deg, #ECFDF5 0%, #F0FDFA 40%, #E0F2FE 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 20px",
        transition: "all 0.3s ease"
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <CLATSLogo height={56} style={{ filter: "drop-shadow(0 4px 12px rgba(25,198,198,0.15))" }} />
          <Txt
            size={11}
            color={isDark ? "#94A3B8" : "#475569"}
            style={{ letterSpacing: 2, textTransform: "uppercase", display: "block", marginTop: 6, fontWeight: 700 }}
          >
            {T[lang].tagline}
          </Txt>
        </div>
        <Card
          pad={28}
          style={isDark 
            ? { background: "#1E293B", borderColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 12px 40px rgba(0,0,0,0.3)" } 
            : { background: "#FFFFFF", borderColor: "#19C6C6", borderWidth: "2px", borderStyle: "solid", boxShadow: "0 16px 48px rgba(25, 198, 198, 0.12)" }
          }
        >
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "#19C6C6",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 16,
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            ← {T[lang].back}
          </button>
          <Heading
            size={22}
            color={isDark ? "#FFFFFF" : "#0F172A"}
            style={{ marginBottom: 6, fontWeight: 900 }}
          >
            {isLogin ? T[lang].welcomeBack : (lang === "en" ? "Create Your Account" : T[lang].createAccount)}
          </Heading>
          {isLogin ? (
            <Txt size={13.5} color={isDark ? "#94A3B8" : "#475569"} style={{ display: "block", marginBottom: 20 }}>
              Don't have an account?{" "}
              <span
                onClick={() => setCurrentMode("register")}
                style={{
                  color: "#19C6C6",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontWeight: 700
                }}
              >
                Sign Up
              </span>
            </Txt>
          ) : (
            <Txt size={13.5} color={isDark ? "#94A3B8" : "#475569"} style={{ display: "block", marginBottom: 20 }}>
              Already have an account?{" "}
              <span
                onClick={() => setCurrentMode("login")}
                style={{
                  color: "#19C6C6",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontWeight: 700
                }}
              >
                Sign In
              </span>
            </Txt>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {!isLogin && (
              <FieldInput
                label="Your Name"
                value={name}
                onChange={setName}
                placeholder="First and last name"
                theme={theme}
              />
            )}
            <FieldInput
              label="Email Address"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="parent@example.com"
              theme={theme}
            />
            <FieldInput
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder={isLogin ? "Your password" : "Create a password (6+ characters)"}
              hint={
                !isLogin ? "This is your parent password — different from the child PIN." : ""
              }
              theme={theme}
            />
          </div>
          {err && (
            <Txt size={12} color={C.red} style={{ display: "block", marginBottom: 12 }}>
              {err}
            </Txt>
          )}
          <Btn full size="lg" variant="yellow" onClick={handle} disabled={loading || googleLoading}>
            {loading ? "Authenticating & Syncing..." : (isLogin ? T[lang].signIn : T[lang].createAccount)}
          </Btn>

          {/* Separator / Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 10 }}>
            <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#64748B" : "#94A3B8", textTransform: "uppercase", letterSpacing: 0.8 }}>or</span>
            <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0" }} />
          </div>

          {/* Google Sign In/Up Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            style={{
              width: "100%",
              background: isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
              border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
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
              e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
              e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{isLogin ? "Sign In with Google" : "Sign Up with Google"}</span>
          </button>
          <Txt
            size={11}
            color={isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)"}
            style={{ display: "block", marginTop: 10, textAlign: "center", fontStyle: "italic" }}
          >
            🔌 Connects instantly to Supabase Cloud if configured in environment variables.
          </Txt>
          <Txt
            size={12}
            color={isDark ? "#94A3B8" : "#475569"}
            style={{ display: "block", marginTop: 14, textAlign: "center", lineHeight: 1.6 }}
          >
            {lang === "en" && "You stay in control of your child's learning limits."}
            {lang === "ig" && "Ị na-achịbata ọchịchị oge mmụta nwa gị."}
            {lang === "yo" && "Ìwọ ni ó ń ṣàkóso àsìkò iṣẹ́-ẹ̀rọ ọmọ rẹ parí."}
          </Txt>
        </Card>
      </div>
    </div>
  );
};
export default ParentAuthScreen;
