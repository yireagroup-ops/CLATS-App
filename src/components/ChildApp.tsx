/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Child, Parent, Language, Module, Lesson } from "../types";
import {
  C,
  F,
  T,
  getCurrentSlot,
  slotAllowance,
  getTimeLog,
  addTime,
  updateChild,
  todayKey
} from "../utils/config";
import { Card, Heading, Txt, Chip, Btn } from "./Primitives";
import { KobeAvatar } from "./KobeAvatar";
import { companionVoice } from "../utils/audio";
import { ChildWelcomeScreen } from "./ChildWelcome";
import { ModulesOverview } from "./ModulesOverview";
import { LearningPath } from "./LearningPath";
import { ChildProgressScreen } from "./ChildProgress";
import { LessonContent } from "./LessonContent";
import { ChildGames } from "./ChildGames";
import { ChildRewards } from "./ChildRewards";
import { ModuleDetails } from "./ModuleDetails";
import { CURRICULUM } from "../data/curriculum";

interface ChildAppProps {
  child: Child;
  parent: Parent | null;
  onExit: () => void;
  lang: Language;
  onUpdateChild: (updated: Child) => void;
  activeTourTab?: TabType;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

type TabType = "home" | "modules" | "module-details" | "lessons" | "progress" | "chat" | "games" | "rewards";

const AGE_META_RESOLVE = (ag: string) => {
  if (ag === "early explorers") return { color: C.amber, soft: C.yellowSoft };
  if (ag === "future builders") return { color: C.lavender, soft: C.lavSoft };
  return { color: C.teal, soft: C.tealGhost };
};

const S_RESOLVE = () => {
  try {
    return JSON.parse(localStorage.getItem("clats_settings_v1") || "{}");
  } catch {
    return {};
  }
};

export const ChildApp: React.FC<ChildAppProps> = ({
  child,
  parent,
  onExit,
  lang,
  onUpdateChild,
  activeTourTab,
  theme,
  onToggleTheme
}) => {
  const meta = AGE_META_RESOLVE(child.ageGroup);
  const isDark = theme === "dark";

  // States
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [selModule, setSelModule] = useState<Module | null>(null);
  const [selLesson, setSelLesson] = useState<Lesson | null>(null);
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>("academy-1");

  // Load narration preference
  const isEarly = child.ageGroup === "early explorers";
  const [narrationOn, setNarrationOn] = useState(() => companionVoice.isNarrationEnabled(child.ageGroup));

  // Stop current voice playback whenever changing screens
  useEffect(() => {
    companionVoice.stop();
  }, [activeTab]);

  const handleToggleNarration = () => {
    const nextVal = !narrationOn;
    companionVoice.setNarrationEnabled(child.ageGroup, nextVal);
    setNarrationOn(nextVal);
    if (nextVal) {
      companionVoice.speak("Voice narration activated!", child.companion || "kobe", child.ageGroup, false);
    } else {
      companionVoice.stop();
    }
  };

  // Synchronize activeTab automatically during the guided tutorial tours!
  useEffect(() => {
    if (activeTourTab) {
      setActiveTab(activeTourTab);
      if (activeTourTab === "lessons" && !selModule) {
        const KEY = child.ageGroup || "early explorers";
        const course = CURRICULUM[KEY];
        if (course && course.modules && course.modules.length > 0) {
          setSelModule(course.modules[0]);
        }
      }
    }
  }, [activeTourTab, child.ageGroup, selModule]);

  // Screen time tracking
  const [slot, setSlot] = useState<"morning" | "afternoon" | "evening" | null>(getCurrentSlot());
  const [limitsEnabled, setLimitsEnabled] = useState(false);
  const [slotLimit, setSlotLimit] = useState(0); // in seconds
  const [slotUsed, setSlotUsed] = useState(0); // in seconds
  const [blocked, setBlocked] = useState(false);
  const [nightLocked, setNightLocked] = useState(false);

  // HUD Warnings
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check initial limits and slot quotas
  useEffect(() => {
    checkTimingLimits();
    const timer = setInterval(() => {
      checkTimingLimits();
      // Tick learning duration log
      if (!blocked && !nightLocked) {
        if (parent) {
          const curS = getCurrentSlot();
          if (curS) {
            addTime(child.id, curS, 1);
            setSlotUsed((p) => p + 1);
          }
        } else {
          // If logged out of parent mode, still track local fallback time
          setSlotUsed((p) => p + 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [child.id, parent, blocked, nightLocked]);

  // Warning trigger checks
  useEffect(() => {
    if (slotLimit > 0) {
      const remain = slotLimit - slotUsed;
      if (remain === 300) {
        setToastMessage(T[lang].fiveMinsLeft);
        setTimeout(() => setToastMessage(null), 8000);
      }
      if (remain <= 0) {
        setBlocked(true);
      }
    }
  }, [slotUsed, slotLimit, lang]);

  const checkTimingLimits = () => {
    const hr = new Date().getHours();
    // Night Lock: Closed 12am – 5am
    if (hr >= 0 && hr < 5) {
      setNightLocked(true);
      return;
    } else {
      setNightLocked(false);
    }

    if (parent) {
      const parentS = S_RESOLVE();
      const parentEmail = parent.email;
      const settings = parentS[parentEmail.toLowerCase()];
      if (settings && settings.limitsEnabled) {
        setLimitsEnabled(true);
        const curS = getCurrentSlot();
        setSlot(curS);
        if (curS) {
          const limitSecs = settings.slots[curS] || 0;
          setSlotLimit(limitSecs);

          const loggedToday = getTimeLog(child.id);
          const usedSecs = loggedToday[curS] || 0;
          setSlotUsed(usedSecs);

          if (usedSecs >= limitSecs && limitSecs > 0) {
            setBlocked(true);
          } else {
            setBlocked(false);
          }
        } else {
          setSlotLimit(0);
          setSlotUsed(0);
          setBlocked(false);
        }
      } else {
        setLimitsEnabled(false);
        setSlotLimit(0);
        setSlotUsed(0);
        setBlocked(false);
      }
    } else {
      // Offline fallback: 40 mins
      setLimitsEnabled(true);
      setSlotLimit(40 * 60);
    }
  };

  const handleLessonComplete = (
    lessonId: string,
    starsEarned: number,
    xpEarned: number,
    quizResult?: {
      score: number;
      correctCount: number;
      totalQuestions: number;
      status: "Passed" | "Needs Review";
    }
  ) => {
    const isPass = !quizResult || quizResult.status === "Passed";

    const freshCompleted = isPass
      ? { ...child.completed, [lessonId]: true }
      : { ...child.completed };

    const freshStars = isPass
      ? { ...child.stars, [lessonId]: starsEarned }
      : { ...child.stars };

    const freshXP = (child.xp || 0) + (isPass ? xpEarned : 0);

    const priorQuizResults = child.quizResults || {};
    const freshQuizResults = quizResult
      ? {
          ...priorQuizResults,
          [lessonId]: {
            score: quizResult.score,
            correctCount: quizResult.correctCount,
            totalQuestions: quizResult.totalQuestions,
            status: quizResult.status,
            completedAt: "Today"
          }
        }
      : priorQuizResults;

    // Persist changes
    const updated = updateChild(parent ? parent.email : "guest", child.id, {
      completed: freshCompleted,
      stars: freshStars,
      xp: freshXP,
      quizResults: freshQuizResults
    });

    onUpdateChild(updated);
  };

  const handleAddGamesXP = (amount: number) => {
    const freshXP = (child.xp || 0) + amount;
    const updated = updateChild(parent ? parent.email : "guest", child.id, {
      xp: freshXP
    });
    onUpdateChild(updated);
  };

  // BLOCK SCREEN: Time's Up
  if (blocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#2EC4B6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center"
        }}
      >
        <KobeAvatar size={100} ageGroup={child.ageGroup} pulse expression="thinking" character={child.companion || "kobe"} />
        <Heading size={28} color="#FFFFFF" style={{ marginTop: 24, marginBottom: 10 }}>
          {T[lang].sessionDone} ⏳
        </Heading>
        <Txt size={15} color="#FFFFFF" style={{ display: "block", maxWidth: 360, marginBottom: 28, lineHeight: 1.75, opacity: 0.95 }}>
          {T[lang].greatJob} Your screen blocks are managed securely by your parent or guardian. Rest your eyes and play again during your next approved schedule!
        </Txt>
        <Btn variant="dark" size="lg" onClick={onExit}>
          Exit Child Mode
        </Btn>
      </div>
    );
  }

  // BLOCK SCREEN: Night Lock (12am – 5am)
  if (nightLocked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #120A38, #1C2B2B)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center"
        }}
      >
        <KobeAvatar size={100} ageGroup={child.ageGroup} expression="thinking" character={child.companion || "kobe"} />
        <Heading size={28} color={C.white} style={{ marginTop: 24, marginBottom: 10 }}>
          Off-Hours Resting Time 😴
        </Heading>
        <Txt size={15} color={C.fog} style={{ display: "block", maxWidth: 360, marginBottom: 28, lineHeight: 1.75 }}>
          Learning hours are closed from midnight to 5:00 am. Sleep well and recharge your tech-brain! We will resume active courses in the morning.
        </Txt>
        <Btn variant="yellow" size="lg" onClick={onExit}>
          Go Back
        </Btn>
      </div>
    );
  }

  return (
    <div className="tropical-bg" style={{ minHeight: "100vh", paddingBottom: 88, position: "relative", overflowX: "hidden" }}>
      {/* 🌴 Bright Tropical Adventure Backdrop Ornaments */}
      {!isEarly && (
        <button
          id="voice-narration-toggle"
          onClick={handleToggleNarration}
          style={{
            position: "absolute",
            top: 22,
            right: "17%",
            background: isDark ? "#1e293b" : "#ffffff",
            border: isDark ? "2px solid #334155" : "2px solid #cbd5e1",
            borderRadius: "50px",
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s"
          }}
          title="Toggle companion voice reader"
        >
          <span style={{ fontSize: 20 }}>{narrationOn ? "🔊" : "🔇"}</span>
          <span style={{ fontSize: 10, fontWeight: 900, color: isDark ? "#cbd5e1" : "#1e293b" }}>
            READER: {narrationOn ? "ON" : "OFF"}
          </span>
        </button>
      )}
      <div
        onClick={onToggleTheme}
        title="Toggle Theme style"
        style={{
          position: "absolute",
          top: 12,
          right: "8%",
          fontSize: 52,
          cursor: onToggleTheme ? "pointer" : "default",
          zIndex: 10,
          userSelect: "none",
          transition: "transform 0.2s"
        }}
        onMouseEnter={(e) => { if (onToggleTheme) e.currentTarget.style.transform = "scale(1.15) rotate(15deg)"; }}
        onMouseLeave={(e) => { if (onToggleTheme) e.currentTarget.style.transform = ""; }}
      >
        {isDark ? "🌙" : "☀️"}
      </div>
      <div className="cloud-slow" style={{ position: "absolute", top: 22, left: "10%", fontSize: 44, pointerEvents: "none", opacity: 0.5, zIndex: 0 }}>☁️</div>
      <div className="cloud-fast" style={{ position: "absolute", top: 110, right: "15%", fontSize: 48, pointerEvents: "none", opacity: 0.4, zIndex: 0 }}>☁️</div>
      <div className="cloud-slow" style={{ position: "absolute", top: "35%", left: "5%", fontSize: 32, pointerEvents: "none", opacity: 0.45, zIndex: 0 }}>☁️</div>
      <div className="cloud-fast" style={{ position: "absolute", top: "65%", right: "8%", fontSize: 40, pointerEvents: "none", opacity: 0.35, zIndex: 0 }}>☁️</div>
      <div className="tree-sway" style={{ position: "absolute", bottom: 84, left: -24, fontSize: 64, pointerEvents: "none", zIndex: 1 }}>🌴</div>
      <div className="tree-sway" style={{ position: "absolute", bottom: 120, right: -20, fontSize: 72, pointerEvents: "none", zIndex: 1 }}>🌴</div>
      <div className="ship-wobble" style={{ position: "absolute", bottom: "30%", left: "12%", fontSize: 36, pointerEvents: "none", opacity: 0.7, zIndex: 0 }}>⛵</div>
      <div style={{ position: "absolute", bottom: "45%", right: "4%", fontSize: 22, pointerEvents: "none", opacity: 0.3, zIndex: 0 }}>🐚</div>
      <div style={{ position: "absolute", top: "50%", left: "4%", fontSize: 28, pointerEvents: "none", opacity: 0.15, zIndex: 0 }}>🦁</div>
      <div style={{ position: "absolute", bottom: "15%", right: "12%", fontSize: 26, pointerEvents: "none", opacity: 0.2, zIndex: 0 }}>🦒</div>

      {/* Floating notifications / toasts */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: C.charcoal,
            color: C.white,
            borderRadius: 24,
            padding: "10px 20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap"
          }}
        >
          <span style={{ fontSize: 16 }}>⏳</span>
          <Txt size={12.5} weight={700} color={C.white}>
            {toastMessage}
          </Txt>
        </div>
      )}

      {/* Screen 1: Course Selection / Child Hub */}
      {activeTab === "home" && (
        <ChildWelcomeScreen
          child={child}
          slotUsed={slotUsed}
          slotLimit={slotLimit}
          onEnterAIPathway={(acadId) => {
            setSelectedAcademyId(acadId || "academy-1");
            setActiveTab("modules");
          }}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Screen 2: Course Modules List */}
      {activeTab === "modules" && (
        <ModulesOverview
          child={child}
          onSelectModule={(m) => {
            setSelModule(m);
            setActiveTab("module-details");
          }}
          lang={lang}
          onBack={() => setActiveTab("home")}
          slotLimit={slotLimit}
          slotUsed={slotUsed}
          theme={theme}
          selectedAcademyId={selectedAcademyId}
        />
      )}

      {/* Screen 2.5: Module Details Screen */}
      {activeTab === "module-details" && selModule && (
        <ModuleDetails
          child={child}
          module={selModule}
          onBack={() => setActiveTab("modules")}
          onStartModule={() => setActiveTab("lessons")}
          lang={lang}
        />
      )}

      {/* Screen 3: Module Hub winding path map */}
      {activeTab === "lessons" && selModule && (
        <LearningPath
          child={child}
          module={selModule}
          onSelectLesson={(l) => {
            setSelLesson(l);
            setActiveTab("chat");
          }}
          onBackToModules={() => setActiveTab("modules")}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Active Lesson Quiz & Chat Portal */}
      {activeTab === "chat" && (
        <LessonContent
          child={child}
          lesson={selLesson}
          onLessonComplete={handleLessonComplete}
          lang={lang}
          onClose={() => {
            setSelLesson(null);
            setActiveTab("lessons");
          }}
          onNextLesson={() => {
            if (selModule && selLesson) {
              const idx = selModule.lessons.findIndex((l) => l.id === selLesson.id);
              if (idx !== -1 && idx + 1 < selModule.lessons.length) {
                setSelLesson(selModule.lessons[idx + 1]);
              }
            }
          }}
        />
      )}

      {/* Analytics Student Profile */}
      {activeTab === "progress" && (
        <ChildProgressScreen
          child={child}
          onBack={() => setActiveTab("home")}
          lang={lang}
          parentEmail={parent ? parent.email : "guest"}
          onUpdateChild={onUpdateChild}
          theme={theme}
          onTabChange={setActiveTab}
        />
      )}

      {/* Games Arcade Screen */}
      {activeTab === "games" && (
        <ChildGames
          child={child}
          lang={lang}
          onAddXP={handleAddGamesXP}
        />
      )}

      {/* Rewards Milestones Screen */}
      {activeTab === "rewards" && (
        <ChildRewards
          child={child}
          lang={lang}
          onStartLearning={() => setActiveTab("home")}
          theme={theme}
          onUpdateChild={onUpdateChild}
        />
      )}

      {/* Primary child navigation dock (Always present unless inside Active Lesson screen for focus) */}
      {activeTab !== "chat" && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "10px 18px 22px",
            background: isDark ? "#0f172a" : "#ffffff",
            borderTop: isDark ? "3px solid #1e293b" : "3px solid #cbd5e1",
            display: "flex",
            justifyContent: "space-around",
            zIndex: 100
          }}
        >
          {[
            { id: "home" as const, label: "Learn", icon: "🗺️" },
            { id: "games" as const, label: "Games", icon: "🎮" },
            { id: "rewards" as const, label: "Rewards", icon: "🏆" },
            { id: "progress" as const, label: "Profile", icon: "📊" }
          ].map(({ id, label, icon }) => {
            const isSel = activeTab === id || 
              (id === "home" && (activeTab === "modules" || activeTab === "module-details" || activeTab === "lessons"));
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <span style={{ fontSize: 24, transition: "transform 0.15s ease", transform: isSel ? "scale(1.15)" : "none", opacity: isSel ? 1 : 0.45 }}>{icon}</span>
                <Txt size={11} weight={800} color={isSel ? "#0284c7" : "#64748b"}>
                  {label}
                </Txt>
              </button>
            );
          })}

          <button
            onClick={onExit}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4
            }}
          >
            <span style={{ fontSize: 24, opacity: 0.45 }}>🚪</span>
            <Txt size={11} weight={800} color="#64748b">
              Exit
            </Txt>
          </button>
        </div>
      )}
    </div>
  );
};
export default ChildApp;
