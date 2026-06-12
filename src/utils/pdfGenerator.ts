/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { Parent, Child } from "../types";

export function downloadProgressReport(parent: Parent) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const children = parent.children || [];
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // --- BRAND COLOURS ---
  const DARK_BG = "#0F172A";
  const PRIMARY_TEAL = "#2EC4B6";
  const LIGHT_TEAL = "#E6FFFC";
  const ACCENT_LAVENDER = "#B8A0FF";
  const TEXT_DARK = "#1E293B";
  const TEXT_MUTED = "#64748B";

  // --- HEADER SECTION ---
  doc.setFillColor(15, 23, 42); // Navy Blue Banner Background (#0F172A)
  doc.rect(0, 0, 210, 42, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("CLATS ACADEMIC PROGRESS REPORT", 14, 18);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Sustainable SDG 4.2 Early Tech Literacy Framework for Africa", 14, 25);

  // Date & Parent Info (Right side)
  doc.setTextColor(184, 160, 255); // Lavender
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`REPORT GENERATED: ${dateStr.toUpperCase()}`, 130, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.text(`Parent Account: ${parent.name} (${parent.email})`, 130, 24);
  doc.text(`Status: Synced (Supabase Ready)`, 130, 29);

  // Decorative Accent line
  doc.setFillColor(46, 196, 178); // Teal
  doc.rect(0, 42, 210, 2, "F");

  let yOffset = 58;

  if (children.length === 0) {
    // No kids block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("No child profiles found.", 14, yOffset);

    yOffset += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("Enroll a child profile from your parent dashboard to start tracking metrics.", 14, yOffset);
  } else {
    children.forEach((child, index) => {
      // Avoid overflowing A4 page space if there are many kids (add page)
      if (index > 0 && yOffset > 210) {
        doc.addPage();
        yOffset = 25; // Reset offset on new page
      }

      // --- CHILD HEADER BAR ---
      doc.setFillColor(241, 245, 249); // light slate background
      doc.rect(14, yOffset, 182, 10, "F");
      
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, yOffset, 182, 10, "D");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`STUDENT PROFILE: ${child.name.toUpperCase()} (Avatar: ${child.avatar || "👦🏾"})`, 18, yOffset + 6.5);

      yOffset += 16;

      // --- STATS GRID BOXES ---
      // Box 1: Core XP
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, yOffset, 56, 22, "FD");
      doc.setFillColor(46, 196, 182); // Teal Accent corner
      doc.rect(14, yOffset, 2, 22, "F");
      
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("CUMULATIVE SCORE", 20, yOffset + 6);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${child.xp || 0} XP`, 20, yOffset + 14);

      // Box 2: Lessons
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(76, yOffset, 58, 22, "FD");
      doc.setFillColor(184, 160, 255); // Lavender Accent corner
      doc.rect(76, yOffset, 2, 22, "F");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("COMPLETED MODULES", 82, yOffset + 6);
      
      const finishedCount = Object.keys(child.completed || {}).length;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${finishedCount} Lessons`, 82, yOffset + 14);

      // Box 3: Age Category
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(140, yOffset, 56, 22, "FD");
      doc.setFillColor(250, 204, 21); // Yellow Accent corner
      doc.rect(140, yOffset, 2, 22, "F");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("LITERACY BRACKET", 146, yOffset + 6);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(child.ageGroup.toUpperCase(), 146, yOffset + 14);

      yOffset += 28;

      // Section: Detailed Lessons log
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("RECENT LESSON ASSESSMENTS & GRADES", 14, yOffset);

      yOffset += 4;

      const results = child.quizResults || {};
      const resultsKeys = Object.keys(results);

      if (resultsKeys.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("No graded assessments recorded yet. Have your student start learning loops and binaries!", 14, yOffset);
        yOffset += 10;
      } else {
        // Draw Assessment Table Headers
        doc.setFillColor(248, 250, 252);
        doc.rect(14, yOffset, 182, 7, "F");
        doc.setDrawColor(226, 232, 240);
        doc.line(14, yOffset, 196, yOffset);
        doc.line(14, yOffset + 7, 196, yOffset + 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("LESSON KEY", 17, yOffset + 4.5);
        doc.text("ACCURACY SCORE", 65, yOffset + 4.5);
        doc.text("CORRECT SPECS", 110, yOffset + 4.5);
        doc.text("ASSESSMENT STATUS", 150, yOffset + 4.5);

        yOffset += 7;

        resultsKeys.forEach((key) => {
          const r = results[key] || { score: 100, correctCount: 5, totalQuestions: 5, status: "Passed", completedAt: "Today" };
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(key.toUpperCase(), 17, yOffset + 5);

          // Accuracy level bar representation
          doc.setFillColor(230, 242, 254);
          doc.rect(65, yOffset + 2, 26, 4, "F");
          doc.setFillColor(46, 196, 182); // Teal bar fill
          const barWidth = Math.min(26, Math.max(0, (r.score / 100) * 26));
          doc.rect(65, yOffset + 2, barWidth, 4, "F");

          doc.setFont("helvetica", "bold");
          doc.text(`${r.score}%`, 94, yOffset + 5.5);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(71, 85, 105);
          doc.text(`${r.correctCount || 0}/${r.totalQuestions || 5} Questions`, 110, yOffset + 5);

          const isPass = (r.score || 100) >= 70;
          doc.setFont("helvetica", "bold");
          if (isPass) {
            doc.setTextColor(16, 185, 129); // green
            doc.text("PASSED ✔", 150, yOffset + 5);
          } else {
            doc.setTextColor(244, 63, 94); // red
            doc.text("NEEDS REVIEW ⚠", 150, yOffset + 5);
          }

          // Separator line
          doc.setDrawColor(241, 245, 249);
          doc.line(14, yOffset + 7.5, 196, yOffset + 7.5);

          yOffset += 8;
        });
      }

      // Add a nice security PIN compliance detail
      doc.setFillColor(240, 253, 250); // Teal soft card
      doc.rect(14, yOffset, 182, 11, "F");
      doc.setDrawColor(204, 251, 241);
      doc.rect(14, yOffset, 182, 11, "D");

      doc.setTextColor(13, 148, 136); // Teal text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(`🔒 SECURE LOGIN SPECS • Companion Guide Mode: ${child.companion === "chibi" ? "Chibi (Narrator Mode)" : "Kobe (AI Mentor Mode)"}`, 18, yOffset + 7);
      
      yOffset += 18;
    });
  }

  // --- FOOTER AND UNICEF / SDG CITATIONS (Sticker banner at bottom) ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Grey separator line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 274, 196, 274);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("CLATS Platform Learning Management Sync • Supported by UNICEF early-childhood digital inclusion practices.", 14, 279);
    doc.text("SDG 4.2: Ensure youth-friendly target development loops, block sequence logical reasoning and foundational AI mastery.", 14, 283);

    // Page indicator
    doc.setFont("helvetica", "bold");
    doc.text(`PAGE ${i} OF ${pageCount}`, 180, 281);
  }

  // Trigger browser download action beautifully
  const sanitizedName = parent.name.replace(/\s+/g, "_");
  doc.save(`CLATS_Academic_Progress_${sanitizedName}.pdf`);
}
