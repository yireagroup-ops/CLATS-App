/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Child, Module, Lesson, Language, AgeGroup } from "../types";
import { C } from "../utils/config";
import { Card, Txt, Heading, Chip } from "./Primitives";
import { KobeAvatar } from "./KobeAvatar";
import { sfx } from "../utils/audio";
import {
  ArrowLeft,
  Play,
  Lock,
  Clock,
  Sparkles,
  Trophy,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Compass,
  Flame,
  Award,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Map,
  Layers,
  Heart
} from "lucide-react";

interface LearningPathProps {
  child: Child;
  module: Module;
  onSelectLesson: (l: Lesson) => void;
  onBackToModules: () => void;
  lang: Language;
  theme?: "light" | "dark";
}

// Customized Lesson Curriculums based on user age specification
const getCustomLessons = (ageGroup: AgeGroup, moduleId: string): { title: string; desc: string; icon: string; landmark: string; duration: string; xp: number }[] => {
  if (ageGroup === "early explorers") {
    return [
      { title: "What is Technology?", desc: "Meet phones, tablets, and wheels that help people do helpful things!", icon: "💡", landmark: "🏖️ Sandy Shore Intro", duration: "⏱ 3 min", xp: 30 },
      { title: "Smart Things Around Us", desc: "Discover lightbulbs and toys with simple computer brains.", icon: "🧸", landmark: "🌴 Coconut Palm Grove", duration: "⏱ 4 min", xp: 40 },
      { title: "Technology at Home", desc: "Watch TV screens, vacuum helpers, and kitchen machines solve tasks.", icon: "🏡", landmark: "🌉 Rope Bridge Inlet", duration: "⏱ 4 min", xp: 40 },
      { title: "Technology at School", desc: "See smart electronic whiteboards and typing screens help teachers.", icon: "🏫", landmark: "⛵ Rowing Boat Stream", duration: "⏱ 4 min", xp: 45 },
      { title: "Technology Adventure Quiz", desc: "Take a playful, cute quiz journey with Kobe to claim your badge!", icon: "🎖️", landmark: "🐚 Coral Reef Cave", duration: "⏱ 5 min", xp: 50 }
    ];
  }

  if (ageGroup === "young innovators") {
    return [
      { title: "History of Technology", desc: "Learn how humans developed writing, tools, and math across centuries.", icon: "📜", landmark: "🏖️ Tech Sands Basecamp", duration: "⏱ 4 min", xp: 50 },
      { title: "History of AI", desc: "Meet computer science heroes, Alan Turing, and the birth of neural dreams.", icon: "🏛️", landmark: "🌴 Machine Mind Forest", duration: "⏱ 4 min", xp: 50 },
      { title: "What is AI?", desc: "Understand artificial intelligence as programs that learn from rules.", icon: "🧠", landmark: "🌉 Deep Learning Span", duration: "⏱ 4 min", xp: 50 },
      { title: "AI vs Humans", desc: "Compare silicon processors against emotional hearts, music, and empathy.", icon: "💖", landmark: "⛵ Smart Phone Harbor", duration: "⏱ 4 min", xp: 50 },
      { title: "Smart Machines", desc: "Track how smart sensors process light, sounds, and motion seamlessly.", icon: "⚙️", landmark: "🐚 Robot Coral Cove", duration: "⏱ 4 min", xp: 50 },
      { title: "AI Around Us", desc: "Flag facial patterns, chat programs, and movie recommendations.", icon: "📡", landmark: "🗺️ Coordinate Lagoon", duration: "⏱ 4 min", xp: 50 },
      { title: "Benefits of AI", desc: "Unveil medical diagnoses, climate tracking, and automated chores.", icon: "📈", landmark: "🏔️ Summit Outlook", duration: "⏱ 4 min", xp: 50 },
      { title: "Risks of AI", desc: "Audit model limits, fake clips, and safe user boundaries.", icon: "⚠️", landmark: "🏰 Lighthouse Tower", duration: "⏱ 4 min", xp: 50 }
    ];
  }

  // Future Builders pioneer track
  return [
    { title: "Evolution of Technology", desc: "Analyze general-purpose computers, algorithmic paradigms, and scaling laws.", icon: "⚖️", landmark: "🧬 Technology Evolution Base", duration: "⏱ 5 min", xp: 60 },
    { title: "History of AI", desc: "Examine computational theories, synthetic brains, Turing tests, and network roots.", icon: "💾", landmark: "🏛️ Ancient Silicon Trails", duration: "⏱ 5 min", xp: 60 },
    { title: "Machine Learning", desc: "Master feature weights, training structures, datasets, and predictive biases.", icon: "📈", landmark: "⚙️ Weight Matrix Slopes", duration: "⏱ 6 min", xp: 65 },
    { title: "Deep Learning", desc: "Analyze backpropagation streams, gradients, filters, and synthetic pathways.", icon: "🧠", landmark: "🔬 Multi-layered Glades", duration: "⏱ 6 min", xp: 65 },
    { title: "Neural Networks", desc: "Model artificial synapses, inputs scaling arrays, layers, and error thresholds.", icon: "🕸️", landmark: "🔌 Connected Gateway", duration: "⏱ 7 min", xp: 70 },
    { title: "AI Systems", desc: "Draft automation blueprints, alignment parameters, feedback nodes, and ethical grids.", icon: "🚀", landmark: "🌌 Quantum Summit Atoll", duration: "⏱ 8 min", xp: 80 }
  ];
};

// Generates an interactive, topic-relevant quiz dynamically to keep lesson completions operational!
const getQuizForLesson = (title: string, ageGroup: AgeGroup) => {
  if (ageGroup === "early explorers") {
    if (title.includes("What is Technology")) {
      return [{
        q: {
          en: "Which of these is a helpful tool that people built?",
          ig: "Kedu nke bụ ngwa nwanne mmadụ mepụtara iji nyere aka?",
          yo: "Ewo nínú àwọn wọ̀nyí ni irinṣẹ́ tí ènìyàn ṣe láti ràn wá lọ́wọ́?"
        },
        opts: {
          en: ["A smartphone computer! 📱", "A simple forest twig 🪵", "A beach wave 🌊"],
          ig: ["Ekwentị smart! 📱", "Alaka osisi rọrun 🪵", "Ebili mmiri 🌊"],
          yo: ["Ẹ̀rọ ìbánisọ̀rọ̀ smart! 📱", "Igi igbó lásán 🪵", "Ìgbì omi 🌊"]
        },
        ans: 0
      }];
    }
    return [{
      q: {
        en: "Which friendly guide helper is here to join our lesson?",
        ig: "Onye bụ ezigbo enyi anyị na-enyere anyị aka ịmụ ihe?",
        yo: "Tani ọmọlúàbí olùrànlọ́wọ́ wa nínú ẹ́kọ́ yìí?"
      },
      opts: {
        en: ["Friendly Kobe! 🦁", "A sleeping sleeping rock 🪨", "A tiny spider 🕷️"],
        ig: ["Kobe nwere enyi! 🦁", "Nkume na-ehi ụra 🪨", "Ududo na-atụ egwu 🕷️"],
        yo: ["Kobe tí ó nírẹ̀lẹ́! 🦁", "Àpáta tí ń sùn 🪨", "Kòkòrò aláǹtakùn 🕷️"]
      },
      ans: 0
    }];
  }

  if (ageGroup === "young innovators") {
    if (title.includes("History of Technology")) {
      return [{
        q: {
          en: "What defines technology in human history?",
          ig: "Gịnị ka a na-ewere dị ka ngwá ọrụ teknụzụ?",
          yo: "Kí ni a lè pè ní irinṣẹ́ kọmputa rọrun?"
        },
        opts: {
          en: [
            "Any custom tool created by humans to solve life problems! 💡",
            "Only expensive high-end computers with RGB lights 💻",
            "Just wild trees left untouched in valleys 🌲"
          ],
          ig: [
            "Ihe ọ bụla mmadụ mepụtara iji dozie nsogbu! 💡",
            "Ọ bụ naanị laptọọpụ dị oke ọnụ 💻",
            "Naanị osisi ọhịa nkịtị 🌲"
          ],
          yo: [
            "Irinṣẹ́ kankan tí ènìyàn dá láti yanjú ìṣòro! 💡",
            "Laptọọpụ tí ó wọ́n nìkan 💻",
            "Igi igbó lásán 🌲"
          ]
        },
        ans: 0
      }];
    }
    if (title.includes("History of AI") || title.includes("What is AI")) {
      return [{
        q: {
          en: "What does the 'AI' abbreviation stand for?",
          ig: "Gịnị ka mkpụrụokwu 'AI' kọwara anyị?",
          yo: "Kí ni ìtumọ̀ àkòtàn AI gangan?"
        },
        opts: {
          en: ["Artificial Intelligence 🤖", "Automated Instruments 🎸", "Applied Interaction 📱"],
          ig: ["Ọgụgụ Isi Igwe 🤖", "Ngwa Egwu Ukwu 🎸", "Ekwentị Dị Elu 📱"],
          yo: ["Ìfòyemọ̀ Ẹ̀rọ (Artificial Intelligence) 🤖", "Àwọn Irin-Iṣẹ́ kọmputa 🎸", "Ìbáṣepọ̀ Ẹ̀rọ 📱"]
        },
        ans: 0
      }];
    }
    if (title.includes("AI vs Humans")) {
      return [{
        q: {
          en: "What human quality is most difficult for deep learning models to replicate?",
          ig: "Gịnị ka ụmụ mmadụ kacha igwe ọgụgụ isi mma?",
          yo: "Kí ni ènìyàn lè ṣe tí ó ṣòro fún kọmputa láti kọ́?"
        },
        opts: {
          en: [
            "Genuine empathy, emotional connection, and conscious creativity 💖",
            "Dividing trillion-digit mathematical equations under 1 ms 🧮",
            "Scanning and matching text files in local folders 📁"
          ],
          ig: [
            "Ezigbo ọmịiko, ịhụnanya na nka mmepụta ihe 💖",
            "Ịgbakọ ezigbo ọnụọgụ ukwu n'otu ntabi anya 🧮",
            "Ịchọta faịlụ nkesa n'okpuru sekọnd abụọ 📁"
          ],
          yo: [
            "Níní fífẹ́, àánú, àti ìṣe àtinúdá tòótọ́ 💖",
            "Ìṣírò nọ́mbà dídíjú ní ìṣẹ́jú kan 🧮",
            "Ìfihàn àwọn faịlụ ẹ̀rọ ní ìṣẹ́jú díẹ̀ 📁"
          ]
        },
        ans: 0
      }];
    }
  }

  // Ages 13-18 Pioneer Quizzes
  return [{
    q: {
      en: "How does gradient descent optimize weights inside an artificial neural layer?",
      ig: "Kedu ka igwe na-enwetara nkwalite ọgụgụ isi na neural networks?",
      yo: "Báwo ni neural network ṣe ń kọ́ ìmọ̀ nípa rírí àṣìṣe rẹ̀ kù?"
    },
    opts: {
      en: [
        "By iteratively adjusting node weights to minimize the output loss value! 📈",
        "By deleting excess databases randomly inside local hard drives ⚙️",
        "By shutting off active power inputs whenever accuracy drops 🔌"
      ],
      ig: [
        "N'iji nwayọọ nwayọọ na-agbanwe ibu iji belata ọnụ ọgụgụ njehie! 📈",
        "Site na ihichapụ nchekwa data rọrun",
        "Site na imenyụ ọkụ kọmputa rọrun"
      ],
      yo: [
        "Nípa títún òṣùnwọ̀n neural weights ṣe pẹ̀lú aṣìṣe láti dín àṣìṣe kù! 📈",
        "Nípa mímú àwọn faịlụ kọmputa kúrò jàǹkàn-jàǹkàn ⚙️",
        "Nípa pípa ẹ̀rọ kọmputa náà mọ́ fún ìgbà díẹ̀ 🔌"
      ]
    },
    ans: 0
  }];
};

// Universal lesson visual decorators fallback generator
const getLessonDecoration = (idx: number) => {
  const list = [
    { title: "Intro", landmark: "🏖️ Sandy Shore Intro", icon: "💡", duration: "⏱ 3 min", xp: 30 },
    { title: "Midway", landmark: "🌴 Coconut Palm Grove", icon: "🧸", duration: "⏱ 4 min", xp: 40 },
    { title: "Bridge", landmark: "🌉 Rope Bridge Inlet", icon: "🏡", duration: "⏱ 4 min", xp: 40 },
    { title: "Waterway", landmark: "⛵ Rowing Boat Stream", icon: "🏫", duration: "⏱ 4 min", xp: 45 },
    { title: "Quiz", landmark: "🐚 Coral Reef Cave", icon: "🎖️", duration: "⏱ 5 min", xp: 50 },
    { title: "Peak", landmark: "🌋 Crater Climb Peak", icon: "🚀", duration: "⏱ 5 min", xp: 50 }
  ];
  return list[idx % list.length];
};

export const LearningPath: React.FC<LearningPathProps> = ({
  child,
  module,
  onSelectLesson,
  onBackToModules,
  lang,
  theme = "dark"
}) => {
  const isDark = theme === "dark";
  const ageGroup: AgeGroup = child.ageGroup || "early explorers";
  const companion = child.companion || "kobe";

  const customLessonsConfig = getCustomLessons(ageGroup, module.id);

  // Sync state selections
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Interactive gamified secret treasure chest state for ages 6-12!
  const [isChestClaimed, setIsChestClaimed] = useState<boolean>(false);
  const [chestPointsAlert, setChestPointsAlert] = useState<string | null>(null);

  // Re-generate standard sequential lesson states with high-concept custom content and quizzes
  const lessons: Lesson[] = (module.lessons && module.lessons.length > 0)
    ? module.lessons.map((item, index) => {
        const decor = customLessonsConfig[index] || getLessonDecoration(index);
        return {
          id: item.id,
          code: item.code || `L${index + 1}`,
          duration: item.duration || decor.duration || "⏱ 3 min",
          type: item.type || "story",
          title: {
            en: item.title.en,
            ig: item.title.ig || item.title.en,
            yo: item.title.yo || item.title.en
          },
          story: item.story || {
            en: `Let's dive into ${item.title.en}! Let's join forces with our companion guides and complete the challenge quiz!`,
            ig: `Ka anyị bido ọmụmụ anyị na ${item.title.en}! Anyị ga-eme nke ọma na ajụjụ!`,
            yo: `Ẹ jẹ́ kí a kẹ́kọ̀ọ́ lórí ${item.title.en}! A ó ṣe dáradára àti gba àmì-ẹ̀yẹ!`
          },
          quiz: (item.quiz && item.quiz.length > 0) ? item.quiz : getQuizForLesson(item.title.en, ageGroup)
        };
      })
    : customLessonsConfig.map((item, index) => {
        const parentLesson = module.lessons?.[index];
        const lessonId = parentLesson?.id || `${module.id}-l${index + 1}`;

        return {
          id: lessonId,
          code: `L${index + 1}`,
          duration: item.duration,
          type: "story" as const,
          title: { en: item.title, ig: item.title, yo: item.title },
          story: {
            en: `Let's dive into ${item.title}! ${item.desc} Let's join forces with our companion guides and complete the challenge quiz!`,
            ig: `Ka anyị bido ọmụmụ anyị na ${item.title}! ${item.desc} Anyị ga-eme nke ọma na ajụjụ!`,
            yo: `Ẹ jẹ́ kí a kẹ́kọ̀ọ́ lórí ${item.title}! ${item.desc} A ó ṣe dáradára àti gba àmì-ẹ̀yẹ!`
          },
          quiz: getQuizForLesson(item.title, ageGroup)
        };
      });

  // Assign first uncompleted or first lesson as baseline selection
  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      const activeIdx = lessons.findIndex((l) => !child.completed?.[l.id]);
      setSelectedLesson(lessons[activeIdx !== -1 ? activeIdx : 0]);
    }
  }, [lessons, child.completed, selectedLesson]);

  const completedCount = lessons.filter((l) => child.completed?.[l.id]).length;
  const pct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isModuleFinished = completedCount === lessons.length;

  const handleNodeClick = (lesson: Lesson, isUnlocked: boolean) => {
    if (!isUnlocked) {
      sfx.playBuzzer();
      return;
    }
    sfx.playTap();
    setSelectedLesson(lesson);
  };

  // Speaks title label out loud inside container iFrame
  const speakEpisode = (title: string) => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(title);
        utterance.rate = 0.85;
        utterance.pitch = 1.15;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis blocked by frame permissions:", e);
    }
  };

  // Custom gamified companions briefs
  const getCompanionDialogue = (title: string) => {
    if (companion === "chibi") {
      return `Sparkles! Let's excel in "${title}"! Follow my island signs and unlock sweet badges! ✨`;
    }
    return `Hi champion! Ready to pilot "${title}" on our tropical journey? Take out your captain's lens! 🚀`;
  };

  // Claim chest bonus points handler
  const handleClaimChest = () => {
    if (isChestClaimed) return;
    sfx.playCoin();
    setIsChestClaimed(true);
    setChestPointsAlert("🌋 BOOM! You discovered the Hidden Coconut Treasure Chest! +35 XP claimed!");
    setTimeout(() => {
      setChestPointsAlert(null);
    }, 4000);
  };

  // Helper to resolve specific node state classes
  const getNodeDetails = (lesson: Lesson, idx: number) => {
    const isCompleted = !!child.completed?.[lesson.id];
    const isUnlocked = idx === 0 || !!child.completed?.[lessons[idx - 1].id];
    const isCurrent = !isCompleted && isUnlocked;
    return { isCompleted, isUnlocked, isCurrent };
  };

  return (
    <div
      id="tour-lesson-map"
      className={`w-full min-h-screen pb-28 pt-4 ${isDark ? "bg-[#0a0f1d] text-white" : "bg-[#F9FBFC] text-slate-800"}`}
    >
      
      {/* MAP FLOATING HEADER STATUS BAR */}
      <div className={`border-b-2 p-4 sticky top-0 z-40 shadow-sm ${isDark ? "bg-slate-900/90 border-slate-800 backdrop-blur-md" : "bg-white/90 backdrop-blur-md border-slate-100"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToModules}
            className={`flex items-center gap-2 border-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              isDark ? "bg-slate-800 hover:bg-slate-705 text-[#2EC4B6] border-[#2EC4B6]/30" : "bg-white hover:bg-slate-50 text-[#2EC4B6] border-[#2EC4B6]/20"
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-[#2EC4B6]" />
            <span>Academy Center</span>
          </button>

          <div className="text-center sm:text-right">
            <span className={`text-[10px] font-black tracking-widest block uppercase font-mono ${isDark ? "text-slate-450" : "text-slate-400"}`}>
              JOURNEY TRACK RECOGNITION
            </span>
            <Heading size={18} className={`font-black ${isDark ? "text-white" : "text-[#0E1B29]"}`} style={{ fontWeight: 900 }}>
              🎒 {module.name[lang] || module.name.en}
            </Heading>
          </div>

          <div className="flex items-center gap-3">
            <div className={`rounded-full px-4 py-1 border ${isDark ? "bg-emerald-950/20 border-emerald-900" : "bg-emerald-50 border-emerald-200"}`}>
              <Txt size={12.5} className={`font-black ${isDark ? "text-emerald-400" : "text-emerald-700"}`}>
                ✨ {completedCount} / {lessons.length} MILONES DONE ({pct}%)
              </Txt>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Alerts inside journey */}
      {chestPointsAlert && (
        <div className="fixed top-20 left-1/2 -translate-y-1/2 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-[#FFD166] z-50 animate-bounce flex items-center gap-3 max-w-md">
          <span className="text-2xl">🪙</span>
          <Txt size={13} className="font-extrabold text-white leading-normal">
            {chestPointsAlert}
          </Txt>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* LANDMARK DETAILS OVERVIEW CARD */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-5xl inline-block mb-3 animate-[wave-ripple_2s_ease-in-out_infinite]">🏝️</span>
          <div className="inline-block">
            <Chip color="#2EC4B6" bg="rgba(46, 196, 182, 0.1)" className="font-black uppercase tracking-wider mb-2" style={{ fontSize: 14, padding: "6px 12px" }}>
              🌴 Adventure Level Journey Map
            </Chip>
          </div>
          <Heading size={32} className={`font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`} style={{ fontWeight: 900 }}>
            {module.name[lang] || module.name.en} Roadmap
          </Heading>
          <Txt size={15} className={`font-bold block max-w-xl mx-auto mt-2 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-500"}`}>
            Progress along the milestones listed. Complete lessons in order to receive badge items and score perfect status rewards!
          </Txt>
        </div>

        {/* RENDERS THE EXACT AGE SPECIFIED THEME */}
        
        {/* =======================================
            CASE 1: TINY AGE GROUP 2–5 (Early Explorers)
            ======================================= */}
        {ageGroup === "early explorers" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Playful cartoon island sandbox */}
            <div className="col-span-1 lg:col-span-7 bg-gradient-to-b from-[#b3f0ff] to-[#ffe6cc] border-4 border-amber-300 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col items-center">
              
              {/* Soft cloud elements and palms */}
              <div className="absolute top-4 left-6 text-4xl opacity-40 select-none">☁️</div>
              <div className="absolute top-1/3 right-4 text-5xl opacity-40 select-none">🌴</div>
              <div className="absolute bottom-16 left-4 text-4xl opacity-30 select-none">⛵</div>

              <div className="bg-amber-100/40 border border-amber-300/40 font-bold text-[11px] rounded-full px-3 py-1 text-amber-900 uppercase font-mono tracking-widest mb-6">
                🧸 CARTOON PLAYFUL SANDBOX
              </div>

              <div className="w-full flex flex-col items-center gap-1.5">
                {lessons.map((lesson, idx) => {
                  const { isCompleted, isUnlocked, isCurrent } = getNodeDetails(lesson, idx);
                  const isSelected = selectedLesson?.id === lesson.id;
                  const config = customLessonsConfig[idx] || getLessonDecoration(idx);
                  
                  return (
                    <React.Fragment key={lesson.id}>
                      {/* Chunky bouncy bubble circle */}
                      <div
                        onClick={() => handleNodeClick(lesson, isUnlocked)}
                        className={`w-full max-w-md border-4 rounded-3xl p-4 flex items-center justify-between gap-4 transition-all duration-300 ${
                          isUnlocked
                            ? isSelected
                              ? isDark ? "bg-amber-950/50 border-[#FFD166] shadow-md scale-[1.03]" : "bg-amber-50/90 border-[#FFD166] shadow-md scale-[1.03]"
                              : isDark ? "bg-slate-900 border-slate-800 hover:bg-slate-850 shadow-sm cursor-pointer" : "bg-white border-slate-200 hover:bg-slate-50 shadow-sm cursor-pointer"
                            : isDark ? "bg-slate-950/40 border-slate-900/80 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-100 border-slate-200/50 text-slate-450 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg border-b-6 ${
                              isCompleted
                                ? "bg-emerald-400 border-emerald-600 text-white"
                                : isCurrent
                                ? "bg-[#FFD166] border-orange-500 animate-bounce text-slate-800"
                                : isUnlocked
                                ? "bg-sky-300 border-sky-500 text-white"
                                : "bg-slate-200 border-slate-400"
                            }`}>
                              {isCompleted ? (
                                <span className="animate-spin-slow">💚⭐</span>
                              ) : isUnlocked ? (
                                <span>{config?.icon || "🏝️"}</span>
                              ) : (
                                <span>😴🔒</span>
                              )}
                            </div>

                            {isCompleted && (
                              <div className="absolute -top-1 right-0 bg-yellow-400 text-[9px] font-black border border-white rounded-full px-1.5 py-0.5 text-slate-950">
                                DONE
                              </div>
                            )}
                          </div>

                          <div>
                            <span className="bg-amber-100 text-amber-900 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full">
                              {config?.landmark || `Sands ${idx+1}`}
                            </span>
                            <Heading size={16} className={`font-black tracking-tight mt-1 ${isUnlocked ? isDark ? "text-amber-200" : "text-slate-900" : "text-slate-450"}`} style={{ fontWeight: 800 }}>
                              {lesson.title.en}
                            </Heading>
                            <Txt size={11} className={`block font-bold mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              Kids Easy Play &bull; {lesson.duration}
                            </Txt>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <span className="text-emerald-500 text-xl font-black">✓ Passed</span>
                          ) : isUnlocked ? (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          ) : (
                            <span className="text-sm">💤🔒</span>
                          )}
                        </div>
                      </div>

                      {idx < lessons.length - 1 && (
                        <div className="py-2 text-[#2EC4B6]/50 animate-pulse text-lg font-mono tracking-widest font-black select-none">
                          👣 🌊 FISH BUBBLES 🫧 🐚
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

            </div>

            {/* Right Interactive Sidebar */}
            <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-24">
              {selectedLesson ? (
                <Card className={`border-3 rounded-3xl p-6 shadow-md relative overflow-hidden ${
                  isDark ? "bg-slate-950/90 border-[#2EC4B6]/35 text-white" : "bg-white border-emerald-100 text-slate-800"
                }`}>
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-teal-400 to-[#FFD166]"></div>

                  {/* Cute Companion bubble */}
                  <div className="bg-emerald-50/70 border border-emerald-150 p-4 rounded-2xl mb-5 flex gap-3 mt-1 shadow-inner">
                    <KobeAvatar character={companion} expression="happy" ageGroup="early explorers" size={54} />
                    <div>
                      <Txt size={11} className="text-emerald-800 font-extrabold uppercase font-mono tracking-wider block">
                        CUTE MASCOT TALK
                      </Txt>
                      <Txt size={13.5} className="text-slate-700 font-bold block mt-1 italic">
                        "{getCompanionDialogue(selectedLesson.title.en)}"
                      </Txt>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => speakEpisode(selectedLesson.title.en)}
                      className="bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-sky-200 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-sky-600" />
                      <span>Hear Lesson Button</span>
                    </button>
                    
                    <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                      🌱 Age 2–5 Track
                    </span>
                  </div>

                  <Heading size={22} className="text-slate-900 font-black mb-1.5 tracking-tight" style={{ fontWeight: 900 }}>
                    {selectedLesson.title.en}
                  </Heading>

                  <Txt size={14.5} className="text-slate-600 block mb-6 leading-relaxed font-bold">
                    {selectedLesson.story?.en}
                  </Txt>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`p-3 rounded-2xl text-center border transition-colors duration-200 ${
                      isDark ? "bg-amber-950/20 border-amber-900/30" : "bg-amber-50 border-amber-200"
                    }`}>
                      <Txt size={10} className="font-black block uppercase tracking-wide" style={{ color: isDark ? "#ffffff" : "#000000" }}>XP GIFT</Txt>
                      <Txt size={16} className="font-black block text-theme-sensitive" style={{ color: isDark ? "#ffffff" : "#000000" }}>+30 XP Points</Txt>
                    </div>
                    <div className={`p-3 rounded-2xl text-center border transition-colors duration-200 ${
                      isDark ? "bg-sky-950/20 border-sky-900/30" : "bg-sky-50 border-sky-150"
                    }`}>
                      <Txt size={10} className="font-black block uppercase tracking-wide" style={{ color: isDark ? "#ffffff" : "#000000" }}>TIME DURATION</Txt>
                      <Txt size={16} className="font-black block text-theme-sensitive" style={{ color: isDark ? "#ffffff" : "#000000" }}>{selectedLesson.duration}</Txt>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectLesson(selectedLesson)}
                    className="w-full bg-[#FFD166] hover:bg-[#e6bb5c] text-amber-950 font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-2 border-b-6 border-amber-600 active:translate-y-1 active:border-b-2"
                    style={{ cursor: "pointer", fontWeight: 900, fontSize: 16 }}
                  >
                    <span>Play Animated Story 🌟</span>
                  </button>
                </Card>
              ) : (
                <div className={`border-2 border-dashed rounded-3xl p-10 text-center ${
                  isDark ? "bg-slate-950/40 border-slate-800" : "bg-white/40 border-slate-300"
                }`}>
                  <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-spin-slow" />
                  <Txt size={14} className="text-slate-500 font-bold block">
                    Tap any beach icon milestone to play!
                  </Txt>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            CASE 2: JUNIOR AGE GROUP 6–12 (Young Innovators - PRIMARY)
            ======================================================= */}
        {ageGroup === "young innovators" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gamified Island Map Grid with Rivers and Checkpoints */}
            <div className={`col-span-1 lg:col-span-7 border-4 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col items-center ${isDark ? "bg-gradient-to-b from-slate-950 via-[#11242e] to-slate-955 border-[#2EC4B6]/30" : "bg-gradient-to-b from-[#e0fdf4] via-[#f0fdf4] to-[#fef08a] border-[#2EC4B6]/30"}`}>
              
              {/* Backdrops elements */}
              <div className="absolute top-8 left-4 text-4xl select-none opacity-20 pointer-events-none">🦈</div>
              <div className="absolute top-[40%] right-6 text-3xl select-none opacity-25 pointer-events-none">⚓</div>
              <div className="absolute bottom-[25%] left-6 text-4xl select-none opacity-20 pointer-events-none">🐊</div>

              {/* Secret interactive treasure chest on the map */}
              <div className={`w-full flex justify-between items-center border p-3 rounded-2xl mb-6 shadow-sm z-10 ${isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/70 border-[#2EC4B6]/20 text-slate-800"}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl select-none">🏴‍☠️</span>
                  <div>
                    <Txt size={11} className="text-[#2EC4B6] font-black uppercase font-mono block tracking-wider" style={{ fontSize: 9 }}>
                      SECRET MAP DISCOVERY
                    </Txt>
                    <Txt size={13} className={`font-black ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                      Can you uncover the hidden chest?
                    </Txt>
                  </div>
                </div>

                <button
                  onClick={handleClaimChest}
                  disabled={isChestClaimed}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition ${
                    isChestClaimed
                      ? isDark ? "bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed" : "bg-slate-100 text-slate-450 border border-slate-200 cursor-not-allowed"
                      : "bg-[#FFD166] hover:bg-[#e6bb5c] text-amber-950 border-b-4 border-amber-600 active:translate-y-0.5 shadow cursor-pointer"
                  }`}
                >
                  {isChestClaimed ? "🎉 Chest Collected!" : "🪙 Claim Bonus Chest"}
                </button>
              </div>

              {/* Road Map Nodes Grid */}
              <div className="w-full flex flex-col items-center gap-1">
                {lessons.map((lesson, idx) => {
                  const { isCompleted, isUnlocked, isCurrent } = getNodeDetails(lesson, idx);
                  const isSelected = selectedLesson?.id === lesson.id;
                  const config = customLessonsConfig[idx] || getLessonDecoration(idx);

                  return (
                    <React.Fragment key={lesson.id}>
                      
                      {/* Checkpoint node details */}
                      <div
                        onClick={() => handleNodeClick(lesson, isUnlocked)}
                        className={`w-full max-w-lg border-3 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-300 relative ${
                          isUnlocked
                            ? isSelected
                              ? isDark ? "bg-amber-950/50 border-[#FFD166] shadow-md scale-[1.02] z-10" : "bg-amber-50 border-[#FFD166] shadow-md scale-[1.02] z-10"
                              : isDark ? "bg-slate-900 border-slate-800 hover:border-[#2EC4B6]/50 shadow-sm cursor-pointer" : "bg-white border-slate-200/80 shadow-sm cursor-pointer hover:border-[#2EC4B6]/50"
                            : isDark ? "bg-slate-950/40 border-slate-900/60 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Circle Avatar wrapper */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-md border-b-6 ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-700 text-white"
                                : isCurrent
                                ? "bg-orange-400 border-orange-600 animate-pulse ring-4 ring-amber-300 text-slate-900"
                                : isUnlocked
                                ? "bg-[#2EC4B6] border-teal-700 text-white"
                                : "bg-slate-200 border-slate-400"
                            }`}>
                              {isCompleted ? (
                                <span>✅</span>
                              ) : isUnlocked ? (
                                <span>{config?.icon || "🥥"}</span>
                              ) : (
                                <span>🔒</span>
                              )}
                            </div>

                            {/* Completeness Badge */}
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white flex items-center gap-0.5 shadow-sm">
                                <span>⭐</span>
                                <span>3</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] uppercase font-mono font-black tracking-normal px-2 py-0.5 rounded ${
                                isDark ? "bg-emerald-950 text-emerald-305 border border-emerald-900" : "bg-emerald-50 text-emerald-800"
                              }`}>
                                {config?.landmark || `Checkpoint ${idx+1}`}
                              </span>
                              
                              <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded border ${
                                isDark ? "bg-[#161b26] text-slate-400 border-[#232d3f]" : "bg-slate-50 text-slate-500 border-slate-150"
                              }`}>
                                ⭐ +50 XP
                              </span>
                              
                              <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded border ${
                                isDark ? "bg-[#1a2538] text-sky-400 border-sky-900/40" : "bg-sky-50 text-sky-805 border-sky-150"
                              }`}>
                                {config?.duration || "⏱ 4 min"}
                              </span>
                            </div>

                            <Heading size={18} className={`font-black tracking-tight mt-1 truncate ${isUnlocked ? isDark ? "text-amber-205" : "text-slate-900" : "text-slate-450"}`} style={{ fontWeight: 800 }}>
                              {lesson.title.en}
                            </Heading>
                          </div>
                        </div>

                        <div className="flex-shrink-0 pl-2">
                          {isCompleted ? (
                            <span className={`text-xs border px-2 py-0.5 rounded-full font-black uppercase ${
                              isDark ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                            }`}>
                              Done
                            </span>
                          ) : isUnlocked ? (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-350" />
                          )}
                        </div>
                      </div>

                      {/* Bridge connection tracks */}
                      {idx < lessons.length - 1 && (
                        <div className="py-2.5 flex flex-col items-center justify-center opacity-70">
                          <span className={`text-[10px] font-mono select-none tracking-widest font-black uppercase ${
                            isDark ? "text-[#2EC4B6]/60" : "text-[#2EC4B6]"
                          }`}>
                            {idx % 2 === 0 ? "🌉 RIVER CROSSING BRIDGE 🌉" : "👣 SANDY FOOTPRINTS 👣"}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

            </div>

            {/* Right Action Sidebar */}
            <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-24">
              {selectedLesson ? (
                <Card className={`border-3 rounded-3xl p-5 shadow-md relative overflow-hidden ${
                  isDark ? "bg-slate-950/90 border-[#2EC4B6]/40 text-white" : "bg-white border-[#2EC4B6]/25 text-slate-900"
                }`}>
                  <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-[#2EC4B6] to-[#B8A0FF]"></div>

                  {/* Companion briefs bubble */}
                  <div className={`border p-3.5 rounded-2xl mb-4 flex gap-2.5 mt-1 ${
                    isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-emerald-50/70 border-[#2EC4B6]/10"
                  }`}>
                    <div className="flex-shrink-0 self-start">
                      <KobeAvatar character={companion} expression="happy" ageGroup="young innovators" size={48} />
                    </div>
                    <div>
                      <Txt size={10} className="text-[#2EC4B6] font-black uppercase font-mono tracking-wider block">
                        {companion === "chibi" ? "CHIBI GUIDE COMPANION" : "KOBE GUIDE COMPANION"}
                      </Txt>
                      <Txt size={13} className={`font-bold block mt-1 leading-normal italic ${
                        isDark ? "text-slate-205" : "text-slate-700"
                      }`}>
                        "{getCompanionDialogue(selectedLesson.title.en)}"
                      </Txt>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => speakEpisode(selectedLesson.title.en)}
                      className={`font-bold px-3 py-1 border rounded-xl text-xs flex items-center gap-1 cursor-pointer ${
                        isDark ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-50 hover:bg-slate-100 text-slate-650 border-slate-200"
                      }`}
                    >
                      <Volume2 className="w-4 h-4 text-slate-500" />
                      <span>Hear Text</span>
                    </button>

                    <span className={`text-[10px] font-black uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                      isDark ? "text-slate-400 bg-slate-900 border-slate-800" : "text-slate-450 bg-slate-100 border-slate-200"
                    }`}>
                      ⏱ {selectedLesson.duration}
                    </span>
                  </div>

                  <Card className={`border rounded-2xl p-4 mb-5 ${
                    isDark ? "bg-slate-900/60 border-slate-800/80 text-white" : "bg-slate-50/70 border-slate-150"
                  }`}>
                    <Heading size={18} className={`font-black mb-1.5 tracking-tight ${isDark ? "text-[#FFD166]" : "text-slate-900"}`} style={{ fontWeight: 800 }}>
                      {selectedLesson.title.en}
                    </Heading>
                    <Txt size={13.5} className={`block leading-relaxed font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {selectedLesson.story?.en}
                    </Txt>
                  </Card>

                  {/* XP Prize Banner */}
                  <div className={`border rounded-2xl p-3 text-center mb-5 flex items-center gap-2 justify-center ${
                    isDark ? "bg-amber-950/20 border-amber-900/40" : "bg-gradient-to-r from-amber-400/10 to-orange-400/10 border-[#FFD166]/50"
                  }`}>
                    <span className="text-2xl select-none">🏆</span>
                    <div>
                      <Txt size={13} className={`font-black tracking-tight ${isDark ? "text-amber-205" : "text-amber-950"}`}>
                        Earn +50 XP and 3 Stars!
                      </Txt>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectLesson(selectedLesson)}
                    className="w-full bg-[#2EC4B6] hover:bg-[#209c90] text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition border-b-6 border-[#1c8076] active:translate-y-1 active:border-b-2"
                    style={{ cursor: "pointer", fontWeight: 900, fontSize: 15 }}
                  >
                    <span>🎯 Enter Active Lesson</span>
                  </button>
                </Card>
              ) : (
                <div className={`border-2 border-dashed rounded-3xl p-10 text-center ${
                  isDark ? "bg-slate-950/40 border-slate-800" : "bg-white/40 border-slate-350"
                }`}>
                  <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-spin-slow" />
                  <Txt size={14} className={`font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Tap an unlocked checkpoint to load details!
                  </Txt>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================
            CASE 3: TEEN / PIONEER AGE GROUP 13–18 (Future Builders)
            ======================================================== */}
        {ageGroup === "future builders" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Minimalist, expert vertical progression timeline */}
            <div className={`col-span-1 lg:col-span-7 border-3 p-6 rounded-3xl shadow-sm relative overflow-hidden ${isDark ? "bg-slate-950 border-slate-805" : "bg-white border-slate-200"}`}>
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <Heading size={18} className={`font-black uppercase tracking-wider ${isDark ? "text-white" : "text-slate-900"}`} style={{ fontWeight: 800 }}>
                    Neural Path Milestones
                  </Heading>
                </div>

                <div className={`font-black text-[11px] px-3 py-1 rounded-full border ${isDark ? "bg-purple-950/25 border-purple-900 text-[#B8A0FF]" : "bg-[#B8A0FF]/15 text-[#4e2b8c] border-[#B8A0FF]/30"}`}>
                  🔥 Active Streak: 5 Days
                </div>
              </div>

              {/* Progress bar info */}
              <div className={`mb-6 border p-4 rounded-2xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                <div className="flex justify-between items-baseline mb-2">
                  <Txt size={12} className={`font-black uppercase font-mono tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    MODULE COMPLETE RATIO
                  </Txt>
                  <Txt size={14} className="text-[#2EC4B6] font-black">
                    {pct}% Graduated
                  </Txt>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-105"}`}>
                  <div className="h-full bg-gradient-to-r from-[#2EC4B6] to-[#B8A0FF] transition-all duration-300" style={{ width: `${pct}%` }}></div>
                </div>
              </div>

              {/* Professional timeline layout */}
              <div className="relative pl-8 border-l-3 border-[#2EC4B6]/20 flex flex-col gap-6 ml-3">
                {lessons.map((lesson, idx) => {
                  const { isCompleted, isUnlocked, isCurrent } = getNodeDetails(lesson, idx);
                  const isSelected = selectedLesson?.id === lesson.id;
                  const config = customLessonsConfig[idx] || getLessonDecoration(idx);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleNodeClick(lesson, isUnlocked)}
                      className={`relative p-4 rounded-2xl border-2 transition-all duration-155 ${
                        isUnlocked
                          ? isSelected
                            ? isDark ? "bg-[#2EC4B6]/15 border-[#2EC4B6] shadow-sm text-white" : "bg-[#2EC4B6]/5 border-[#2EC4B6] shadow-sm text-slate-900"
                            : isDark ? "bg-[#111114] border-slate-800 text-slate-300 hover:bg-slate-900 cursor-pointer" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 cursor-pointer"
                          : isDark ? "bg-slate-950/40 border-slate-900/60 text-slate-650 opacity-55 cursor-not-allowed" : "bg-slate-50 border-slate-100 text-slate-450 opacity-55 cursor-not-allowed"
                      }`}
                    >
                      {/* Interactive dot placing on the border timeline */}
                      <span className={`absolute -left-12.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-3 flex items-center justify-center text-[10px] font-black ${
                        isCompleted
                          ? "bg-emerald-500 border-white text-white"
                          : isCurrent
                          ? "bg-[#2EC4B6] border-white text-white animate-pulse"
                          : isUnlocked
                          ? "bg-sky-400 border-white text-white"
                          : "bg-slate-300 border-white text-slate-500"
                      }`}>
                        {isCompleted ? "✓" : idx + 1}
                      </span>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{config?.icon || "⚙️"}</div>
                          <div>
                            <span className="text-[10px] font-black tracking-wider uppercase font-mono text-slate-400 block mb-0.5">
                              {config?.landmark || `Lecture ${idx+1}`}
                            </span>
                            <Heading size={16} className={`font-black ${isUnlocked ? isDark ? "text-amber-205" : "text-slate-905" : "text-slate-450"}`} style={{ fontWeight: 800 }}>
                              {lesson.title.en}
                            </Heading>
                            <Txt size={12} className={`font-semibold block mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                              {config?.duration || "⏱ 6 min"} &bull; Reward: +{config?.xp || 50} XP
                            </Txt>
                          </div>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className={`text-xs font-black rounded px-2.5 py-0.5 uppercase border ${
                              isDark ? "bg-emerald-950/40 border-emerald-900 text-emerald-400" : "bg-emerald-5/50 border-emerald-150 text-emerald-500"
                            }`}>
                              PASSED
                            </span>
                          ) : isUnlocked ? (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          ) : (
                            <span className="text-xs text-slate-350 font-bold uppercase font-mono">LOCKED</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Action Sidebar */}
            <div className="col-span-1 lg:col-span-5 lg:sticky lg:top-24">
              {selectedLesson ? (
                <Card className={`border-2 rounded-2xl p-6 shadow-sm relative overflow-hidden ${
                  isDark ? "bg-slate-950/90 border-[#2EC4B6]/35 text-white" : "bg-white border-slate-205 text-slate-900"
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-100">
                    <span className={`border font-mono text-[10px] font-black px-2.5 py-1 rounded ${
                      isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-205 text-slate-600"
                    }`}>
                      SECTOR DETAIL
                    </span>

                    <span className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-450"}`}>
                      Course {selectedLesson.code}
                    </span>
                  </div>

                  <Heading size={22} className={`font-black mb-2 tracking-tight ${isDark ? "text-amber-205" : "text-slate-905"}`} style={{ fontWeight: 900 }}>
                    {selectedLesson.title.en}
                  </Heading>

                  <Txt size={14} className={`block leading-relaxed font-semibold mb-6 ${isDark ? "text-slate-350" : "text-slate-500"}`}>
                    {selectedLesson.story?.en}
                  </Txt>

                  {/* Skills badge item representation */}
                  <div className={`border rounded-2xl p-4 mb-6 ${
                    isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-[#B8A0FF]/5 border-[#B8A0FF]/15"
                  }`}>
                    <div className="flex items-center gap-3.5">
                      <span className={`text-3xl border p-2 rounded-xl ${isDark ? "bg-slate-950 border-slate-850" : "bg-white border-[#B8A0FF]/30"}`}>🔒</span>
                      <div>
                        <Txt size={10} className="font-black uppercase font-mono tracking-widest block mb-0.5" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                          EARNABLE SKILL RECOGNITION
                        </Txt>
                        <Txt size={13} className="font-black block" style={{ color: isDark ? "#ffffff" : "#000000" }}>
                          Core Algorithmic Competency Certification
                        </Txt>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className={`p-3 rounded-2xl border text-center transition-colors duration-200 ${
                      isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"
                    }`}>
                      <Txt size={10} className="font-bold uppercase block tracking-wider" style={{ color: isDark ? "#ffffff" : "#000000" }}>EXP TIMED</Txt>
                      <Txt size={15} className="font-black" style={{ color: isDark ? "#ffffff" : "#000000" }}>{selectedLesson.duration}</Txt>
                    </div>
                    <div className={`p-3 rounded-2xl border text-center transition-colors duration-200 ${
                      isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"
                    }`}>
                      <Txt size={10} className="font-bold uppercase block tracking-wider" style={{ color: isDark ? "#ffffff" : "#000000" }}>REWARD WEIGHT</Txt>
                      <Txt size={15} className="font-black" style={{ color: isDark ? "#ffffff" : "#000000" }}>+{customLessonsConfig[lessons.indexOf(selectedLesson)]?.xp || 50} XP</Txt>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectLesson(selectedLesson)}
                    className="w-full bg-[#2EC4B6] hover:bg-[#209c90] text-white font-black py-4 px-6 rounded-2xl shadow transition border-b-6 border-[#1c8076] active:translate-y-1 active:border-b-2"
                    style={{ cursor: "pointer", fontWeight: 900, fontSize: 15 }}
                  >
                    <span>🚀 Launch Interactive Sandbox</span>
                  </button>
                </Card>
              ) : (
                <div className={`border-2 border-dashed rounded-3xl p-10 text-center ${
                  isDark ? "bg-slate-950/40 border-slate-800" : "bg-white/40 border-slate-350"
                }`}>
                  <Compass className="w-10 h-10 text-slate-400 mx-auto mb-2 animate-spin-slow" />
                  <Txt size={14} className={`font-bold block ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Choose a lecture milestone node from the left timeline tree.
                  </Txt>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default LearningPath;
