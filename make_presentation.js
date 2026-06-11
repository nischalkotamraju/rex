const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// Colors (no # prefix for pptxgenjs)
const C = {
  white:       "ffffff",
  bgLight:     "ede9fe",
  bgSoftPurple:"ede9fe",
  bgSlide:     "f5f3ff",
  darkText:    "0f0a1e",
  purple:      "7c3aed",
  purpleDark:  "6d28d9",
  lightPurple: "a78bfa",
  accentPurple:"c4b5fd",
  muted:       "6b7280",
  bodyText:    "374151",
  borderLight: "e5e7eb",
  rowAlt:      "ede9fe",
};

const iconPath = path.resolve("/Users/nischalkotamraju/Desktop/rex/extension/public/icons/icon128.png");
const iconData = "image/png;base64," + fs.readFileSync(iconPath).toString("base64");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Nischal Kotamraju";
pres.title = "Rex – AI Commitment Tracker";

// ─────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  // Large purple gradient rectangle covering top 65% — simulate gradient with two overlapping rects
  // Left side: #7c3aed, right side: #6d28d9 — use a single rectangle filled purple (gradient not supported natively)
  // We'll use two rectangles to simulate gradient: left half slightly lighter, right half darker
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 5, h: 3.66,
    fill: { color: C.purple }, line: { color: C.purple, width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5, y: 0, w: 5, h: 3.66,
    fill: { color: C.purpleDark }, line: { color: C.purpleDark, width: 0 },
  });

  // Rex icon centered inside purple area
  slide.addImage({ data: iconData, x: 4.4, y: 0.45, w: 1.2, h: 1.2 });

  // "Rex" in white
  slide.addText("Rex", {
    x: 0, y: 1.7, w: 10, h: 1.0,
    fontSize: 56, fontFace: "Calibri", bold: true, color: C.white,
    align: "center", valign: "middle",
  });

  // Subtitle in light purple accent
  slide.addText("AI Commitment Tracker for Gmail", {
    x: 0.5, y: 2.75, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: C.accentPurple,
    align: "center", valign: "middle",
  });

  // Tagline below rectangle on white background
  slide.addText("Your inbox has always had commitments in it. Rex makes them impossible to miss.", {
    x: 1.2, y: 3.9, w: 7.6, h: 0.9,
    fontSize: 14, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle",
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 — The Problem
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("The Problem", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const problems = [
    {
      num: "1",
      title: "Buried Deadlines",
      desc: "Commitments hide inside long threads with no way to surface them",
    },
    {
      num: "2",
      title: "Missed Follow-ups",
      desc: "People forget to respond after the conversation moves on",
    },
    {
      num: "3",
      title: "No Inbox Intelligence",
      desc: "Existing tools manage volume but none understand what you owe",
    },
  ];

  problems.forEach((p, i) => {
    const x = 0.4 + i * 3.15;
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.15, w: 2.9, h: 3.6,
      fill: { color: C.bgSoftPurple },
      line: { color: C.borderLight, width: 0.75 },
    });
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 1.1, y: 1.45, w: 0.65, h: 0.65,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 },
    });
    slide.addText(p.num, {
      x: x + 1.1, y: 1.45, w: 0.65, h: 0.65,
      fontSize: 18, fontFace: "Calibri", bold: true, color: C.white,
      align: "center", valign: "middle",
    });
    // Title
    slide.addText(p.title, {
      x: x + 0.18, y: 2.3, w: 2.54, h: 0.55,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText,
      align: "center", valign: "middle",
    });
    // Description
    slide.addText(p.desc, {
      x: x + 0.18, y: 2.9, w: 2.54, h: 1.5,
      fontSize: 13, fontFace: "Calibri", color: C.bodyText,
      align: "center", valign: "top",
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3 — How Rex Works
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("How Rex Works", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const steps = [
    { num: "1", title: "Scan", desc: "Rex reads your Gmail threads in real time using Claude AI" },
    { num: "2", title: "Detect", desc: "Identifies commitments, deadlines, and promises automatically" },
    { num: "3", title: "Surface", desc: "Shows everything in a live inbox banner and inline thread cards" },
  ];

  steps.forEach((s, i) => {
    const x = 0.4 + i * 3.15;
    // Card
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.15, w: 2.9, h: 3.6,
      fill: { color: C.bgSoftPurple },
      line: { color: C.borderLight, width: 0.75 },
    });
    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: x + 1.1, y: 1.45, w: 0.65, h: 0.65,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 },
    });
    slide.addText(s.num, {
      x: x + 1.1, y: 1.45, w: 0.65, h: 0.65,
      fontSize: 18, fontFace: "Calibri", bold: true, color: C.white,
      align: "center", valign: "middle",
    });
    // Step title
    slide.addText(s.title, {
      x: x + 0.18, y: 2.3, w: 2.54, h: 0.5,
      fontSize: 16, fontFace: "Calibri", bold: true, color: C.darkText,
      align: "center", valign: "middle",
    });
    // Description
    slide.addText(s.desc, {
      x: x + 0.18, y: 2.9, w: 2.54, h: 1.5,
      fontSize: 13, fontFace: "Calibri", color: C.muted,
      align: "center", valign: "top",
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 — Architecture
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("Architecture", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  // Helper: add a box with title + subtitle
  const addBox = (label, sublabel, x, y, fillColor) => {
    const w = 2.2, h = 1.0;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: fillColor },
      line: { color: fillColor, width: 0 },
    });
    slide.addText(label, {
      x, y: y + 0.1, w, h: 0.45,
      fontSize: 13, fontFace: "Calibri", bold: true, color: C.white,
      align: "center", valign: "middle",
    });
    slide.addText(sublabel, {
      x, y: y + 0.55, w, h: 0.35,
      fontSize: 10, fontFace: "Calibri", color: C.accentPurple,
      align: "center", valign: "middle",
    });
  };

  // Row 1 boxes
  addBox("Chrome Extension", "React + TypeScript", 0.8, 1.8, "7c3aed");
  addBox("Express Server",   "Node.js API",        3.9, 1.8, "6d28d9");
  addBox("Claude API",       "Anthropic",          7.0, 1.8, "4c1d95");

  // Arrow box1 → box2 (row1)
  slide.addShape(pres.shapes.LINE, {
    x: 3.0, y: 2.3, w: 0.9, h: 0,
    line: { color: "7c3aed", width: 2, endArrowType: "triangle" },
  });
  // Label: "reads email"
  slide.addText("reads email", {
    x: 3.0, y: 2.05, w: 0.9, h: 0.22,
    fontSize: 8, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle",
  });

  // Arrow box2 → box3 (row1)
  slide.addShape(pres.shapes.LINE, {
    x: 6.1, y: 2.3, w: 0.9, h: 0,
    line: { color: "7c3aed", width: 2, endArrowType: "triangle" },
  });
  // Label: "AI analysis"
  slide.addText("AI analysis", {
    x: 6.1, y: 2.05, w: 0.9, h: 0.22,
    fontSize: 8, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle",
  });

  // Row 2 boxes
  addBox("Supabase",       "Auth + Database",     2.4, 3.5, "5b21b6");
  addBox("Next.js Website","Landing + Dashboard", 5.4, 3.5, "7c3aed");

  // Arrow box1 down → box4 (L-shape: vertical segment then horizontal)
  // Vertical: x:1.9, y:2.8 → y:3.5
  slide.addShape(pres.shapes.LINE, {
    x: 1.9, y: 2.8, w: 0, h: 0.7,
    line: { color: "7c3aed", width: 2 },
  });
  // Horizontal: x:1.9, y:3.5 → x:2.4, y:3.5
  slide.addShape(pres.shapes.LINE, {
    x: 1.9, y: 3.5, w: 0.5, h: 0,
    line: { color: "7c3aed", width: 2, endArrowType: "triangle" },
  });

  // Arrow box2 down → box4 (L-shape)
  // Vertical: x:5.0, y:2.8 → y:3.5
  slide.addShape(pres.shapes.LINE, {
    x: 5.0, y: 2.8, w: 0, h: 0.7,
    line: { color: "7c3aed", width: 2 },
  });
  // Horizontal: x:5.0, y:3.5 → x:4.6, y:3.5 (arrow pointing left toward box4)
  // pptxgenjs lines always go left→right when w>0; to point left use beginArrowType
  slide.addShape(pres.shapes.LINE, {
    x: 4.6, y: 3.5, w: 0.4, h: 0,
    line: { color: "7c3aed", width: 2, beginArrowType: "triangle" },
  });

  // Arrow box5 → box4: from x:5.4 pointing left to x:4.6 — use beginArrowType
  slide.addShape(pres.shapes.LINE, {
    x: 4.6, y: 4.0, w: 0.8, h: 0,
    line: { color: "7c3aed", width: 2, beginArrowType: "triangle" },
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 — API Endpoints
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("API Endpoints", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const makeHeaderCell = (text) => ({
    text,
    options: {
      fontFace: "Calibri", fontSize: 13, bold: true,
      color: C.white, fill: { color: C.purple },
    },
  });
  const makeCell = (text, altRow) => ({
    text,
    options: {
      fontFace: "Calibri", fontSize: 13,
      color: C.darkText,
      fill: { color: altRow ? C.rowAlt : C.bgSlide },
    },
  });

  const rows = [
    [makeHeaderCell("Method"), makeHeaderCell("Endpoint"), makeHeaderCell("Description")],
    [makeCell("POST", false),  makeCell("/api/analyze/thread", false), makeCell("Analyze a single email thread for commitments", false)],
    [makeCell("POST", true),   makeCell("/api/analyze/inbox", true),   makeCell("Batch analyze inbox email snippets", true)],
    [makeCell("POST", false),  makeCell("/api/draft", false),          makeCell("Generate AI-powered follow-up draft reply", false)],
    [makeCell("GET", true),    makeCell("/api/commitments", true),     makeCell("Fetch all tracked commitments", true)],
    [makeCell("PATCH", false), makeCell("/api/commitments/:id/complete", false), makeCell("Mark a commitment as complete", false)],
    [makeCell("GET", true),    makeCell("/api/health", true),          makeCell("Health check", true)],
  ];

  slide.addTable(rows, {
    x: 0.5, y: 1.05, w: 9, h: 3.9,
    colW: [1.1, 3.2, 4.7],
    border: { pt: 0.75, color: C.borderLight },
    rowH: 0.52,
  });
}

// ─────────────────────────────────────────────
// SLIDE 6 — Built to Scale
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("Built to Scale", {
    x: 0.5, y: 0.3, w: 9, h: 0.55,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const items = [
    { label: "Supabase",           desc: "Auth and persistence at any scale, no infrastructure to manage" },
    { label: "Stateless Server",   desc: "Express API is horizontally scalable with no session state" },
    { label: "Claude API",         desc: "Scales with usage, no self-hosted models or GPU costs" },
    { label: "Client-Side Extension", desc: "UI runs in the browser, zero server load for rendering" },
    { label: "Vercel Edge",        desc: "Next.js website deploys globally on Vercel's edge network" },
  ];

  items.forEach((item, i) => {
    const y = 1.1 + i * 0.82;
    // Purple dot
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.1, w: 0.3, h: 0.3,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 },
    });
    // Bold label
    slide.addText(item.label, {
      x: 0.95, y: y, w: 2.4, h: 0.48,
      fontSize: 14, fontFace: "Calibri", bold: true, color: C.darkText,
      align: "left", valign: "middle", margin: 0,
    });
    // Description
    slide.addText(item.desc, {
      x: 3.5, y: y, w: 6.1, h: 0.48,
      fontSize: 13, fontFace: "Calibri", color: C.muted,
      align: "left", valign: "middle", margin: 0,
    });
    // Separator line (except last)
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 0.5, y: y + 0.6, w: 9, h: 0,
        line: { color: C.borderLight, width: 0.5 },
      });
    }
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 — What's Next
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("What's Next", {
    x: 0.5, y: 0.25, w: 9, h: 0.6,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const milestones = [
    {
      phase: "Q3 2026",
      color: C.purple,
      items: ["Mobile notifications for reminders", "Google Calendar sync"],
    },
    {
      phase: "Q4 2026",
      color: "5b21b6",
      items: ["Team commitment tracking", "Slack and Teams integration"],
    },
    {
      phase: "2027",
      color: "4c1d95",
      items: ["Multi-inbox support (Outlook, Apple Mail)", "Natural language search"],
    },
  ];

  milestones.forEach((m, i) => {
    const y = 1.1 + i * 1.4;
    // Colored left bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.2, h: 1.2,
      fill: { color: m.color }, line: { color: m.color, width: 0 },
    });
    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.7, y, w: 8.9, h: 1.2,
      fill: { color: C.bgSoftPurple }, line: { color: C.borderLight, width: 0.5 },
    });
    // Phase label
    slide.addText(m.phase, {
      x: 0.95, y: y + 0.1, w: 1.5, h: 0.4,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.darkText,
      align: "left", valign: "middle", margin: 0,
    });
    // Items as plain text
    slide.addText(m.items.join("     ·     "), {
      x: 0.95, y: y + 0.55, w: 8.3, h: 0.55,
      fontSize: 13, fontFace: "Calibri", color: C.muted,
      align: "left", valign: "middle", margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 8 — Impact
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSlide };

  slide.addText("Impact", {
    x: 0.5, y: 0.25, w: 9, h: 0.55,
    fontSize: 34, fontFace: "Calibri", bold: true, color: C.darkText,
    align: "left", valign: "middle", margin: 0,
  });

  const stats = [
    { value: "121",  label: "emails/day per professional" },
    { value: "28%",  label: "of workweek spent on email" },
    { value: "1.8B", label: "Gmail users worldwide" },
  ];

  stats.forEach((s, i) => {
    const x = 0.4 + i * 3.1;
    // Stat box
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.05, w: 2.8, h: 1.65,
      fill: { color: C.bgSoftPurple }, line: { color: C.borderLight, width: 0.75 },
    });
    slide.addText(s.value, {
      x, y: 1.1, w: 2.8, h: 0.95,
      fontSize: 52, fontFace: "Calibri", bold: true, color: C.purple,
      align: "center", valign: "middle",
    });
    slide.addText(s.label, {
      x, y: 2.05, w: 2.8, h: 0.5,
      fontSize: 12, fontFace: "Calibri", color: C.muted,
      align: "center", valign: "top",
    });
  });

  // Two text blocks side by side
  const blocks = [
    { heading: "Who it's for", body: "Knowledge workers, freelancers, and teams who live in their inbox" },
    { heading: "How it grows",  body: "Free tier drives adoption. Pro tier at $9/mo converts power users." },
  ];

  blocks.forEach((b, i) => {
    const x = 0.4 + i * 4.9;
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.1, w: 4.5, h: 1.8,
      fill: { color: C.bgSoftPurple }, line: { color: C.borderLight, width: 0.75 },
    });
    slide.addText(b.heading, {
      x: x + 0.2, y: 3.2, w: 4.1, h: 0.45,
      fontSize: 15, fontFace: "Calibri", bold: true, color: C.purple,
      align: "left", valign: "middle", margin: 0,
    });
    slide.addText(b.body, {
      x: x + 0.2, y: 3.65, w: 4.1, h: 1.0,
      fontSize: 13, fontFace: "Calibri", color: C.muted,
      align: "left", valign: "top", margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 9 — Closing
// ─────────────────────────────────────────────
{
  let slide = pres.addSlide();
  slide.background = { color: C.bgSoftPurple };

  // Rex icon
  slide.addImage({ data: iconData, x: 4.4, y: 0.7, w: 1.2, h: 1.2 });

  slide.addText("Rex", {
    x: 0, y: 2.0, w: 10, h: 0.85,
    fontSize: 52, fontFace: "Calibri", bold: true, color: C.purple,
    align: "center", valign: "middle",
  });

  slide.addText("AI commitment tracker that lives inside Gmail", {
    x: 0.5, y: 2.95, w: 9, h: 0.5,
    fontSize: 18, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle",
  });

  slide.addText("Built for Design4Future 2026 by Nischal Kotamraju", {
    x: 0.5, y: 3.55, w: 9, h: 0.4,
    fontSize: 13, fontFace: "Calibri", color: "9ca3af",
    align: "center", valign: "middle",
  });

  slide.addText("trygetrex.com", {
    x: 0.5, y: 4.1, w: 9, h: 0.45,
    fontSize: 14, fontFace: "Calibri", bold: true, color: C.purple,
    align: "center", valign: "middle",
  });
}

// ─────────────────────────────────────────────
// Write file
// ─────────────────────────────────────────────
pres.writeFile({ fileName: "/Users/nischalkotamraju/Desktop/rex/Rex_Presentation.pptx" })
  .then(() => console.log("Done: Rex_Presentation.pptx"))
  .catch(err => { console.error(err); process.exit(1); });
