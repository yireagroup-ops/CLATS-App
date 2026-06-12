/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "en" | "ig" | "yo";

export type AgeGroup = "early explorers" | "young innovators" | "future builders";

export interface Child {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatar: string;
  pin: string;
  interests: string[];
  completed: Record<string, boolean>; // lessonId -> true
  xp: number;
  stars: Record<string, number>; // lessonId -> count
  createdAt: number;
  companion?: "kobe" | "chibi"; // Preferred companion, Kobe (boy) or Chibi (girl)
  quizResults?: Record<string, {
    score: number;
    correctCount: number;
    totalQuestions: number;
    status: "Passed" | "Needs Review";
    completedAt: string;
  }>;
  child_tutorial_completed?: boolean;
}

export interface Parent {
  email: string;
  name: string;
  children: Child[];
  tutorial_completed?: boolean;
}

export interface QuizQuestion {
  q: Record<Language, string>;
  opts: Record<Language, string[]>;
  ans: number;
}

export interface Lesson {
  id: string;
  title: Record<Language, string>;
  code: string;
  duration: string;
  type: "story" | "puzzle" | "project";
  story?: Record<Language, string>;
  puzzle?: {
    text: Record<Language, string>;
    items: {
      en: string[];
      ig?: string[];
      yo?: string[];
      correct: boolean[];
    };
  };
  project?: Record<Language, string>;
  quiz: QuizQuestion[];
}

export interface Module {
  id: string;
  name: Record<Language, string>;
  goal: Record<Language, string>;
  lessons: Lesson[];
  badge: {
    name: string;
    icon: string;
  };
  comingSoon?: boolean;
}

export interface Course {
  id: AgeGroup;
  title: Record<Language, string>;
  description: Record<Language, string>;
  modules: Module[];
}
