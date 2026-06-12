/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, AgeGroup, Parent, Child } from "../types";

// Design Colors
export const C = {
  teal: "#22d3ee",
  tealDark: "#06b6d4",
  tealDeep: "#0891b2",
  tealGhost: "rgba(34, 211, 238, 0.08)",
  yellow: "#FACC15",
  yellowDark: "#EAB308",
  yellowSoft: "rgba(250, 204, 21, 0.08)",
  yellowGlow: "rgba(250, 204, 21, 0.25)",
  charcoal: "#F8FAFC",
  slate: "#CBD5E1",
  stone: "#94A3B8",
  fog: "#64748B",
  mist: "rgba(255, 255, 255, 0.08)",
  snow: "#0A0A0B",
  white: "#111114",
  green: "#10B981",
  red: "#F43F5E",
  amber: "#F59E0B",
  lavender: "#A78BFA",
  lavSoft: "rgba(167, 139, 250, 0.08)",
  igboAccent: "#F97316",
  yorubaAccent: "#FB923C"
};

// Font Families
export const F = {
  display: "'Baloo 2', system-ui, sans-serif",
  body: "'Baloo 2', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace"
};

// Translation Table
export const T: Record<Language, Record<string, string>> = {
  en: {
    tagline: "Building tomorrow's tech minds today",
    getStarted: "Get Started",
    signIn: "Sign In",
    welcomeBack: "Welcome back",
    createAccount: "Create Account",
    hello: "Hello",
    readyToLearn: "Ready to learn today?",
    startLearning: "Start Learning",
    timeLeft: "Time left today",
    lessonsComplete: "lessons complete",
    continueLesson: "Continue",
    markComplete: "Mark Complete",
    nextLesson: "Next Lesson",
    correct: "Correct.",
    incorrect: "Not quite — but that is how learning works.",
    sessionDone: "Session Complete",
    greatJob: "Great job today! See you next session.",
    fiveMinsLeft: "You have 5 minutes left for this session.",
    kobeSays: "Kobe says",
    askKobe: "Ask Kobe",
    parentDash: "Parent Dashboard",
    childMode: "Enter Child Mode",
    community: "Community",
    settings: "Settings",
    progress: "Progress",
    level: "Level",
    xp: "XP",
    stars: "Stars",
    language: "Language",
    back: "Back",
    parentAuthTitle: "Parent Dashboard Link",
    parentAuthSubtitle: "Manage schedules, view progress, and access learning paths.",
    createChildProfile: "Create Child Profile",
    enterParentMode: "Parent Controls",
    howManyMinutes: "Minutes per learning block",
    completeQuizToFinish: "Solve the quiz question below to finish this lesson!",
    welcomeParent: "Good Evening",
    trackJourney: "Track your child's future-tech learning journey.",
    weeklyLearningTime: "Weekly Learning Time (Min)",
    lessonCompletion: "Lesson Completion Analytics",
    quizPerformance: "Quiz Performance Analytics",
    learningConsistency: "Learning Consistency",
    aiLearningInsights: "🤖 AI Learning Insights",
    skillsTracker: "Skills Development Tracker",
    screenTimeAnalytics: "Screen Time Analytics",
    achievementsCenter: "Achievements Center",
    feedbackWidget: "🚀 Help Us Improve CLATS",
    submitFeedback: "Submit Feedback",
    testingBanner: "🎉 Thank you for helping test CLATS!",
    testingShare: "Share Feedback",
    testingDesc: "Your feedback is helping us build Africa's future-tech learning platform for children.",
    weeklyAverage: "Weekly Average",
    remaining: "Remaining",
    usedToday: "Used Today",
    dailyLimit: "Daily Limit",
    xpMilestones: "XP Milestones",
    badges: "Badges",
    certificates: "Certificates",
    recentDiscussions: "Recent Parent Discussions",
    learningTips: "Learning Tips",
    upcomingEvents: "Upcoming Events",
    workshops: "Workshops",
    viewCommunity: "View Community",
    improveClats: "Your feedback helps us build a better learning experience for children.",
    enrolledChildren: "Enrolled Children",
    sessionControls: "Session Controls",
    sessionDays: "Learning Days",
    bestStreak: "Best Streak",
    currentStreak: "Current Streak",
    averageScore: "Average Score",
    recentQuizScores: "Recent Quiz Scores",
    passRate: "Pass Rate",
    trackDone: "Track Done",
    activeProfiles: "Active Profiles",
    addProfile: "Add Child Profile",
    todayStudy: "Today's Study",
    completed: "Completed",
    latestAssessment: "Learning Assessment",
    automaticAnalysis: "Automatic analysis for",
    recentAssessments: "Recent Assessments",
    passed: "PASSED",
    needsReview: "NEEDS REVIEW",
    correctCount: "Correct",
    viewCommunitySpace: "View Community Space",
    noKidsYet: "No kids profiles added yet. Set one up to start!"
  },
  ig: {
    tagline: "Anyị na-eto uche teknụzụ n'ọdịnihu taa",
    getStarted: "Bido mbụ",
    signIn: "Banye",
    welcomeBack: "Nnabata ọzọ",
    createAccount: "Mepee Ọkwa",
    hello: "Ndewo",
    readyToLearn: "I dịla njikere ịmụta ihe taa?",
    startLearning: "Bido ịmụ ihe",
    timeLeft: "Oge fọdụrụ taa",
    lessonsComplete: "ihe ọmụmụ gachara",
    continueLesson: "Gaa n'ihu",
    markComplete: "Emechara",
    nextLesson: "Ihe Ọmụmụ Ọzọ",
    correct: "Ezi okwu.",
    incorrect: "Ọ bụghị nnọọ — mana ọ bụ otu ahụ ka anyị si amụta ihe.",
    sessionDone: "Oge Agwụla",
    greatJob: "Ọrụ dị mma taa! Hụ gị n'oge ọzọ.",
    fiveMinsLeft: "Oge fọro gị nkeji ise n'oge a.",
    kobeSays: "Kobe sị",
    askKobe: "Jụọ Kobe",
    parentDash: "Mbadamba Ndị Nne na Nna",
    childMode: "Banye Ụdị Nwa",
    community: "Obodo Anyị",
    settings: "Ntọala",
    progress: "Ihe Ngosipụta",
    level: "Ọkwa",
    xp: "XP ọgụgụ",
    stars: "Kpakpando",
    language: "Asụsụ",
    back: "Laghachi",
    parentAuthTitle: "Maka Ndị Nne na Nna",
    parentAuthSubtitle: "Njikwa oge ihuenyo, ihe ngosipụta na mbadamba mmụta.",
    createChildProfile: "Mepụta Profaịlụ Nwa",
    enterParentMode: "Ihe nchịkwa ndị Nne na Nna",
    howManyMinutes: "Nkeji maka oge mmụta ọ bụla",
    completeQuizToFinish: "Zaghachi ajụjụ quiz dị n'okpuru iji mechaa ihe ọmụmụ a!",
    welcomeParent: "Kachasị, Ndị Nne na Nna",
    trackJourney: "Dekọọ ka nwa gị si amụta teknụzụ n'ọdịnihu.",
    weeklyLearningTime: "Oge Mmụta Kwa Izu (Nkeji)",
    lessonCompletion: "Nchọpụta Mmụta Ihe Ọmụmụ",
    quizPerformance: "Arụmọrụ Quiz Ajụjụ",
    learningConsistency: "Nkwekọrịta Mmụta",
    aiLearningInsights: "🤖 AI Nkọwa Mmụta",
    skillsTracker: "Ihe Ndekọ Ndị Nwere Nkà",
    screenTimeAnalytics: "Nnyocha Oge Ihuenyo",
    achievementsCenter: "Ebe Ọrụ Ọma",
    feedbackWidget: "🚀 Nyere Anyị Aka Imeziwanye CLATS",
    submitFeedback: "Zipu Nzaghachi Gị",
    testingBanner: "🎉 Daalụ maka inyere anyị aka ịnwale CLATS!",
    testingShare: "Nyefee Nzaghachi",
    testingDesc: "Nzaghachi gị na-enyere anyị aka wuo ikpo okwu mmụta teknụzụ ọdịnihu maka ụmụaka n'Afrịka.",
    weeklyAverage: "Nkezi gbakọtara",
    remaining: "Oge Fọdụrụ",
    usedToday: "Eji Mee Ihe Taa",
    dailyLimit: "Oke Kwa Ụbọchị",
    xpMilestones: "XP Mile Ọkwa",
    badges: "Ngosipụta Badge",
    certificates: "Asambodo",
    recentDiscussions: "Mkparịta Ụka Ndị Nne Na Nna",
    learningTips: "Atụmatụ Mmụta Ọma",
    upcomingEvents: "Ihe Omume Na-abịa",
    workshops: "Ebe Ọmụmụ Ọrụ",
    viewCommunity: "Leba Anya N'obodo",
    improveClats: "Nzaghachi gị na-enyere anyị aka wuo ahụmịhe mmụta anyị dị mma.",
    enrolledChildren: "Ụmụaka Na-amụ Ihe",
    sessionControls: "Ihe Nchịkwa Session",
    sessionDays: "Ụbọchị Mmụta",
    bestStreak: "Lọgụ Kachasị Mma",
    currentStreak: "Lọgụ Ugbu A",
    averageScore: "Nkezi Akara",
    recentQuizScores: "Quiz Ikpeazụ",
    passRate: "Faas Rate",
    trackDone: "Emechara",
    activeProfiles: "Profaịlụ Na-arụ Ọrụ",
    addProfile: "Tinye Profaịlụ Nwa",
    todayStudy: "Mmụta Taa",
    completed: "Emechara",
    latestAssessment: "Nlele Mmụta",
    automaticAnalysis: "Nnyocha akpaghị aka maka",
    recentAssessments: "Nlele Nso Nso A",
    passed: "AGAFEELA",
    needsReview: "CHỌRỌ NLELE",
    correctCount: "Ziri Ezi",
    viewCommunitySpace: "Leba anya n'obodo anyị",
    noKidsYet: "Enweghị profaịlụ ụmụaka agbakwunyere. Mepụta otu ugbu a!"
  },
  yo: {
    tagline: "A ń kọ́ ọpọlọ ìmọ̀-ẹ̀rọ ọjọ́ ọla lónìí",
    getStarted: "Bẹ̀rẹ̀",
    signIn: "Wọlé",
    welcomeBack: "Ẹ káàbọ̀ padà",
    createAccount: "Ṣe Àpamọ́ Tuntun",
    hello: "Pẹ̀lẹ́",
    readyToLearn: "Ṣé o ti múra tán láti kọ́ ẹ̀kọ́ lónìí?",
    startLearning: "Bẹ̀rẹ̀ Ẹ̀kọ́",
    timeLeft: "Àkókò tó kù lónìí",
    lessonsComplete: "ẹ̀kọ́ tí o ti parí",
    continueLesson: "Tẹ̀síwájú",
    markComplete: "Fidájú Parí",
    nextLesson: "Ẹ̀kọ́ Tó Kàn",
    correct: "Ó tọ́.",
    incorrect: "Kò tọ́ pátápátá — ṣùgbọ́n bẹ́ẹ̀ ni a ṣe ń kọ́ ẹ̀kọ́.",
    sessionDone: "Àkókò Kọ́parí",
    greatJob: "O ṣe dada lónìí! Ó dìgbà àkókò kàn.",
    fiveMinsLeft: "O ní ìṣẹ́jú márùn-ún jù lọ fún ìpele yí.",
    kobeSays: "Kobe sọ pé",
    askKobe: "Bi Kobe Lérò",
    parentDash: "Ojú-ewé Àwọn Obi",
    childMode: "Wọ Ojú Ọmọdé",
    community: "Àwùjọ Ọlọ́gbọ́n",
    settings: "Ètò",
    progress: "Àṣeyọrí",
    level: "Ìpele",
    xp: "XP",
    stars: "Ìràwọ̀",
    language: "Èdè",
    back: "Padà",
    parentAuthTitle: "Ojú Àwọn Obi tàbí Olùtọ́jú",
    parentAuthSubtitle: "Ṣàkóso àkókò tàbìlì àti àṣeyọrí ọmọ rẹ pọ̀.",
    createChildProfile: "Ṣèdá Ojú Ọmọ Tuntun",
    enterParentMode: "Ìṣàkóso Àwọn Obi",
    howManyMinutes: "Ìṣẹ́jú fún ìpele ẹ̀kọ́ kọ̀ọ̀kan",
    completeQuizToFinish: "Dáhùn ìbéèrè ìdánwò kékeré tó wà nísàlẹ̀ láti parí ẹ̀kọ́ yí!",
    welcomeParent: "Káàsán, Obi",
    trackJourney: "Tọpinpin irin-ajo ìmọ̀-ẹ̀rọ ọmọ rẹ.",
    weeklyLearningTime: "Àkókò Kíkẹ́kọ̀ọ́ Ọ̀sẹ̀ (Ìṣẹ́jú)",
    lessonCompletion: "Wíwo Àṣeyọrí Ẹ̀kọ́",
    quizPerformance: "Àyẹ̀wò Idánwò Kékeré",
    learningConsistency: "Ìbáṣepọ̀ Ẹ̀kọ́ Láìdábọ̀",
    aiLearningInsights: "🤖 Ìmọ̀ràn Pípé AI",
    skillsTracker: "Àtọpinpin Agbára",
    screenTimeAnalytics: "Àyẹ̀wò Àkókò Tábìlì",
    achievementsCenter: "Eré Àṣeyọrí Gbogbo",
    feedbackWidget: "🚀 Ràn wá lọ́wọ́ láti ṣàtúnṣe CLATS",
    submitFeedback: "Fi Èrò Rẹ Ránṣẹ́",
    testingBanner: "🎉 Oṣéun fún ìrànlọ́wọ́ láti dán CLATS wò!",
    testingShare: "Share Feedback",
    testingDesc: "Èrò rẹ ń ràn wá lọ́wọ́ láti kọ́ pẹpẹ ìmọ̀-ẹ̀rọ ọjọ́ ọla fún àwọn ọmọdé ní ilẹ̀ Áfíríkà.",
    weeklyAverage: "Nkezi Akoko Ọsẹ",
    remaining: "Àkókò Tó Kù",
    usedToday: "Lò Lónìí",
    dailyLimit: "Ààlà Lónìí",
    xpMilestones: "XP Milestones nla",
    badges: "Páálí Àṣeyọrí",
    certificates: "Ìwé-ẹ̀rí",
    recentDiscussions: "Ìjíròrò Àwọn Obi",
    learningTips: "Ìmọ̀ràn Lórí Ẹ̀kọ́",
    upcomingEvents: "Àwọn Ètò Tó Ń Bọ̀",
    workshops: "Ètò Ìkẹ́kọ̀ọ́",
    viewCommunity: "Wọ Àwùjọ Ọlọ́gbọ́n",
    improveClats: "Èrò rẹ ń ràn wá lọ́wọ́ láti ṣẹ̀dá ìrírí ẹ̀kọ́ tó dára jù.",
    enrolledChildren: "Àwọn Ọmọ Tí A Forúkọsílẹ̀",
    sessionControls: "Ìṣàkóso Ìpele Àkókò",
    sessionDays: "Ọjọ́ Kíkẹ́kọ̀ọ́",
    bestStreak: "Streak Aláṣeyọrí Jù",
    currentStreak: "Streak Lọ́ọ́lọ́ọ́",
    averageScore: "Nkezi Akara",
    recentQuizScores: "Quiz Tuntun",
    passRate: "Ìpín Ìrékọjá",
    trackDone: "Pari",
    activeProfiles: "Àwọn Ojú Ọmọ Tó Ń Ṣiṣẹ́",
    addProfile: "Ṣèdá Ojú Ọmọ Tuntun",
    todayStudy: "Ẹ̀kọ́ Lónìí",
    completed: "Ti Parí",
    latestAssessment: "Àyẹ̀wò Ẹ̀kọ́",
    automaticAnalysis: "Àyẹ̀wò fúnra rẹ̀ fún",
    recentAssessments: "Àyẹ̀wò Tuntun",
    passed: "YALÉṢE",
    needsReview: "GBA ÀTÚNYẸ̀WÒ",
    correctCount: "Ó tọ́",
    viewCommunitySpace: "Wo àwùjọ àwọn obi",
    noKidsYet: "Kò sí ojú ọmọ kankan lórí pẹpẹ lábẹ́ yín. Ṣèdá kan láti bẹ̀rẹ̀!"
  }
};

// Gamification Mechanics
export const XP_PER_LESSON = 100;
export const XP_PER_CORRECT = 25;

export const LEVELS = [
  { level: 1, label: "Beginner", xpNeeded: 0 },
  { level: 2, label: "Explorer", xpNeeded: 200 },
  { level: 3, label: "Innovator", xpNeeded: 500 },
  { level: 4, label: "Builder", xpNeeded: 900 },
  { level: 5, label: "Tech Pioneer", xpNeeded: 1400 }
];

export function getLevel(xp: number) {
  let cur = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpNeeded) cur = l;
  }
  return cur;
}

export function getNextLevel(xp: number) {
  for (const l of LEVELS) {
    if (xp < l.xpNeeded) return l;
  }
  return null;
}

// Dev allowance timing presets (in seconds)
export const DEV_DEFAULTS = {
  "early explorers": { morning: 120, afternoon: 120, evening: 60 },
  "young innovators": { morning: 300, afternoon: 300, evening: 300 },
  "future builders": { morning: 900, afternoon: 0, evening: 900 }
};

export const AGE_LABEL = {
  "early explorers": "Early Explorers",
  "young innovators": "Young Innovators",
  "future builders": "Future Builders"
};

export const AGE_AGES = {
  "early explorers": "2–5",
  "young innovators": "6–12",
  "future builders": "13–18"
};

export const AGE_META = {
  "early explorers": {
    color: C.amber,
    soft: C.yellowSoft,
    kobeStyle: [
      "warm, extremely gentle, playful,",
      "very short and simple sentences appropriate for ages 2 to 5,",
      "celebrate every step, max one emoji per response,",
      "give friendly verbal pattern hints."
    ].join(" ")
  },
  "young innovators": {
    color: C.teal,
    soft: C.tealGhost,
    kobeStyle: [
      "friendly, energetic, extremely clear,",
      "uses relatable Nigerian or African references (e.g. Lagos traffic, puff-puff, chin-chin),",
      "explains machine learning or cyber safety step-by-step with zero jargon,",
      "highly positive, interactive, under 4 sentences."
    ].join(" ")
  },
  "future builders": {
    color: C.lavender,
    soft: C.lavSoft,
    kobeStyle: [
      "highly substantive, respectful, peer-to-peer, professional but inspiring mentor vibe,",
      "addresses teenagers directly as future creators, startups founders, and builders,",
      "explains deep neural networks, logic algorithms, prompt engineering rules, or crypto hash tags in detail,",
      "concise but technically solid, zero fluff or childish chatter."
    ].join(" ")
  }
};

export const SLOT_NAMES: Array<"morning" | "afternoon" | "evening"> = [
  "morning",
  "afternoon",
  "evening"
];

export function getCurrentSlot(): "morning" | "afternoon" | "evening" | null {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18) return "evening";
  return null;
}

export function getNextSlotLabel(ag: AgeGroup, lang: Language = "en") {
  const slot = getCurrentSlot();
  const cfg = getParentLimits(null, ag);
  if (!slot) {
    return lang === "en"
      ? "your morning session"
      : lang === "ig"
      ? "oge mmụta ụtụtụ"
      : "ìpele owurọ̀";
  }
  if (slot === "morning" && (cfg.afternoon || 0) > 0) {
    return lang === "en" ? "this afternoon" : lang === "ig" ? "ehihie a" : "ọ̀sán";
  }
  if (slot === "afternoon" && (cfg.evening || 0) > 0) {
    return lang === "en" ? "this evening" : lang === "ig" ? "anyasị a" : "ìrọ̀lẹ́";
  }
  return lang === "en"
    ? "tomorrow morning"
    : lang === "ig"
    ? "ụtụtụ echi"
    : "owurọ̀ ọla";
}

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
};

// Storage keys
const PARENTS_KEY = "clats_parents_v1";
const SESS_KEY = "clats_sess_v1";
const TIME_KEY = "clats_time_v1";
const SETTINGS_KEY = "clats_settings_v1";
const LANG_KEY = "clats_lang_v1";

export const S = {
  getParents: (): Record<string, any> => {
    try {
      const stored = localStorage.getItem(PARENTS_KEY);
      if (!stored || stored === "{}") {
        const seedParents = {
          "parent@clats.com": {
            email: "parent@clats.com",
            password: "password123",
            name: "Parent",
            createdAt: Date.now(),
            children: [
              {
                id: "kobe-seed",
                name: "Kobe",
                ageGroup: "young innovators",
                avatar: "👦🏾",
                pin: "1234",
                interests: ["Technology", "Design"],
                completed: { "j-m1-l1": true },
                xp: 150,
                stars: { "j-m1-l1": 3 },
                quizResults: {
                  "j-m1-l1": {
                    score: 100,
                    correctCount: 5,
                    totalQuestions: 5,
                    status: "Passed",
                    completedAt: "Today"
                  }
                },
                createdAt: Date.now(),
                companion: "kobe"
              },
              {
                id: "chibi-seed",
                name: "Chibi",
                ageGroup: "young innovators",
                avatar: "👧🏾",
                pin: "5678",
                interests: ["Creative Design", "Cyber Safety"],
                completed: { "j-m1-l1": true },
                xp: 350,
                stars: { "j-m1-l1": 2 },
                quizResults: {
                  "j-m1-l1": {
                    score: 65,
                    correctCount: 4,
                    totalQuestions: 5,
                    status: "Passed",
                    completedAt: "Today"
                  }
                },
                createdAt: Date.now(),
                companion: "chibi"
              }
            ]
          }
        };
        localStorage.setItem(PARENTS_KEY, JSON.stringify(seedParents));
        return seedParents;
      }
      return JSON.parse(stored);
    } catch {
      return {};
    }
  },
  setParents: (u: any) => localStorage.setItem(PARENTS_KEY, JSON.stringify(u)),
  getSess: () => {
    try {
      return JSON.parse(localStorage.getItem(SESS_KEY) || "null");
    } catch {
      return null;
    }
  },
  setSess: (s: any) => localStorage.setItem(SESS_KEY, JSON.stringify(s)),
  clearSess: () => localStorage.removeItem(SESS_KEY),
  getTime: (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(TIME_KEY) || "{}");
    } catch {
      return {};
    }
  },
  setTime: (t: any) => localStorage.setItem(TIME_KEY, JSON.stringify(t)),
  getSettings: (): Record<string, any> => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    } catch {
      return {};
    }
  },
  setSettings: (s: any) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)),
  getLang: () => localStorage.getItem(LANG_KEY) || "en",
  setLang: (l: string) => localStorage.setItem(LANG_KEY, l)
};

export function getParentLimits(email: string | null, ageGroup: AgeGroup) {
  if (!email) return DEV_DEFAULTS[ageGroup] || { morning: 0, afternoon: 0, evening: 0 };
  const settings = S.getSettings();
  const saved = settings[email.toLowerCase()];
  if (saved && saved.limitsEnabled && saved.slots) return saved.slots;
  return DEV_DEFAULTS[ageGroup] || { morning: 0, afternoon: 0, evening: 0 };
}

export function slotAllowance(email: string, ageGroup: AgeGroup) {
  const slot = getCurrentSlot();
  if (!slot) return 0;
  return getParentLimits(email, ageGroup)[slot] || 0;
}

export function getTimeLog(email: string) {
  const logs = S.getTime();
  return (logs[email] && logs[email][todayKey()]) || { morning: 0, afternoon: 0, evening: 0 };
}

export function addTime(email: string, slot: "morning" | "afternoon" | "evening", secs: number) {
  const logs = S.getTime();
  const day = todayKey();
  if (!logs[email]) logs[email] = {};
  if (!logs[email][day]) logs[email][day] = { morning: 0, afternoon: 0, evening: 0 };
  logs[email][day][slot] = (logs[email][day][slot] || 0) + secs;
  S.setTime(logs);
}

export function registerParent({ email, password, name }: any) {
  const p = S.getParents();
  const key = email.toLowerCase().trim();
  if (p[key]) return { ok: false, msg: "An account with this email already exists." };
  p[key] = { email: key, password, name, children: [], createdAt: Date.now() };
  S.setParents(p);
  S.setSess({ type: "parent", email: key });
  return { ok: true, parent: p[key] };
}

export function loginParent({ email, password }: any) {
  const p = S.getParents();
  const key = email.toLowerCase().trim();
  if (!p[key]) return { ok: false, msg: "No account found with that email." };
  if (p[key].password !== password) return { ok: false, msg: "Incorrect password." };
  S.setSess({ type: "parent", email: key });
  return { ok: true, parent: p[key] };
}

export function addChild(parentEmail: string, { name, ageGroup, avatar, pin, interests, companion }: any) {
  const p = S.getParents();
  const key = parentEmail.toLowerCase();
  const child: Child = {
    id: Date.now().toString(),
    name,
    ageGroup,
    avatar,
    pin,
    interests,
    completed: {},
    xp: 0,
    stars: {},
    createdAt: Date.now(),
    companion: companion || "kobe"
  };
  p[key].children = [...(p[key].children || []), child];
  S.setParents(p);
  return child;
}

export function getParent(email: string | null): Parent | null {
  if (!email) return null;
  return S.getParents()[email.toLowerCase()] || null;
}

export function updateChild(parentEmail: string, childId: string, patch: Partial<Child>): Child {
  const p = S.getParents();
  const key = parentEmail.toLowerCase();
  p[key].children = (p[key].children || []).map((c: any) =>
    c.id === childId ? { ...c, ...patch } : c
  );
  S.setParents(p);
  return p[key].children.find((c: any) => c.id === childId);
}

export function getLoggedInParent(): Parent | null {
  const s = S.getSess();
  if (!s || s.type !== "parent") return null;
  return getParent(s.email);
}

// ----------------------------------------------------
// 🔥 SUPABASE CLIENT-SIDE PROXIES & SYNC ROUTINES 🔥
// ----------------------------------------------------

export async function getSupabaseStatus(): Promise<{ enabled: boolean; url: string }> {
  try {
    const res = await fetch("/api/supabase/status");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Could not retrieve Supabase connection status:", e);
  }
  return { enabled: false, url: "Not configured" };
}

export async function syncToSupabase(parentEmail: string, children: Child[], tutorial_completed?: boolean) {
  try {
    const res = await fetch("/api/supabase/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentEmail, children, tutorial_completed })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Offline: Supabase state backing deferred.", e);
  }
  return { ok: true, synced: false };
}

export async function submitFeedbackSupabase(email: string, message: string) {
  try {
    const res = await fetch("/api/supabase/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Offline: feedback save deferred to localStorage.", e);
  }
  return { ok: true, synced: false };
}

export const AVATARS = [
  "👦🏾",
  "👧🏾",
  "👦🏿",
  "👧🏿",
  "👦🏽",
  "👧🏽",
  "🧒🏾",
  "🧒🏿",
  "🚀",
  "🪐",
  "💻"
];
export const INTERESTS = [
  "Technology",
  "Design",
  "Data & Numbers",
  "Cyber Safety"
];
export const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "ig", label: "Igbo" },
  { code: "yo", label: "Yorùbá" }
];
