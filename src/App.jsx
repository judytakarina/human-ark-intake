import { useState } from "react";

// ─── REPLACE THIS with your Formspree endpoint after signing up at formspree.io ───
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqpdbeq";

const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const CREAM = "#FAF7F2";

const steps = [
  {
    id: 1,
    label: "Company",
    question: "Let's start with the basics.",
    fields: [
      { name: "company", type: "text", placeholder: "Company name", required: true },
      { name: "website", type: "text", placeholder: "Website (e.g. yourcompany.com)", required: false },
    ],
  },
  {
    id: 2,
    label: "What you do",
    question: "What does your company do?",
    subtitle: "Keep it to 1–2 sentences.",
    fields: [
      { name: "description", type: "textarea", placeholder: "We build / sell / enable…", required: true },
    ],
  },
  {
    id: 3,
    label: "Challenge",
    question: "What is the main challenge you're trying to solve right now?",
    fields: [
      {
        name: "challenge",
        type: "chips",
        required: true,
        options: ["Scaling revenue", "Fixing operations", "Building GTM", "Product delays", "Restructuring", "Leadership gap", "Other"],
        allowOther: true,
      },
    ],
  },
  {
    id: 4,
    label: "Outcome",
    question: "What outcome do you want this operator to deliver?",
    subtitle: "In the next 12 months we want to achieve…",
    fields: [
      { name: "outcome", type: "text" },
        ]
  }
  ]
function App() {return "Human Ark Intake"}
export default App
