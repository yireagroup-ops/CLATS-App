/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Parent, Child, Language } from "../types";
import { downloadProgressReport } from "../utils/pdfGenerator";
import {
  C,
  F,
  AGE_LABEL,
  AGE_AGES,
  AGE_META,
  getTimeLog,
  fmt
} from "../utils/config";
import { CURRICULUM } from "../data/curriculum";
import { KobeAvatar } from "./KobeAvatar";
import { CLATSLogo } from "./CLATSLogo";
import {
  Sun,
  Moon,
  Bell,
  Globe,
  Award,
  BookOpen,
  Sparkles,
  Clock,
  TrendingUp,
  Compass,
  MessageSquare,
  Share2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  LogOut,
  HelpCircle,
  PlusCircle,
  Settings,
  Users,
  Activity,
  Calendar,
  Layers,
  Flame,
  CheckSquare,
  ArrowRight,
  ChevronLeft,
  Tv,
  Star,
  Check,
  Lock,
  Compass as CompassIcon,
  HelpCircle as HelpIcon,
  ShieldAlert,
  Download,
  Flame as FlameIcon,
  Smartphone,
  BookOpen as BookIcon,
  Award as MedalIcon,
  FileText,
  UserPlus,
  Play
} from "lucide-react";

interface ParentDashboardProps {
  parent: Parent;
  dbConnected?: boolean;
  isSyncing?: boolean;
  onEnterChildMode: (c: Child) => void;
  onNavigate: (screen: "addChild" | "settings" | "community") => void;
  onLogout: () => void;
  lang: Language;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parent,
  dbConnected,
  isSyncing,
  onEnterChildMode,
  onNavigate,
  onLogout,
  lang,
  theme,
  onToggleTheme,
  onLanguageChange
}) => {
  const children = parent.children || [];
  const [selChild, setSelChild] = useState<Child | null>(children[0] || null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activePathwayTab, setActivePathwayTab] = useState<string>("ai");

  // Keep child selection in sync
  const child = selChild && children.find((c) => c.id === selChild.id) ? selChild : children[0] || null;

  const isDark = theme === "dark";
  const feedbackFormUrl = "https://forms.gle/ZFXJJZgn8bLXKRUn9";

  // Mock total seconds to calculate screen time
  const log = child ? getTimeLog(child.id) : { morning: 0, afternoon: 0, evening: 0 };
  const totalSecsToday = (log.morning || 0) + (log.afternoon || 0) + (log.evening || 0);
  const computedMinsToday = Math.round(totalSecsToday / 60) || 15;

  const streakDays = child ? child.streak || 5 : 5;
  const childXp = child ? child.xp || 420 : 420;

  // Language mapping fallback dictionary
  const dict: Record<Language, Record<string, string>> = {
    en: {
      heroTitle: `Welcome Back, ${parent.name || "Parent"} 👋`,
      heroDesc: "Track your child's journey from technology consumer to future creator.",
      badgeText: "🚀 CLATS Early Access Family",
      feedbackBtn: "Share Feedback",
      learningRoadmap: "Learning Roadmap",
      roadmapDesc: "See where your child currently sits within the CLATS Future-Tech Curriculum.",
      focusTitle: "Current Learning Focus",
      pathwayName: "🤖 Artificial Intelligence Pathway",
      currentModule: "AI Discovery",
      currentLesson: "History of Technology",
      nextLesson: "History of Artificial Intelligence",
      progressText: "Lesson 1 of 10",
      moduleProgress: "Module Progress",
      statusBadge: "🟡 Curriculum In Development",
      journeyTitle: "Artificial Intelligence Journey",
      skillsGrowth: "Future-Tech Skills Growth",
      recentActivity: "Recent Learning Activity",
      insightsTitle: "CLATS Learning Insights",
      updatesTitle: "Platform Development Updates",
      achievementsTitle: "Child Achievements",
      screentimeTitle: "Screen Time Analytics",
      actionCenterTitle: "Parent Action Center",
      multiFamilyTitle: "Multi-Child Family Analytics",
      compareBtn: "Compare Child Progress",
      communityTitle: "Upcoming Parent Academy Sessions",
      logoutText: "Logout",
      adjustLimit: "Adjust controls"
    },
    yo: {
      heroTitle: `Kaabo Padà, ${parent.name || "Kolo"} 👋`,
      heroDesc: "Tọpinpin irin-ajo ọmọ rẹ lati jẹ olumulo imọ-ẹrọ si olupilẹṣẹ ọjọ iwaju.",
      badgeText: "🚀 CLATS Ẹgbẹ Wiwọle Ni Tete",
      feedbackBtn: "Fi Esi Ranṣẹ",
      learningRoadmap: "Oju-ọna Ẹkọ wa",
      roadmapDesc: "Wo ibi ti ọmọ rẹ wa ninu Eto Ẹkọ Imọ-ẹrọ CLATS ti Ọjọ Iwaju.",
      focusTitle: "Ojúfẹ́ Ẹ̀kọ́ Lọ́wọ́lọ́wọ́",
      pathwayName: "🤖 Imọ-jinlẹ Oríkĕ (AI) Ọna Ẹkọ",
      currentModule: "Awari Imọ Oríkĕ (AI)",
      currentLesson: "Itan-akọọlẹ ti Imọ-ẹrọ",
      nextLesson: "Itan Oríkĕ Imọ-jinlẹ ti (AI)",
      progressText: "Ẹkọ 1 ninu 10",
      moduleProgress: "Ilọsiwaju Module",
      statusBadge: "🟡 Program Ẹkọ Ninu Idagbasoke",
      journeyTitle: "Irin-ajo Imọ Oríkĕ (AI)",
      skillsGrowth: "Idagbasoke Imọ-ẹrọ Ọjọ Iwaju",
      recentActivity: "Iṣẹ Ẹkọ Tuntun",
      insightsTitle: "Awọn Imọye Ẹkọ CLATS",
      updatesTitle: "Awọn Imudojuiwọn Platform",
      achievementsTitle: "Awọn Aṣeyọri Ọmọ",
      screentimeTitle: "Tuntun Akoko Iboju",
      actionCenterTitle: "Gbongan Awọn Iṣẹ Obi",
      multiFamilyTitle: "Itupalẹ Ọmọ lọpọlọpọ",
      compareBtn: "Fi Ilọsiwaju Ọmọ Wé Ọmọ",
      communityTitle: "Awọn Apejọ Obi ti n bọ",
      logoutText: "Jade Kuro",
      adjustLimit: "Ṣatunṣe akoko"
    },
    ig: {
      heroTitle: `Nnọọ Nne na Nna, ${parent.name || "Nna"} 👋`,
      heroDesc: "Tuo ụzọ mmụta nwa gị site na onye na-eji teknụzụ gaa na onye nrụpụta ọhụrụ.",
      badgeText: "🚀 CLATS Ezinụlọ Nweta Mbụ",
      feedbackBtn: "Ziga Atụmatụ",
      learningRoadmap: "Map Ụzọ Mmụta",
      roadmapDesc: "Hụ ebe nwa gị nọ ugbu a n'ime mmụta teknụzụ CLATS.",
      focusTitle: "Ihe weere Onodu Omumu Ugbu a",
      pathwayName: "🤖 Ụzọ Nkà rụrụ Ọrụ (AI)",
      currentModule: "Ọmụmụ AI Discovery",
      currentLesson: "Akụkọ Ihe Mere Eme nke Teknụzụ",
      nextLesson: "Akụkọ Nkà rụrụ Ọrụ (AI)",
      progressText: "Ihe omumu 1 n'ime 10",
      moduleProgress: "Ọganihu Usoro Omumu",
      statusBadge: "🟡 Usoro Mmụta Na-etolite Etolite",
      journeyTitle: "Njem Nkà rụrụ Ọrụ (AI)",
      skillsGrowth: "Ntolite Nkà Teknụzụ Ọdịnihu",
      recentActivity: "Ihe Omume Mmụta Ọhụrụ",
      insightsTitle: "Atụmatụ Mmụta CLATS",
      updatesTitle: "Mmelite Mmụta Platform",
      achievementsTitle: "Ihe Nrite Ụmụaka",
      screentimeTitle: "Nnyonye anya Oge Nlele Ihuenyo",
      actionCenterTitle: "Ebe Ihe Omume Ndị Nne na Nna",
      multiFamilyTitle: "Nyocha Ezinụlọ nwere Ọtụtụ Ụmụ",
      compareBtn: "Tụlee Ọganihu Ha",
      communityTitle: "Nzukọ Ndị Nne na Nna Na-abịa",
      logoutText: "Pụọ",
      adjustLimit: "Mezie njikwa"
    }
  };

  const t = dict[lang] || dict.en;

  // Modern children profiles switcher data adaptor
  const handleSwitchChild = (c: Child) => {
    setSelChild(c);
  };

  // Mock notifications structure
  const notificationsList = [
    {
      id: 1,
      title: "New Lesson Unlocked!",
      desc: child ? `${child.name} is ready for "History of Artificial Intelligence"` : "New content ready on your child's learning pathway.",
      time: "10 mins ago",
      icon: "🎉",
      badgeColor: "bg-teal-50 text-teal-600"
    },
    {
      id: 2,
      title: "Weekly Parent Workshop",
      desc: "Register for the upcoming 'AI & Screen Safety for Kids' panel discussion on Saturday.",
      time: "2 hours ago",
      icon: "📅",
      badgeColor: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDark ? "bg-[#0F172A] text-white" : "bg-[#FFFFFF] text-[#111111]"}`}>
      
      {/* GLOBAL PILOT ANNOUNCEMENT BANNER */}
      <div className="bg-[#2EC4B6] text-white px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-sm font-sans">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold tracking-tight m-0">
            {t.badgeText} <span className="font-normal opacity-90 block sm:inline sm:ml-2">| Direct portal tracking optimized for low-bandwidth environments.</span>
          </p>
        </div>
        <a
          href={feedbackFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#111111] hover:bg-slate-100 px-4 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          {t.feedbackBtn}
        </a>
      </div>

      {/* STICKY MAIN HEADER NAV PANEL */}
      <header id="tour-parent-header" className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md px-6 py-4 ${
        isDark ? "bg-[#0F172A]/90 border-slate-800" : "bg-white/95 border-[#EAEAEA]"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3.5">
            <div className="bg-[#2EC4B6] h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              C
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none uppercase text-[#2EC4B6]">CLATS</h1>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider block mt-1">INTELLIGENCE CENTER</span>
            </div>
          </div>

          {/* Database Integration status badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono select-none ${
            dbConnected 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-500"
          }`}>
            <span className={`w-2 h-2 rounded-full ${dbConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="font-bold uppercase tracking-wider text-[11px]">
              {dbConnected ? "Supabase Synced" : "Local Sandbox Mode"}
            </span>
            {isSyncing && (
              <span className="animate-pulse text-[10px] text-slate-400 font-sans lowercase italic">
                (syncing...)
              </span>
            )}
          </div>

          {/* Quick Header Widget Controls (Notifications and Switcher Indicator) */}
          <div className="flex items-center gap-4">
            
            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isDark ? "border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300" : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <div className="relative">
                  <Bell size={22} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-3.5 w-80 rounded-2xl border p-4 shadow-2xl z-50 transition-all ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-base font-black uppercase tracking-wider text-slate-500">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-base font-bold text-[#2EC4B6] hover:underline">Close</button>
                  </div>
                  <div className="space-y-3">
                    {notificationsList.map((notif) => (
                      <div key={notif.id} className={`p-3 rounded-xl border flex gap-2.5 ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                        <span className="text-lg">{notif.icon}</span>
                        <div>
                          <p className="text-base font-black m-0 leading-tight">{notif.title}</p>
                          <p className="text-sm text-slate-500 mt-1 leading-snug">{notif.desc}</p>
                          <span className="text-xs text-slate-400 font-mono block mt-1">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Child Shortcut Avatar */}
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#B8A0FF] to-[#2EC4B6] flex items-center justify-center text-white font-extrabold text-lg shadow shadow-purple-500/20">
              {(parent.name || "P")[0].toUpperCase()}
            </div>
            
          </div>

        </div>
      </header>

      {/* MAIN BODY LAYOUT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        
        {/* HERO GREETING SECTION */}
        <section className={`p-8 rounded-2xl border transition-all duration-300 ${
          isDark 
            ? "bg-[#111827] border-slate-800 text-white" 
            : "bg-[#FFFFFF] border-[#EAEAEA] shadow-sm text-[#111111]"
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#2EC4B6]/10 text-[#2EC4B6]">
                {t.badgeText}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight m-0">
                Welcome Back, {parent.name || "Family"}
              </h2>
              <p className={`text-sm max-w-2xl m-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {t.heroDesc}
              </p>
            </div>
            <a
              id="tour-feedback-button"
              href={feedbackFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#2EC4B6] hover:bg-teal-600 text-white font-bold text-xs tracking-wide uppercase transition-colors self-start md:self-auto flex items-center gap-1.5"
            >
              <span>{t.feedbackBtn}</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </section>


        {/* CHILD PROFILES SECTION */}
        <section id="tour-child-profiles" className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold tracking-tight m-0">Child Pathway Trackers</h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Select a child to inspect active learning parameters.</p>
            </div>
            <button
              onClick={() => onNavigate("addChild")}
              className={`text-xs font-semibold py-2 px-4 rounded-lg border flex items-center gap-2 transition-all ${
                isDark ? "bg-[#111827] border-slate-800 hover:bg-slate-800" : "bg-white border-[#EAEAEA] shadow-sm hover:bg-slate-50"
              }`}
            >
              <PlusCircle size={15} className="text-[#2EC4B6]" />
              <span>Enroll Child Profile</span>
            </button>
          </div>

          {/* Children List Grid */}
          {children.length === 0 ? (
            <div className={`p-10 rounded-2xl border text-center space-y-4 ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA]"}`}>
              <h4 className="text-base font-bold">No Child Enrolled</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Add a child study profile to begin customizing screen milestones, educational pathways, and guides.</p>
              <button onClick={() => onNavigate("addChild")} className="px-5 py-2 rounded-lg bg-[#2EC4B6] text-white font-bold text-xs uppercase hover:bg-teal-600 transition-colors">
                Add Child Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((c) => {
                const isSelected = child?.id === c.id;
                const cXp = c.xp || 420;
                const cStreak = c.streak || 5;
                const progressPct = Object.keys(c.completed || {}).length > 0 ? Math.round((Object.keys(c.completed || {}).length / 10) * 100) : 12;

                return (
                  <div
                    key={c.id}
                    onClick={() => handleSwitchChild(c)}
                    className={`p-6 rounded-2xl border cursor-pointer relative overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? isDark
                          ? "bg-[#111827] border-[#2EC4B6] shadow-sm text-white"
                          : "bg-white border-2 border-[#2EC4B6] shadow-sm text-[#111111]"
                        : isDark
                          ? "bg-[#111827]/40 border-slate-800 hover:border-slate-700 text-slate-300"
                          : "bg-white border-[#EAEAEA] shadow-sm hover:border-slate-300 text-slate-800"
                    }`}
                  >
                    
                    {/* Selected Indicator Pill */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-[#2EC4B6] text-white px-3 py-1 rounded-bl-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Check size={9} strokeWidth={3} /> Active Track
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      {/* Initials Avatar sphere */}
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isSelected ? "bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[#EAEAEA] dark:border-slate-700"
                      }`}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-base font-bold tracking-tight m-0">{c.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 font-bold block uppercase">
                          {AGE_LABEL[c.ageGroup]} (Ages {AGE_AGES[c.ageGroup]})
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats list inside profile box */}
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Current Path:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">AI Foundations</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Progress:</span>
                        <span className="font-bold text-[#2EC4B6]">{progressPct}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Streak:</span>
                        <span className="font-bold text-[#2EC4B6]">{cStreak} Days</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">XP Earned:</span>
                        <span className="font-bold text-[#2EC4B6]">{cXp} XP</span>
                      </div>
                    </div>

                    {/* View Action CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterChildMode(c);
                      }}
                      className="mt-5 w-full py-2 px-4 rounded-lg text-xs font-bold tracking-wider uppercase text-center transition-all bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/20 hover:bg-[#2EC4B6] hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <span>Enter Child Mode</span>
                      <ArrowRight size={12} />
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </section>


        {/* MAIN DOCK: CURRICULUM ROADMAP SECTION */}
        {child && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 5 COLS: CURRICULUM OVERVIEW SECTION */}
            <div id="tour-current-path" className="lg:col-span-12 xl:col-span-5 space-y-6">
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className="space-y-1 mb-6">
                  <span className="h-6 w-6 rounded bg-[#B8A0FF]/15 text-[#B8A0FF] text-xs font-black flex items-center justify-center font-mono">MAP</span>
                  <h3 className="text-xl font-extrabold tracking-tight m-0">{t.learningRoadmap}</h3>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{t.roadmapDesc}</p>
                </div>

                {/* VISUAL ROADMAP LISTING */}
                <div id="tour-pathway-progress" className="space-y-4 relative before:absolute before:top-4 before:bottom-4 before:left-7 before:w-1 before:bg-slate-400/20">
                  
                  {/* Item 1: Active Highlighted */}
                  <div className={`relative p-4.5 rounded-xl border flex items-center gap-4 transition-all ${
                    isDark ? "bg-[#2EC4B6]/10 border-[#2EC4B6]/30 text-white" : "bg-teal-50/70 border-[#2EC4B6]/40 text-slate-950"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-[#2EC4B6] text-white flex items-center justify-center font-black text-2xl z-10 shadow-md shadow-teal-500/20">
                      🤖
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black tracking-tight uppercase leading-none m-0">Artificial Intelligence</h4>
                      <p className="text-base text-teal-600 mt-1.5 font-bold m-0 font-mono">Phase 1 - Active Focus</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2EC4B6]/20 text-[#2EC4B6] rounded text-xs font-black uppercase font-mono">Current Pathway</span>
                  </div>

                  {/* Item 2: Digital Literacy */}
                  <div className={`relative p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/40 border-slate-850 text-slate-400" : "bg-slate-50 border-slate-200/60 text-slate-600"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-black text-2xl z-10">
                      🌐
                    </div>
                    <div>
                      <h4 className="text-lg font-bold leading-none m-0">Digital Literacy</h4>
                      <p className="text-sm text-[#FFD166] mt-1.5 font-bold m-0 font-mono">Coming Soon</p>
                    </div>
                  </div>

                  {/* Item 3: Cybersecurity */}
                  <div className={`relative p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/40 border-slate-850 text-slate-400" : "bg-slate-50 border-slate-200/60 text-slate-600"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-black text-2xl z-10">
                      🔒
                    </div>
                    <div>
                      <h4 className="text-lg font-bold leading-none m-0">Cybersecurity</h4>
                      <p className="text-sm text-[#FFD166] mt-1.5 font-bold m-0 font-mono">Coming Soon</p>
                    </div>
                  </div>

                  {/* Item 4: Blockchain & Web3 */}
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/20 border-slate-850/60 opacity-60 text-slate-500" : "bg-slate-50 border-slate-100 opacity-70 text-slate-500"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-2xl">
                      ⛓
                    </div>
                    <div>
                      <h4 className="text-lg font-medium leading-none m-0">Blockchain & Web3</h4>
                      <p className="text-sm text-slate-400 mt-1.5 font-bold m-0 font-mono">Future Rollout</p>
                    </div>
                  </div>

                  {/* Item 5: Design & Creativity */}
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/20 border-slate-850/60 opacity-60 text-slate-500" : "bg-slate-50 border-slate-100 opacity-70 text-slate-500"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-2xl">
                      🎨
                    </div>
                    <div>
                      <h4 className="text-lg font-medium leading-none m-0">Design & Creativity</h4>
                      <p className="text-sm text-slate-400 mt-1.5 font-bold m-0 font-mono">Future Rollout</p>
                    </div>
                  </div>

                  {/* Item 6: DevOps */}
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/20 border-slate-850/60 opacity-60 text-slate-500" : "bg-slate-50 border-slate-100 opacity-70 text-slate-500"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-2xl">
                      ⚙
                    </div>
                    <div>
                      <h4 className="text-lg font-medium leading-none m-0">DevOps</h4>
                      <p className="text-sm text-slate-400 mt-1.5 font-bold m-0 font-mono">Future Rollout</p>
                    </div>
                  </div>

                  {/* Item 7: Career Readiness */}
                  <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                    isDark ? "bg-slate-950/20 border-slate-850/60 opacity-60 text-slate-500" : "bg-slate-50 border-slate-100 opacity-70 text-slate-500"
                  }`}>
                    <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-2xl">
                      🚀
                    </div>
                    <div>
                      <h4 className="text-lg font-medium leading-none m-0">Career Readiness</h4>
                      <p className="text-sm text-slate-400 mt-1.5 font-bold m-0 font-mono">Future Rollout</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* OUTCOME REPORT: AI PATHWAY PROGRESS CARD */}
              <div id="tour-learning-progress" className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <h4 className="text-sm font-extrabold uppercase mt-0 mb-4 tracking-wider text-slate-400 font-mono">{t.journeyTitle}</h4>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Custom built Progress radial circle */}
                  <div className="relative h-28 w-28 flex items-center justify-center flex-shrink-0">
                    <svg className="h-full w-full transform -rotate-90 z-10" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke={isDark ? "rgba(255,255,255,0.05)" : "#E2E8F0"} strokeWidth="8" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="#B8A0FF" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 13) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-[#B8A0FF]">13%</span>
                      <span className="text-[8px] font-extrabold uppercase text-slate-400 font-mono">Completion</span>
                    </div>
                  </div>

                  {/* Quantitative indicators list */}
                  <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Modules</span>
                      <strong className="text-base text-white dark:text-slate-100 font-extrabold">1 <span className="text-xs text-slate-400">/ 6</span></strong>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Lessons</span>
                      <strong className="text-base text-[#2EC4B6] font-extrabold">8 <span className="text-xs text-slate-400">/ 60</span></strong>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Quizzes</span>
                      <strong className="text-base text-[#FFD166] font-extrabold">3 <span className="text-xs text-slate-400">/ 12</span></strong>
                    </div>
                    <div className={`p-3 rounded-xl border ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Projects</span>
                      <strong className="text-base text-[#B8A0FF] font-extrabold">0 <span className="text-xs text-slate-400">/ 6</span></strong>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT 7 COLS: CURRENT COGNITIVE TIMELINE MAP CONTAINER */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* CURRENT PATHWAY INFORMATION: LEARNING JOURNEY CARD */}
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA]"}`}>
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 m-0 font-mono">Learning Journey Card</h4>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Pathway</span>
                      <strong className={`text-sm font-bold block mt-1 ${isDark ? "text-white" : "text-[#111111]"}`}>Artificial Intelligence</strong>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Current Module</span>
                      <strong className={`text-sm font-bold block mt-1 ${isDark ? "text-white" : "text-[#111111]"}`}>AI Foundations</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Current Lesson</span>
                      <strong className={`text-sm font-bold block mt-1 ${isDark ? "text-white" : "text-[#111111]"}`}>History of AI</strong>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Progress</span>
                      <strong className="text-sm font-bold block mt-1 text-[#2EC4B6]">12%</strong>
                    </div>
                  </div>

                  {/* Modern progress bar with Turquoise fill */}
                  <div className="space-y-2 pt-2">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                      <div className="h-full w-[12%] rounded-full bg-[#2EC4B6]" />
                    </div>
                  </div>

                </div>
              </div>

              {/* DUOLINGO MAP PATHWAY: LESSON MAP PROGRESS */}
              <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold uppercase tracking-wide tracking-wider m-0 font-mono text-[#B8A0FF]">AI DISCOVERY ROADMAP</h3>
                  </div>
                  <Compass size={30} className="text-[#B8A0FF]" />
                </div>

                {/* VISUAL CANDY-CRUSH / DUOLINGO STYLE PATHWAY NODES */}
                <div className="flex flex-col items-center justify-center space-y-10 relative py-4">
                  
                  {/* Flow curve connection line */}
                  <div className="absolute top-8 bottom-8 left-1/2 w-1.5 bg-gradient-to-b from-[#2EC4B6] via-[#B8A0FF] to-slate-400/20 transform -translate-x-1/2 z-0" />

                  {/* Node 1: Completed */}
                  <div className="flex flex-col items-center relative z-10 transform translate-x-3 transition-transform hover:scale-110">
                    <div className="h-20 w-20 rounded-full bg-green-500 border-4 border-white/15 dark:border-slate-900 text-white flex items-center justify-center text-3xl shadow-lg shadow-green-500/20 font-bold">
                      ✓
                    </div>
                    <div className={`mt-2 px-3 py-1.5 rounded-xl text-base font-extrabold border bg-green-500/10 border-green-500/30 text-green-500 text-center shadow-sm`}>
                      History of Technology
                    </div>
                  </div>

                  {/* Node 2: Active (Current focus) */}
                  <div className="flex flex-col items-center relative z-10 transform -translate-x-5 transition-transform hover:scale-110">
                    <div className="h-22 w-22 rounded-full bg-[#2EC4B6] border-4 border-white/15 dark:border-slate-900 text-black flex items-center justify-center text-4xl shadow-xl shadow-teal-500/30 font-bold animate-bounce">
                      🟢
                    </div>
                    <div className="absolute -top-3 px-2.5 py-1 bg-[#B8A0FF] text-slate-950 font-black text-xs rounded uppercase font-mono tracking-widest leading-none">
                      Active
                    </div>
                    <div className={`mt-2 px-3 py-1.5 rounded-xl text-base font-extrabold border bg-[#2EC4B6]/15 border-[#2EC4B6]/50 text-[#2EC4B6] text-center shadow-sm`}>
                      History of AI
                    </div>
                  </div>

                  {/* Node 3: Locked */}
                  <div className="flex flex-col items-center relative z-10 transform translate-x-6 transition-transform hover:scale-115">
                    <div className="h-19 w-19 rounded-full bg-slate-400/20 border-4 border-slate-700/10 text-slate-400 flex items-center justify-center text-3xl">
                      <Lock size={22} />
                    </div>
                    <div className={`mt-2 px-3 py-1.5 rounded-xl text-base font-extrabold text-slate-400 text-center`}>
                      🔒 What Is AI?
                    </div>
                  </div>

                  {/* Node 4: Locked */}
                  <div className="flex flex-col items-center relative z-10 transform -translate-x-4 transition-transform hover:scale-115">
                    <div className="h-19 w-19 rounded-full bg-slate-400/20 border-4 border-slate-700/10 text-slate-400 flex items-center justify-center text-3xl">
                      <Lock size={22} />
                    </div>
                    <div className={`mt-2 px-3 py-1.5 rounded-xl text-base font-extrabold text-slate-400 text-center`}>
                      🔒 AI Around Us
                    </div>
                  </div>

                  {/* Horizontal node grids to pack the other lessons */}
                  <div className="w-full border-t border-dashed border-slate-400/10 pt-6 mt-4">
                    <p className="text-center text-base uppercase font-mono tracking-wider text-slate-400 font-bold mb-4">Remaining Module Roadmap</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "🔒 Meet Smart Machines",
                        "🔒 AI Helpers",
                        "🔒 AI Safety",
                        "🔒 Mini Quiz",
                        "🔒 AI Challenge",
                        "🔒 Module Completion"
                      ].map((item, id) => (
                        <div key={id} className={`p-3 rounded-lg border text-center text-base font-bold ${
                          isDark ? "bg-slate-950/40 border-slate-850/60 text-slate-500" : "bg-slate-50 border-slate-200/50 text-slate-400"
                        }`}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>
        )}


        {/* ACADEMIC SKILL DEVELOPMENT DASHBOARD */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight m-0">{t.skillsGrowth}</h3>
            <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Bento-grid academic assessment across future cognitive milestones.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Skill Cell 1: AI Understanding */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#2EC4B6] text-[10px] tracking-wider">AI Understanding</span>
                <span className="h-6 w-6 rounded-full bg-[#2EC4B6]/10 text-[#2EC4B6] text-xs font-bold flex items-center justify-center">65%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Advanced</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-[#2EC4B6] rounded-full" />
                </div>
              </div>
            </div>

            {/* Skill Cell 2: Problem Solving */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#B8A0FF] text-[10px] tracking-wider">Problem Solving</span>
                <span className="h-6 w-6 rounded-full bg-[#B8A0FF]/10 text-[#B8A0FF] text-xs font-bold flex items-center justify-center">58%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Capable</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[58%] bg-[#B8A0FF] rounded-full" />
                </div>
              </div>
            </div>

            {/* Skill Cell 3: Digital Confidence */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#FFD166] text-[10px] tracking-wider">Digital Confidence</span>
                <span className="h-6 w-6 rounded-full bg-[#FFD166]/10 text-[#FFD166] text-xs font-bold flex items-center justify-center">61%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Exceptional</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[61%] bg-[#FFD166] rounded-full" />
                </div>
              </div>
            </div>

            {/* Skill Cell 4: Creativity */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#2EC4B6] text-[10px] tracking-wider">Creativity</span>
                <span className="h-6 w-6 rounded-full bg-[#2EC4B6]/10 text-[#2EC4B6] text-xs font-bold flex items-center justify-center">55%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Expressive</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[55%] bg-[#2EC4B6] rounded-full" />
                </div>
              </div>
            </div>

            {/* Skill Cell 5: Technology Awareness */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#B8A0FF] text-[10px] tracking-wider">Tech Awareness</span>
                <span className="h-6 w-6 rounded-full bg-[#B8A0FF]/10 text-[#B8A0FF] text-xs font-bold flex items-center justify-center">72%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Top Tier 🏆</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-[#B8A0FF] rounded-full" />
                </div>
              </div>
            </div>

            {/* Skill Cell 6: Responsible Tech Use */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all hover:scale-103 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-sx font-extrabold uppercase font-mono text-[#FFD166] text-[10px] tracking-wider">Responsible Tech</span>
                <span className="h-6 w-6 rounded-full bg-[#FFD166]/10 text-[#FFD166] text-xs font-bold flex items-center justify-center">69%</span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black m-0">Highly Safe</p>
                <div className="h-2 w-full bg-slate-400/10 rounded-full overflow-hidden">
                  <div className="h-full w-[69%] bg-[#FFD166] rounded-full" />
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* RECENT HISTORIC LEARNING TIMELINE */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: ACTIVITY CARDS */}
          <div id="tour-recent-activity" className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold uppercase tracking-wider m-0 font-mono text-[#2EC4B6]">{t.recentActivity}</h3>
              <Activity size={20} className="text-[#2EC4B6]" />
            </div>

            <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-slate-400/20">
              
              {/* Event 1 */}
              <div className="relative pl-8 space-y-1.5">
                <span className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full bg-[#2EC4B6]/30 border-4 border-[#2EC4B6] z-10" />
                <span className="text-[10px] uppercase font-mono text-[#2EC4B6] font-bold block">🌟 Today</span>
                <h4 className="text-sm font-extrabold m-0 leading-tight">Completed: History of Technology</h4>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
                  <span className="px-2 py-0.5 bg-green-500/15 text-green-500 rounded font-bold">100% Score</span>
                  <span className="px-2 py-0.5 bg-[#B8A0FF]/15 text-[#B8A0FF] rounded font-bold">AI Explorer Badge</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative pl-8 space-y-1.5">
                <span className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full bg-[#B8A0FF]/30 border-4 border-[#B8A0FF] z-10" />
                <span className="text-[10px] uppercase font-mono text-[#B8A0FF] font-bold block">🧠 Yesterday</span>
                <h4 className="text-sm font-extrabold m-0 leading-tight">Completed: Technology Around Us</h4>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
                  <span className="px-2 py-0.5 bg-amber-500/15 text-amber-500 rounded font-bold">Earned: 20 XP</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative pl-8 space-y-1.5">
                <span className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full bg-[#FFD166]/30 border-4 border-[#FFD166] z-10" />
                <span className="text-[10px] uppercase font-mono text-amber-500 font-bold block">🎯 3 Days Ago</span>
                <h4 className="text-sm font-extrabold m-0 leading-tight">Completed: Module Quiz</h4>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-1">
                  <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-500 rounded font-bold">Score: 80%</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: LEARNING RECOMMENDATIONS & INSIGHTS */}
          <div id="tour-parent-insights" className={`p-6 rounded-2xl border shadow-sm ${
            isDark 
              ? "bg-[#111827] border-slate-800" 
              : "bg-white border-[#EAEAEA]"
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#2EC4B6]/10 rounded-lg text-[#2EC4B6]">
                <Activity size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase m-0 font-mono text-[#2EC4B6] tracking-wider">AI Learning Insights</h3>
                <p className={`text-[10px] font-mono m-0 ${isDark ? "text-white" : "text-black"}`}>Dynamic Coaching Analytics</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl border-l-4 border-[#2EC4B6] ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold m-0 leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  <strong className="text-[#2EC4B6] font-bold">{child?.name || "Levi"}</strong> performs best during morning learning sessions.
                </p>
              </div>

              <div className={`p-4 rounded-xl border-l-4 border-[#2EC4B6] ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold m-0 leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  AI Literacy progress increased by <strong className="text-[#2EC4B6] font-bold">8%</strong> this week.
                </p>
              </div>

              <div className={`p-4 rounded-xl border-l-4 border-[#2EC4B6] ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <p className={`text-xs font-semibold m-0 leading-relaxed ${isDark ? "text-white" : "text-black"}`}>
                  Quiz performance remains consistently above average.
                </p>
              </div>
            </div>

          </div>

        </section>


        {/* DUAL CARD ROW: CURRICULUM UPDATES LEVEL & BADGES */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. CURRICULUM STATUS CARD */}
          <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-base font-extrabold uppercase tracking-wider mt-0 mb-4 font-mono text-[#FFD166]">{t.updatesTitle}</h3>
            
            <div className="space-y-3">
              {[
                { name: "Artificial Intelligence", status: "🟢 Rolling Out" },
                { name: "Digital Literacy", status: "🟡 In Production" },
                { name: "Cybersecurity", status: "🟡 In Production" },
                { name: "Blockchain & Web3", status: "⚪ Planned" },
                { name: "Design & Creativity", status: "⚪ Planned" },
                { name: "DevOps", status: "⚪ Planned" },
                { name: "Career Readiness", status: "⚪ Planned" }
              ].map((item, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border flex justify-between items-center text-xs ${
                  isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-50 border-slate-100"
                }`}>
                  <span className="font-bold">{item.name}</span>
                  <span className="font-mono font-black text-[10px]">{item.status}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-4 m-0 italic">
              New lessons are added regularly as CLATS expands its curriculum.
            </p>
          </div>

          {/* 2. MODERN ACHIEVEMENTS GRID CARDS */}
          <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-base font-extrabold uppercase tracking-wider mt-0 mb-4 font-mono text-[#B8A0FF]">{t.achievementsTitle}</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              {/* Badge 1 */}
              <div className={`p-3.5 rounded-xl border text-center space-y-2 hover:scale-105 transition-all ${
                isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200/50"
              }`}>
                <span className="text-3xl block">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-tight block">AI Explorer</span>
              </div>

              {/* Badge 2 */}
              <div className={`p-3.5 rounded-xl border text-center space-y-2 hover:scale-105 transition-all ${
                isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200/50"
              }`}>
                <span className="text-3xl block">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-tight block">Lesson Complete</span>
              </div>

              {/* Badge 3 */}
              <div className={`p-3.5 rounded-xl border text-center space-y-2 hover:scale-105 transition-all ${
                isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200/50"
              }`}>
                <span className="text-3xl block">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-tight block">5 Day Streak</span>
              </div>

              {/* Badge 4 */}
              <div className={`p-3.5 rounded-xl border text-center space-y-2 hover:scale-105 transition-all ${
                isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200/50"
              }`}>
                <span className="text-3xl block">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-tight block">Quiz Champion</span>
              </div>

              {/* Badge 5 */}
              <div className={`p-3.5 rounded-xl border text-center space-y-2 hover:scale-105 transition-all ${
                isDark ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-200/50"
              }`}>
                <span className="text-3xl block">🏅</span>
                <span className="text-[10px] font-black uppercase tracking-tight block">Early Innovator</span>
              </div>

            </div>
          </div>

        </section>


        {/* SCREEN TIME & PERFORMANCE KPI CARDS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-[#2EC4B6]" />
            <h3 className="text-base font-bold uppercase m-0 font-mono tracking-wider text-[#2EC4B6]">Analytics Summary</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* KPI CARD 1: LEARNING TIME */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA] shadow-sm hover:shadow-md"}`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-[#2EC4B6]" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Learning Time</span>
                  <strong className={`text-2xl font-black block mt-2 ${isDark ? "text-white" : "text-[#111111]"}`}>{computedMinsToday} mins</strong>
                </div>
                <div className="p-2 bg-[#2EC4B6]/10 rounded-lg text-[#2EC4B6]">
                  <Clock size={16} />
                </div>
              </div>
            </div>

            {/* KPI CARD 2: LESSONS COMPLETED */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA] shadow-sm hover:shadow-md"}`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-[#2EC4B6]" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Lessons Completed</span>
                  <strong className={`text-2xl font-black block mt-2 ${isDark ? "text-white" : "text-[#111111]"}`}>
                    {child ? Object.keys(child.completed || {}).length : 12} / 56
                  </strong>
                </div>
                <div className="p-2 bg-[#2EC4B6]/10 rounded-lg text-[#2EC4B6]">
                  <BookOpen size={16} />
                </div>
              </div>
            </div>

            {/* KPI CARD 3: QUIZ AVERAGE */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA] shadow-sm hover:shadow-md"}`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-[#2EC4B6]" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Quiz Average</span>
                  <strong className={`text-2xl font-black block mt-2 ${isDark ? "text-white" : "text-[#111111]"}`}>82%</strong>
                </div>
                <div className="p-2 bg-[#2EC4B6]/10 rounded-lg text-[#2EC4B6]">
                  <Award size={16} />
                </div>
              </div>
            </div>

            {/* KPI CARD 4: CURRENT STREAK */}
            <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA] shadow-sm hover:shadow-md"}`}>
              <div className="absolute top-0 left-0 h-1 w-full bg-[#2EC4B6]" />
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Current Streak</span>
                  <strong className={`text-2xl font-black block mt-2 ${isDark ? "text-white" : "text-[#111111]"}`}>{streakDays} Days</strong>
                </div>
                <div className="p-2 bg-[#2EC4B6]/10 rounded-lg text-[#2EC4B6]">
                  <Flame size={16} />
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* PARENT ACTION CENTER & MULTI-CHILD STATS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUMN 1: PARENT ACTION CENTER */}
          <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-lg font-extrabold uppercase mt-0 mb-4 tracking-wider font-mono text-[#B8A0FF]">{t.actionCenterTitle}</h3>
            
            <div className="space-y-4">
              <a
                href={feedbackFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-xl border flex items-center justify-between text-base font-semibold hover:translate-x-1.5 transition-all text-left ${
                  isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700" : "bg-slate-50 border-slate-150 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">📩 Submit Feedback Form</span>
                <ChevronRight size={18} className="text-slate-400" />
              </a>

              <button
                onClick={() => onNavigate("community")}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-base font-semibold hover:translate-x-1.5 transition-all text-left ${
                  isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700" : "bg-slate-50 border-slate-150 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">👥 Join Parent Tech Community</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              <button
                onClick={() => downloadProgressReport(parent)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-base font-semibold hover:translate-x-1.5 transition-all text-left ${
                  isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700" : "bg-slate-50 border-slate-150 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">📊 Download PDF Progress Report</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              <button
                onClick={() => alert("Booking slot for direct Zoom consultation...")}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-base font-semibold hover:translate-x-1.5 transition-all text-left ${
                  isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700" : "bg-slate-50 border-slate-150 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">🎓 Book Parent-Teacher Tech Workshop</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>

              <button
                id="tour-settings-button"
                onClick={() => onNavigate("settings")}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-base font-semibold hover:translate-x-1.5 transition-all text-left ${
                  isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:border-slate-700" : "bg-slate-50 border-slate-150 text-slate-800 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">⚙ Manage Child Guards & Settings</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* COLUMN 2: MULTI-CHILD ANALYTICS MATRIX */}
          <div className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <h3 className="text-base font-extrabold uppercase mt-0 mb-4 tracking-wider font-mono text-[#2EC4B6]">{t.multiFamilyTitle}</h3>
            
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-slate-850 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                      <th className="pb-2 font-mono uppercase tracking-wide">Child</th>
                      <th className="pb-2 font-mono uppercase tracking-wide">Pathway</th>
                      <th className="pb-2 font-mono uppercase tracking-wide">XP</th>
                      <th className="pb-2 font-mono uppercase tracking-wide">Milestones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-400/10">
                    {children.map((childItem) => {
                      const childXp = childItem.xp || 420;
                      const childPct = Object.keys(childItem.completed || {}).length > 0 ? Math.round((Object.keys(childItem.completed || {}).length / 10) * 100) : 12;

                      return (
                        <tr key={childItem.id} className="hover:bg-slate-400/5 transition-colors">
                          <td className="py-3 font-bold flex items-center gap-2">
                            <span>{childItem.avatar}</span>
                            <span>{childItem.name}</span>
                          </td>
                          <td className="py-3">AI Discovery</td>
                          <td className="py-3 font-mono font-bold text-[#2EC4B6]">{childXp} XP</td>
                          <td className="py-3 font-mono font-extrabold text-[#B8A0FF]">{childPct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => alert("Rendering relative statistics comparisons charts...")}
                className="w-full py-2.5 rounded-xl bg-[#2EC4B6]/15 hover:bg-[#2EC4B6]/25 border border-[#2EC4B6]/30 text-[#2EC4B6] text-xs font-black tracking-wider uppercase"
              >
                {t.compareBtn}
              </button>
            </div>
          </div>

        </section>


        {/* COMMUNITY CORNER */}
        <section id="tour-community-hub" className={`p-6 rounded-2xl border shadow-sm ${isDark ? "bg-[#111827] border-slate-800" : "bg-white border-[#EAEAEA]"}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold uppercase m-0 tracking-wider font-mono text-[#2EC4B6]">Parent Community Hub</h3>
            <Users size={18} className="text-[#2EC4B6]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Discussions</span>
              <h4 className="text-sm font-bold mt-2 leading-snug">Parent Safety Rules</h4>
              <p className="text-xs text-slate-500 mt-1">Discuss passcode limitations with other early access families.</p>
            </div>

            <div className={`p-5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-[#2EC4B6] uppercase tracking-wider block">Saturday Workshop</span>
              <h4 className="text-sm font-bold mt-2 leading-snug">AI Safety For Kids</h4>
              <p className="text-xs text-slate-500 mt-1">Interactive panel discussion regarding cognitive guides & tutors.</p>
            </div>

            <div className={`p-5 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Resource Kit</span>
              <h4 className="text-sm font-bold mt-2 leading-snug">West Africa Digital Guide</h4>
              <p className="text-xs text-slate-500 mt-1">Downloadable worksheets for offline physical study sessions.</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate("community")}
            className="mt-6 w-full py-2.5 rounded-lg bg-[#2EC4B6]/10 hover:bg-[#2EC4B6] hover:text-white border border-[#2EC4B6]/20 transition-all text-[#2EC4B6] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <span>Open Parent Community Hub</span>
            <ArrowRight size={13} />
          </button>
        </section>


        {/* SETTINGS UTILITIES FOOTER BAR */}
        <section className={`pt-8 border-t transition-colors duration-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ${
          isDark ? "border-slate-850" : "border-slate-200"
        }`}>
          
          {/* A. Language switcher */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#2EC4B6]" />
              <h4 className="text-sm font-black uppercase tracking-wider m-0 font-mono">Language</h4>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { code: "en" as const, label: "EN" },
                { code: "yo" as const, label: "YO" },
                { code: "ig" as const, label: "IG" }
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => onLanguageChange(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase border transition-all ${
                    lang === l.code
                      ? "bg-[#2EC4B6]/15 border-[#2EC4B6] text-[#2EC4B6] font-extrabold"
                      : isDark
                        ? "bg-slate-950/30 border-slate-800 text-slate-400 hover:text-slate-200"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {l.label === "EN" ? "English" : l.label === "YO" ? "Yorùbá" : "Igbo"}
                </button>
              ))}
            </div>
          </div>

          {/* B. Presentation theme mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-[#B8A0FF]" />
              <h4 className="text-sm font-black uppercase tracking-wider m-0 font-mono">Theme Presentation</h4>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-slate-100 hover:bg-slate-850" 
                  : "bg-white border-slate-200 shadow-sm text-slate-900 hover:bg-slate-50"
              }`}
            >
              {isDark ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-[#B8A0FF]" />}
              <span>{isDark ? "Light Presentation" : "Dark Presentation"}</span>
            </button>
          </div>

          {/* C. Guard limits */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#FFD166]" />
              <h4 className="text-sm font-black uppercase tracking-wider m-0 font-mono">Study Time Limit</h4>
            </div>
            <p className="text-xs text-slate-500 m-0">Daily Limit: <strong>60 Minutes</strong></p>
            <button onClick={() => onNavigate("settings")} className="text-xs font-black text-[#2EC4B6] hover:underline flex items-center gap-1">
              <span>{t.adjustLimit}</span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* D. Session Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-[#2EC4B6]" />
              <h4 className="text-sm font-black uppercase tracking-wider m-0 font-mono">Session controls</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate("settings")}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  isDark ? "bg-slate-950/30 border-slate-800 text-slate-300" : "bg-white border-slate-250 text-slate-800 shadow-sm hover:bg-slate-50"
                }`}
              >
                Settings
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl border border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER POLICIES COGNITIVE FRAME */}
      <footer className={`py-8 mt-12 text-center text-[10px] font-mono border-t ${
        isDark ? "bg-slate-950 border-slate-900 text-slate-600" : "bg-slate-100 border-slate-200 text-slate-500"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <span>© 2026 CLATS Future Tech Academy. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ParentDashboard;
