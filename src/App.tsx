/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Language, Parent, Child } from "./types";
import {
  C,
  F,
  T,
  S,
  getLoggedInParent,
  getParent,
  todayKey,
  syncToSupabase,
  getSupabaseStatus
} from "./utils/config";
import { CLATSLogo } from "./components/CLATSLogo";
import { Card, Heading, Txt, Chip, Btn, Label } from "./components/Primitives";
import { ParentAuthScreen } from "./components/ParentAuth";
import { ParentDashboard } from "./components/ParentDashboard";
import { SettingsScreen, ChildSetupScreen } from "./components/Settings";
import { ChildApp } from "./components/ChildApp";
import { ParentCommunity } from "./components/ParentCommunity";
import { WelcomeModal, TutorialTour, ContextualTip } from "./components/TourOverlay";
import { SplashScreen } from "./components/SplashScreen";
import { Onboarding, MascotImage } from "./components/Onboarding";
import { ChildLoginScreen } from "./components/ChildAccess";
import { AdminDashboard } from "./components/AdminDashboard";
import { sfx } from "./utils/audio";
import {
  Sparkles,
  Star,
  BookOpen,
  Lightbulb,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  X,
  Play,
  Compass,
  ArrowRight,
  Laptop,
  Smile,
  ShieldAlert,
  Sun,
  Moon
} from "lucide-react";

type AppView =
  | "onboarding"
  | "welcome"
  | "parentAuth"
  | "parentDashboard"
  | "addChild"
  | "settings"
  | "community"
  | "childApp"
  | "childLogin"
  | "clatsAdmin";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<AppView>("welcome");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("clats_theme") as "light" | "dark") || "light"
  );
  const [parent, setParent] = useState<Parent | null>(null);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState(1);
  const [authBackView, setAuthBackView] = useState<"welcome" | "onboarding">("welcome");
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Tutorial state managers
  const [activeTour, setActiveTour] = useState<"parent" | "child" | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTourTab, setActiveTourTab] = useState<any>(null);
  const [activeSmartTip, setActiveSmartTip] = useState<"community" | "games" | null>(null);

  // Automated Parent Dashboard welcome prompt logic is triggered on login/register successful authentication
  useEffect(() => {
    if (parent && view === "parentDashboard") {
      const parentDone = parent.tutorial_completed === true || localStorage.getItem("hasCompletedParentTutorial") === "true";
      const skippedWelcome = localStorage.getItem("tutorialSkipped") === "true";
      if (!parentDone && !skippedWelcome) {
        setShowWelcome(true);
      }
    }
  }, [parent, view]);

  // Automated Child App tour trigger logic is run on student entrance
  useEffect(() => {
    if (activeChild && view === "childApp") {
      const childDone = activeChild.child_tutorial_completed === true || localStorage.getItem("hasCompletedChildTutorial") === "true";
      const skippedWelcome = localStorage.getItem("tutorialSkipped") === "true";
      if (!childDone && !skippedWelcome) {
        setActiveTour("child");
      }
    }
  }, [activeChild, view]);

  // Contextual smart tips trigger logic
  useEffect(() => {
    if (view === "community") {
      const shownStr = localStorage.getItem("shownFeatureTips") || "{}";
      try {
        const shown = JSON.parse(shownStr);
        if (!shown.community) {
          setActiveSmartTip("community");
        }
      } catch {
        setActiveSmartTip("community");
      }
    } else {
      setActiveSmartTip(null);
    }
  }, [view]);

  useEffect(() => {
    if (view === "childApp" && activeTourTab === "games") {
      const shownStr = localStorage.getItem("shownFeatureTips") || "{}";
      try {
        const shown = JSON.parse(shownStr);
        if (!shown.games) {
          setActiveSmartTip("games");
        }
      } catch {
        setActiveSmartTip("games");
      }
    } else if (view !== "childApp") {
      setActiveSmartTip(null);
    }
  }, [view, activeTourTab]);

  // Child login PIN state
  const [pinTargetChild, setPinTargetChild] = useState<Child | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinErr, setPinErr] = useState("");

  // Sync state on load
  useEffect(() => {
    const savedLang = S.getLang() as Language;
    if (savedLang) setLang(savedLang);

    const logged = getLoggedInParent();
    const onboarded = localStorage.getItem("clats_onboarded") === "true";

    if (logged) {
      setParent(logged);
      setView("parentDashboard");
    } else if (!onboarded) {
      setView("onboarding");
    } else {
      setView("welcome");
    }
  }, []);

  // Check live Supabase connection dynamically
  useEffect(() => {
    const checkDb = async () => {
      try {
        const status = await getSupabaseStatus();
        setDbConnected(status.enabled);
      } catch (e) {
        setDbConnected(false);
      }
    };
    checkDb();
  }, [parent]);

  // Synchronize Parent & Student state to Supabase automatically when updated
  useEffect(() => {
    if (parent && parent.email) {
      const runSync = async () => {
        setIsSyncing(true);
        try {
          const res = await syncToSupabase(parent.email, parent.children || []);
          if (res && res.synced) {
            console.log("Supabase State Synced Successfully!");
            setDbConnected(true);
          }
        } catch (e) {
          console.warn("Could not sync with Supabase:", e);
        } finally {
          setIsSyncing(false);
        }
      };
      const timer = setTimeout(runSync, 1200);
      return () => clearTimeout(timer);
    }
  }, [parent]);

  const handleLanguageChange = (code: Language) => {
    setLang(code);
    S.setLang(code);
  };

  const handleParentAuth = (p: Parent) => {
    setParent(p);
    setView("parentDashboard");
  };

  const handleLogoutParent = () => {
    S.clearSess();
    setParent(null);
    setView("welcome");
  };

  const handleChildSelect = (c: Child) => {
    setEnteredPin("");
    setPinErr("");
    setPinTargetChild(c);
  };

  const verifyChildPin = () => {
    if (!pinTargetChild) return;
    if (enteredPin === pinTargetChild.pin) {
      setActiveChild(pinTargetChild);
      setPinTargetChild(null);
      setView("childApp");
    } else {
      setPinErr("Incorrect safety PIN. Try again!");
      setEnteredPin("");
    }
  };

  // Get active children on welcome page safely
  const welcomeChildren: Child[] = [];
  if (parent && parent.children) {
    welcomeChildren.push(...parent.children);
  } else {
    // If no parent account is signed in, check all local parent rows to allow easy access!
    const all = S.getParents();
    Object.values(all).forEach((p: any) => {
      if (p.children) {
        welcomeChildren.push(...p.children);
      }
    });
  }

  const isDark = theme === "dark";
  const parentBg = isDark ? "#0F172A" : "#F8FAFC";
  const parentText = isDark ? "#F8FAFC" : "#0F172A";
  const isParentView = ["parentDashboard", "settings", "community", "addChild", "parentAuth", "welcome", "childLogin"].includes(view);

  const activeBg = isDark ? "#0F172A" : "#F8FAFC";
  const activeText = isDark ? "#F8FAFC" : "#1E293B";

  return (
    <div
      className={isDark ? "dark-theme" : ""}
      style={{
        fontFamily: F.body,
        background: activeBg,
        minHeight: "100vh",
        color: activeText,
        WebkitFontSmoothing: "antialiased",
        position: "relative",
        overflowX: "hidden",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      {showSplash && (
        <SplashScreen onDismiss={() => setShowSplash(false)} />
      )}

      {/* Decorative Ornaments from "Artistic Flair" theme */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 384,
          height: 384,
          backgroundColor: "rgba(34, 211, 238, 0.08)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 320,
          height: 320,
          backgroundColor: "rgba(167, 139, 250, 0.06)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      {/* 0. ONBOARDING HUB SCREEN */}
      {view === "onboarding" && (
        <Onboarding
          initialStep={onboardingInitialStep}
          onSelectRole={(role) => {
            localStorage.setItem("clats_onboarded", "true");
            if (role === "parent") {
              setAuthBackView("onboarding");
              setAuthMode("register");
              setView("parentAuth");
            } else {
              setAuthBackView("onboarding");
              setView("childLogin");
            }
          }}
          lang={lang}
          theme={theme}
        />
      )}

      {/* 1. WELCOME SELECTION HUB SCREEN */}
      {view === "welcome" && (
        <div
          style={{
            minHeight: "100vh",
            background: isDark ? "#0F172A" : "#F8FAFC",
            color: isDark ? "#F8FAFC" : "#0F172A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingBottom: 64,
            boxSizing: "border-box",
            position: "relative",
            transition: "background 0.3s ease, color 0.3s ease"
          }}
        >
          {/* Keyframe Injector block for gentle child-friendly micro-animations */}
          <style>{`
            @keyframes clatsFloat {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(2deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            @keyframes clatsFloatDelayed {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(8px) rotate(-2deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            @keyframes clatsPulseSparkle {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 6px rgba(255,209,102,0.5)); }
            }
            .clats-float-1 { animation: clatsFloat 5s ease-in-out infinite; }
            .clats-float-2 { animation: clatsFloatDelayed 6s ease-in-out infinite; }
            .clats-float-3 { animation: clatsFloat 7s ease-in-out infinite; }
            .clats-sparkle { animation: clatsPulseSparkle 4s ease-in-out infinite; }
          `}</style>

          {/* HEADER SECTION (Reduced vertical space, Left Logo, Center Tagline, Right Segmented Selector) */}
          <header
            style={{
              width: "100%",
              borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
              background: isDark ? "#1E293B" : "#FFFFFF",
              padding: "12px 24px",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              zIndex: 30,
              transition: "background 0.3s ease, border-color 0.3s ease"
            }}
          >
            {/* Left: CLATS Logo */}
            <div>
              <CLATSLogo height={32} />
            </div>

            {/* Center: Tagline */}
            <div className="hidden md:block" style={{ textAlign: "center" }}>
              <span
                style={{
                  fontFamily: F.display,
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#2EC4B6",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
              >
                Building Tomorrow's Tech Minds Today
              </span>
            </div>

            {/* Right: Modern Segmented Switch */}
            <div
              style={{
                display: "flex",
                background: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0",
                padding: 3,
                borderRadius: 999,
                alignItems: "center",
                transition: "all 0.3s ease"
              }}
            >
              {[
                { code: "en" as const, label: "EN" },
                { code: "ig" as const, label: "IG" },
                { code: "yo" as const, label: "YO" }
              ].map((l) => {
                const isActive = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      sfx.playTap();
                      handleLanguageChange(l.code);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      border: "none",
                      background: isActive ? (isDark ? "#2EC4B6" : "#FFFFFF") : "transparent",
                      color: isActive ? (isDark ? "#FFFFFF" : "#2EC4B6") : (isDark ? "#94A3B8" : "#64748B"),
                      cursor: "pointer",
                      boxShadow: isActive ? "0 2px 8px rgba(46, 196, 182, 0.15)" : "none",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = "#2EC4B6";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = isDark ? "#94A3B8" : "#64748B";
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
          </header>

          {/* HERO CONTAINER */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 960,
              textAlign: "center",
              marginTop: 48,
              marginBottom: 40,
              padding: "0 20px",
              boxSizing: "border-box"
            }}
          >
            {/* FLOATING DECORATIONS */}
            <div className="absolute top-[-20px] left-[5%] clats-float-1 pointer-events-none hidden sm:flex items-center gap-1.5 bg-yellow-100 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm text-xs font-bold text-yellow-600">
              <Star size={14} fill="#FFD166" color="#FFD166" />
              <span>STARS</span>
            </div>
            <div className="absolute top-[-35px] right-[8%] clats-float-2 pointer-events-none hidden sm:flex items-center gap-1.5 bg-purple-100 px-3 py-1.5 rounded-full border border-purple-200 shadow-sm text-xs font-bold text-purple-600">
              <BookOpen size={14} color="#B8A0FF" />
              <span>BOOKS</span>
            </div>
            <div className="absolute bottom-[-10px] left-[10%] clats-float-3 pointer-events-none hidden sm:flex items-center gap-1.5 bg-teal-100 px-3 py-1.5 rounded-full border border-teal-200 shadow-sm text-xs font-bold text-teal-600">
              <Lightbulb size={14} color="#2EC4B6" />
              <span>IDEAS</span>
            </div>
            <div className="absolute bottom-[-20px] right-[12%] clats-float-1 pointer-events-none hidden sm:flex items-center gap-1.5 bg-red-100 px-3 py-1.5 rounded-full border border-red-200 shadow-sm text-xs font-bold text-red-500">
              <Rocket size={14} className="transform rotate-45" />
              <span>ROCKETS</span>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 12 }}>
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(46,196,182,0.15), rgba(184,160,255,0.15))",
                  padding: "6px 14px",
                  borderRadius: 99,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                <Sparkles size={14} style={{ color: "#2EC4B6" }} className="clats-sparkle" />
                <span style={{ fontSize: 11, fontWeight: 900, fontFamily: F.mono, color: "#2EC4B6", letterSpacing: 1.2 }}>
                  WELCOME TO THE ADVENTURE
                </span>
              </div>
            </div>

            <h1
              style={{
                fontFamily: F.display,
                fontSize: 42,
                fontWeight: 950,
                color: isDark ? "#FFFFFF" : "#1E293B",
                lineHeight: 1.1,
                margin: "0 0 12px",
                letterSpacing: "-0.03em"
              }}
            >
              Welcome to CLATS
            </h1>
            <p
              style={{
                fontFamily: F.body,
                fontSize: 16,
                fontWeight: 600,
                color: "#2EC4B6",
                margin: "0 0 14px",
                textTransform: "uppercase",
                letterSpacing: "0.08em"
              }}
            >
              Building tomorrow's tech minds today.
            </p>
            <p
              style={{
                fontFamily: F.body,
                fontSize: 15,
                fontWeight: 500,
                color: isDark ? "#94A3B8" : "#64748B",
                maxWidth: 580,
                margin: "0 auto",
                lineHeight: 1.5
              }}
            >
              Choose how you would like to enter the CLATS learning experience.
            </p>
          </div>

          {/* MAIN PORTAL OPTIONS (2 columns side-by-side, responsive layout) */}
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              padding: "0 20px",
              boxSizing: "border-box",
              zIndex: 10
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 lg:gap-10">
              
              {/* CARD 1: PARENT PORTAL */}
              <div
                style={{
                  background: isDark ? "#1E293B" : "#FFFFFF",
                  borderRadius: 24,
                  border: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #E2E8F0",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.2)" : "0 10px 25px rgba(148, 163, 184, 0.05)",
                  transition: "all 0.25s ease, background 0.3s ease, border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                className="hover:shadow-[0_15px_30px_rgba(184,160,255,0.08)] hover:scale-[1.01] hover:border-[#B8A0FF]/40"
              >
                <div>
                  {/* Decorative Illustration */}
                  <div
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.03)" : "linear-gradient(135deg, rgba(184, 160, 255, 0.08) 0%, rgba(46, 196, 182, 0.08) 100%)",
                      borderRadius: 20,
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      overflow: "hidden",
                      position: "relative",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0"
                    }}
                  >
                    {/* Modern Visual mock of parent monitoring progress */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, width: "90%", zIndex: 2 }}>
                      <div
                        style={{
                          background: "#B8A0FF",
                          borderRadius: "50%",
                          width: 52,
                          height: 52,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 16px rgba(184,160,255,0.25)"
                        }}
                      >
                        <span style={{ fontSize: 24 }}>👩‍💻</span>
                      </div>
                      
                      {/* Interactive connector with active pulsing bar */}
                      <div style={{ flex: 1, height: 4, position: "relative", background: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(148, 163, 184, 0.15)", borderRadius: 2 }}>
                        <div style={{ position: "absolute", left: "45%", top: -4, width: 12, height: 12, borderRadius: "50%", background: "#2EC4B6", animation: "ping 1.5s infinite" }} />
                        <div style={{ position: "absolute", right: 0, top: -4, width: 10, height: 10, borderRadius: "50%", background: isDark ? "#475569" : "#CBD5E1" }} />
                      </div>

                      {/* Right Child Circle with progress metrics overlay */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, background: isDark ? "#0F172A" : "#FFFFFF", padding: "10px 14px", borderRadius: 16, border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>👦</span>
                          <span style={{ fontSize: 10, fontFamily: F.mono, fontWeight: 800, color: isDark ? "#94A3B8" : "#64748B" }}>KOBE</span>
                          <div style={{ background: "#4ADE80", width: 6, height: 6, borderRadius: "50%" }} />
                        </div>
                        {/* Screen limit mockup bar */}
                        <div style={{ width: 100, height: 6, background: isDark ? "#1E293B" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: "70%", height: "100%", background: "#2EC4B6" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, fontFamily: F.mono, fontWeight: 800, color: "#10B981" }}>
                          <span>SCREEN TIME</span>
                          <span>70%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: F.display,
                      fontSize: 22,
                      fontWeight: 900,
                      color: isDark ? "#F8FAFC" : "#1E293B",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <span>🛡️</span>
                    Parent Portal
                  </h3>
                  
                  <p
                    style={{
                      fontFamily: F.body,
                      fontSize: 14,
                      color: isDark ? "#94A3B8" : "#64748B",
                      lineHeight: 1.6,
                      marginBottom: 28,
                      minHeight: 64
                    }}
                  >
                    Create child profiles, manage screen-time settings, track progress, and support your child's learning journey.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => {
                      sfx.playTap();
                      setAuthBackView("welcome");
                      setAuthMode("register");
                      setView("parentAuth");
                    }}
                    style={{
                      background: "linear-gradient(135deg, #2EC4B6 0%, #20A599 100%)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 16,
                      padding: "14px 20px",
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: F.display,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: "0 6px 16px rgba(46, 196, 182, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(46, 196, 182, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(46, 196, 182, 0.2)";
                    }}
                  >
                    Create Parent Account
                  </button>

                  <button
                    onClick={() => {
                      sfx.playTap();
                      setAuthBackView("welcome");
                      setAuthMode("login");
                      setView("parentAuth");
                    }}
                    style={{
                      background: isDark ? "#1E293B" : "#FFFFFF",
                      border: "2px solid #B8A0FF",
                      color: "#B8A0FF",
                      borderRadius: 16,
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: F.display,
                      cursor: "pointer",
                      width: "100%",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDark ? "rgba(184, 160, 255, 0.15)" : "rgba(184, 160, 255, 0.05)";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark ? "#1E293B" : "#FFFFFF";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {/* CARD 2: CHILD LEARNING PORTAL */}
              <div
                style={{
                  background: isDark ? "#1E293B" : "#FFFFFF",
                  borderRadius: 24,
                  border: isDark ? "2px solid rgba(255, 255, 255, 0.08)" : "2px solid #E2E8F0",
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.2)" : "0 10px 25px rgba(148, 163, 184, 0.05)",
                  transition: "all 0.25s ease, background 0.3s ease, border-color 0.3s ease",
                  boxSizing: "border-box"
                }}
                className="hover:shadow-[0_15px_30px_rgba(255,209,102,0.12)] hover:scale-[1.01] hover:border-[#FFD166]/60"
              >
                <div>
                  {/* Decorative Illustration */}
                  <div
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.03)" : "linear-gradient(135deg, rgba(255, 209, 102, 0.12) 0%, rgba(46, 196, 182, 0.08) 100%)",
                      borderRadius: 20,
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                      overflow: "hidden",
                      position: "relative",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #E2E8F0"
                    }}
                  >
                    {/* Floating Mascots with friendly text bubble */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
                      <div className="clats-float-1" style={{ transformOrigin: "bottom center" }}>
                        <MascotImage character="kobe" height={68} />
                      </div>
                      
                      {/* Interactive speech tag styled like Duolingo */}
                      <div
                        style={{
                          background: isDark ? "#0F172A" : "#FFFFFF",
                          border: isDark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid #FFD166",
                          borderRadius: 14,
                          padding: "6px 12px",
                          fontSize: 11,
                          fontWeight: 800,
                          color: isDark ? "#F8FAFC" : "#1E293B",
                          position: "relative",
                          boxShadow: "0 4px 10px rgba(255,209,102,0.15)",
                          maxWidth: 100,
                          textAlign: "center"
                        }}
                        className="clats-sparkle"
                      >
                        <span style={{ fontFamily: F.display }}>LEARN & PLAY! ✨</span>
                        <div
                          style={{
                            position: "absolute",
                            left: -5,
                            top: "50%",
                            transform: "translateY(-50%) rotate(45deg)",
                            background: isDark ? "#0F172A" : "#FFFFFF",
                            borderLeft: isDark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid #FFD166",
                            borderBottom: isDark ? "1.5px solid rgba(255,255,255,0.15)" : "1.5px solid #FFD166",
                            width: 8,
                            height: 8
                          }}
                        />
                      </div>

                      <div className="clats-float-2" style={{ transformOrigin: "bottom center" }}>
                        <MascotImage character="chibi" height={72} />
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontFamily: F.display,
                      fontSize: 22,
                      fontWeight: 900,
                      color: isDark ? "#F8FAFC" : "#1E293B",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <span>🚀</span>
                    Child Learning Portal
                  </h3>
                  
                  <p
                    style={{
                      fontFamily: F.body,
                      fontSize: 14,
                      color: isDark ? "#94A3B8" : "#64748B",
                      lineHeight: 1.6,
                      marginBottom: 28,
                      minHeight: 64
                    }}
                  >
                    Continue your learning adventure, complete lessons, earn badges, and unlock new levels.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => {
                      sfx.playCoin();
                      setLearningModalOpen(true);
                    }}
                    style={{
                      background: "linear-gradient(135deg, #FFD166 0%, #FBBF24 100%)",
                      color: "#1E293B",
                      border: "none",
                      borderRadius: 16,
                      padding: "16px 20px",
                      fontSize: 15,
                      fontWeight: 900,
                      fontFamily: F.display,
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: "0 6px 16px rgba(250, 204, 21, 0.2)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                      e.currentTarget.style.boxShadow = "0 8px 22px rgba(250, 204, 21, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(250, 204, 21, 0.2)";
                    }}
                  >
                    Enter Learning Portal
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* QUICK BENEFITS SECTION */}
          <div
            style={{
              width: "100%",
              maxWidth: 960,
              padding: "0 20px",
              marginTop: 48,
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20
              }}
            >
              {[
                {
                  title: "Personalized Learning",
                  desc: "AI adapts learning to age and skill level.",
                  color: "#2EC4B6",
                  bg: "rgba(46, 196, 182, 0.08)",
                  icon: <Sparkles size={20} style={{ color: "#2EC4B6" }} />
                },
                {
                  title: "Safe Learning Environment",
                  desc: "Built-in digital safety and screen-time controls.",
                  color: "#B8A0FF",
                  bg: "rgba(184, 160, 255, 0.08)",
                  icon: <ShieldCheck size={20} style={{ color: "#B8A0FF" }} />
                },
                {
                  title: "Future-Ready Skills",
                  desc: "AI, Cyber Safety, Design, Data Literacy, and more.",
                  color: "#FFD166",
                  bg: "rgba(255, 209, 102, 0.12)",
                  icon: <Laptop size={20} style={{ color: "#FBBF24" }} />
                }
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    background: "#FFFFFF",
                    border: "1.5px solid #F1F5F9",
                    borderRadius: 20,
                    padding: 20,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    boxShadow: "0 4px 12px rgba(148, 163, 184, 0.02)",
                    transition: "transform 0.2s"
                  }}
                  className="hover:shadow-sm"
                >
                  <div
                    style={{
                      background: b.bg,
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        fontFamily: F.display,
                        fontSize: 14,
                        fontWeight: 900,
                        color: "#1E293B"
                      }}
                    >
                      {b.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: F.body,
                        fontSize: 12.5,
                        color: "#64748B",
                        lineHeight: 1.4
                      }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HELP SECTION (Replaces old buttons, clean and modern) */}
          <footer
            style={{
              width: "100%",
              maxWidth: 960,
              marginTop: 64,
              padding: "24px 20px 0",
              borderTop: "1px dashed #E2E8F0",
              textAlign: "center",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <span
                style={{
                  fontFamily: F.display,
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: 2
                }}
              >
                Need Help?
              </span>
              
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={() => {
                    sfx.playTap();
                    setShowSplash(true);
                  }}
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "8px 16px",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: F.body,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E2E8F0";
                    e.currentTarget.style.color = "#1E293B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F1F5F9";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  <Play size={14} style={{ color: "#2EC4B6" }} fill="#2EC4B6" />
                  <span>Watch Introduction</span>
                </button>

                <button
                  onClick={() => {
                    sfx.playTap();
                    setOnboardingInitialStep(1);
                    setView("onboarding");
                  }}
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    padding: "8px 16px",
                    color: "#475569",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: F.body,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#E2E8F0";
                    e.currentTarget.style.color = "#1E293B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F1F5F9";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  <Compass size={14} style={{ color: "#B8A0FF" }} />
                  <span>Explore Platform Tour</span>
                </button>

                <button
                  onClick={() => {
                    sfx.playTap();
                    setView("clatsAdmin");
                  }}
                  style={{
                    background: "#0F172A",
                    border: "1px solid #1E293B",
                    borderRadius: 12,
                    padding: "8px 16px",
                    color: "#F8FAFC",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: F.body,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1E293B";
                    e.currentTarget.style.color = "#2EC4B6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0F172A";
                    e.currentTarget.style.color = "#F8FAFC";
                  }}
                >
                  <ShieldAlert size={14} style={{ color: "#2EC4B6" }} />
                  <span>CLATS Admin Suite</span>
                </button>
              </div>
            </div>
          </footer>

          {/* DYNAMIC UX IMPROVEMENT: "Who will be learning today?" MODAL */}
          {learningModalOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.45)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
                padding: 16
              }}
              className="animate-[fadeIn_0.2s_ease-out]"
            >
              <div
                style={{
                  background: "#FFFFFF",
                  border: "2px solid #FFD166",
                  borderRadius: 28,
                  width: "100%",
                  maxWidth: 420,
                  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.15)",
                  padding: 32,
                  boxSizing: "border-box",
                  position: "relative",
                  textAlign: "center"
                }}
                className="animate-[scaleUp_0.2s_ease-out]"
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    sfx.playTap();
                    setLearningModalOpen(false);
                  }}
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    background: "#F1F5F9",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748B"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#E2E8F0")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#F1F5F9")}
                >
                  <X size={16} />
                </button>

                {/* Stars Sparkle Icon */}
                <div
                  style={{
                    background: "rgba(250, 204, 21, 0.12)",
                    borderRadius: "50%",
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px"
                  }}
                >
                  <Sparkles size={28} style={{ color: "#FBBF24" }} className="clats-sparkle" />
                </div>

                <h3
                  style={{
                    fontFamily: F.display,
                    fontSize: 24,
                    fontWeight: 950,
                    color: "#1E293B",
                    margin: "0 0 8px 0"
                  }}
                >
                  Who will be learning today?
                </h3>
                
                <p
                  style={{
                    fontFamily: F.body,
                    fontSize: 14.5,
                    color: "#64748B",
                    margin: "0 0 24px 0",
                    lineHeight: 1.5
                  }}
                >
                  Choose a learner identity card to launch your digital curriculum map space:
                </p>

                {/* Touch Selection Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <button
                    onClick={() => {
                      sfx.playCoin();
                      setLearningModalOpen(false);
                      setAuthBackView("welcome");
                      setView("childLogin");
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "2px solid #E2E8F0",
                      borderRadius: 18,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      width: "100%",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#2EC4B6";
                      e.currentTarget.style.background = "rgba(46, 196, 182, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    <div style={{ fontSize: 28, background: "rgba(46,196,182,0.12)", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justify: "center", justifyContent: "center" }}>
                      👦
                    </div>
                    <div>
                      <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 900, color: "#1E293B" }}>
                        Child Learner
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: 12, color: "#64748B" }}>
                        Enter boy explorer environment
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      sfx.playCoin();
                      setLearningModalOpen(false);
                      setAuthBackView("welcome");
                      setView("childLogin");
                    }}
                    style={{
                      background: "#FFFFFF",
                      border: "2px solid #E2E8F0",
                      borderRadius: 18,
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      width: "100%",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#B8A0FF";
                      e.currentTarget.style.background = "rgba(184, 160, 255, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    <div style={{ fontSize: 28, background: "rgba(184,160,255,0.12)", width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justify: "center", justifyContent: "center" }}>
                      👧
                    </div>
                    <div>
                      <div style={{ fontFamily: F.display, fontSize: 16, fontWeight: 900, color: "#1E293B" }}>
                        Child Learner
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: 12, color: "#64748B" }}>
                        Enter girl explorer environment
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. PARENT AUTHENTICATION WINDOW */}
      {view === "parentAuth" && (
        <ParentAuthScreen
          mode={authMode}
          lang={lang}
          theme={theme}
          onAuth={handleParentAuth}
          onBack={() => {
            if (authBackView === "onboarding") {
              setOnboardingInitialStep(4);
              setView("onboarding");
            } else if (authBackView === "childLogin") {
              setView("childLogin");
            } else {
              setView("welcome");
            }
          }}
        />
      )}

      {/* CHILD LOGIN SECURED WINDOW */}
      {view === "childLogin" && (
        <ChildLoginScreen
          lang={lang}
          theme={theme}
          onLoginSuccess={(c) => {
            setActiveChild(c);
            setView("childApp");
          }}
          onNavigateParentRegister={() => {
            setAuthBackView("childLogin");
            setAuthMode("register");
            setView("parentAuth");
          }}
          onBack={() => {
            if (authBackView === "onboarding") {
              setOnboardingInitialStep(4);
              setView("onboarding");
            } else {
              setView("welcome");
            }
          }}
        />
      )}

      {/* 3. PARENT MAIN GATEWAY DASHBOARD */}
      {view === "parentDashboard" && parent && (
        <ParentDashboard
          parent={parent}
          dbConnected={dbConnected}
          isSyncing={isSyncing}
          lang={lang}
          theme={theme}
          onToggleTheme={() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            localStorage.setItem("clats_theme", next);
          }}
          onLanguageChange={handleLanguageChange}
          onEnterChildMode={(c) => {
            setActiveChild(c);
            setView("childApp");
          }}
          onNavigate={(scr) => setView(scr)}
          onLogout={handleLogoutParent}
        />
      )}

      {/* 4. DYNAMIC ENROLL CHILD PROFILE PROCESS */}
      {view === "addChild" && parent && (
        <ChildSetupScreen
          parentEmail={parent.email}
          lang={lang}
          theme={theme}
          onToggleTheme={() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            localStorage.setItem("clats_theme", next);
          }}
          onDone={() => {
            const fresh = getParent(parent.email);
            if (fresh) setParent(fresh);
            setView("parentDashboard");
          }}
          onBack={() => setView("parentDashboard")}
        />
      )}

      {/* 5. SETTINGS AND TIME LIMITS MODULES */}
      {view === "settings" && parent && (
        <SettingsScreen
          parent={parent}
          lang={lang}
          theme={theme}
          onToggleTheme={() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            localStorage.setItem("clats_theme", next);
          }}
          onBack={() => setView("parentDashboard")}
          onParentRefresh={(fresh) => setParent(fresh)}
          onLanguageChange={handleLanguageChange}
          onTriggerParentTour={() => {
            setView("parentDashboard");
            setActiveTour("parent");
          }}
          onTriggerChildTour={() => {
            if (parent && parent.children && parent.children.length > 0) {
              setActiveChild(parent.children[0]);
              setView("childApp");
              setActiveTour("child");
            } else {
              alert("Please enroll at least one child profile first in order to replay the Student Tour!");
            }
          }}
        />
      )}

      {/* 6. PARENTS COMMUNITY BOARD */}
      {view === "community" && (
        <ParentCommunity theme={theme} lang={lang} onBack={() => setView("parentDashboard")} />
      )}

      {/* 7. FULL CHILDREN PORTAL GATEWAY CHASSIS */}
      {view === "childApp" && activeChild && (
        <ChildApp
          child={activeChild}
          parent={parent}
          lang={lang}
          theme={theme}
          onToggleTheme={() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            localStorage.setItem("clats_theme", next);
          }}
          activeTourTab={activeTourTab}
          onExit={() => {
            setActiveChild(null);
            if (parent) {
              const fresh = getParent(parent.email);
              if (fresh) setParent(fresh);
              setView("parentDashboard");
            } else {
              setView("welcome");
            }
          }}
          onUpdateChild={(freshChild) => {
            setActiveChild(freshChild);
            if (parent) {
              const fresh = getParent(parent.email);
              if (fresh) setParent(fresh);
            }
          }}
        />
      )}

      {/* CLATS ADMIN DASHBOARD OPERATING SYSTEM PORTAL */}
      {view === "clatsAdmin" && (
        <AdminDashboard
          lang={lang}
          theme={theme}
          onBackToPortal={() => setView("welcome")}
        />
      )}

      {/* 8. INTERACTIVE TUTORIAL TOURS OVERLAYS AND WELCOME PROMPTS */}
      {showWelcome && (
        <WelcomeModal
          onStartTour={() => {
            setShowWelcome(false);
            setActiveTour("parent");
          }}
          onSkip={() => {
            setShowWelcome(false);
            localStorage.setItem("tutorialSkipped", "true");
          }}
        />
      )}

      {activeTour && (
        <TutorialTour
          role={activeTour}
          childAgeGroup={activeChild?.ageGroup || "young innovators"}
          onSetChildTab={(tab) => setActiveTourTab(tab)}
          onComplete={() => {
            setActiveTour(null);
            setActiveTourTab(null);
            if (parent) {
              if (activeTour === "parent") {
                setParent({
                  ...parent,
                  tutorial_completed: true
                });
                localStorage.setItem("hasCompletedParentTutorial", "true");
              } else if (activeTour === "child" && activeChild) {
                const refreshedChildren = (parent.children || []).map((ch) =>
                  ch.id === activeChild.id ? { ...ch, child_tutorial_completed: true } : ch
                );
                setParent({
                  ...parent,
                  children: refreshedChildren
                });
                localStorage.setItem("hasCompletedChildTutorial", "true");
              }
            }
          }}
          onSkip={() => {
            setActiveTour(null);
            setActiveTourTab(null);
            localStorage.setItem("tutorialSkipped", "true");
          }}
        />
      )}

      {activeSmartTip && (
        <div style={{ position: "fixed", bottom: 84, right: 18, zIndex: 998 }}>
          <ContextualTip
            feature={activeSmartTip}
            onClose={() => setActiveSmartTip(null)}
          />
        </div>
      )}

      {/* 9. GLOBAL LIGHT / DARK THEME TOGGLE BUTTON */}
      {!showSplash && view !== "clatsAdmin" && (
        <button
          id="global-theme-toggle"
          onClick={() => {
            const next = theme === "light" ? "dark" : "light";
            setTheme(next);
            localStorage.setItem("clats_theme", next);
            sfx.playTap();
          }}
          className="fixed z-[9999] p-3 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 border-2 cursor-pointer"
          style={{
            bottom: view === "childApp" ? "108px" : "24px",
            right: "24px",
            backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
            borderColor: isDark ? "#334155" : "#E2E8F0",
            color: isDark ? "#FABC05" : "#475569",
            boxShadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 4px 14px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle brightness mode"
        >
          {isDark ? (
            <Sun size={24} strokeWidth={2.5} className="text-yellow-400 animate-spin-slow" />
          ) : (
            <Moon size={24} strokeWidth={2.5} className="text-indigo-600" />
          )}
        </button>
      )}
    </div>
  );
}
