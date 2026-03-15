import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqpdbeq";
const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const CREAM = "#FAF7F2";

const HumanArkLogo = () => (
  <img src="/src/IMG_9171.jpeg" alt="Human Ark" style={{ width: "70px", height: "auto" }} />
);

const steps = [
  { id: 1, label: "Company", question: "Let's start with the basics.", fields: [ { name: "company", type: "text", placeholder: "Company name", required: true }, { name: "website", type: "text", placeholder: "Website (e.g. yourcompany.com)", required: false } ] },
  { id: 2, label: "What you do", question: "What does your company do?", subtitle: "Keep it to 1-2 sentences.", fields: [ { name: "description", type: "textarea", placeholder: "We build / sell / enable...", required: true } ] },
  { id: 3, label: "Challenge", question: "What is the main challenge you're trying to solve right now?", fields: [ { name: "challenge", type: "chips", required: true, options: ["Scaling revenue", "Fixing operations", "Building GTM", "Product delays", "Restructuring", "Leadership gap", "Other"], allowOther: true } ] },
  { id: 4, label: "Outcome", question: "What outcome do you want this operator to deliver?", subtitle: "In the next 12 months we want to achieve...", fields: [ { name: "outcome", type: "textarea", placeholder: "Describe the result, not the tasks...", required: true } ] },
  { id: 5, label: "Role", question: "What type of role are you considering?", fields: [ { name: "role", type: "chips", required: true, options: ["COO", "CRO / VP Sales", "Head of Product", "Growth", "Interim operator", "Fractional leader", "Not sure yet"] } ] },
  { id: 6, label: "Stage", question: "What stage is the company at?", fields: [ { name: "stage", type: "radio", required: true, options: ["Pre-seed", "Seed", "Series A", "Series B+", "Scale-up"] } ] },
  { id: 7, label: "Timeline", question: "What timeline are you working with?", fields: [ { name: "timeline", type: "radio", required: true, options: ["Urgent - 0-2 months", "Soon - 3-6 months", "Exploratory"] } ] },
  { id: 8, label: "Budget", question: "Is there a budget already allocated for this role?", fields: [ { name: "budget", type: "radio", required: true, options: ["Yes", "Not yet", "Flexible"] } ] },
  { id: 9, label: "Budget size", question: "What is the approximate budget range?", subtitle: "This helps us match the right operator profile.", showIf: (data) => data.budget === "Yes" || data.budget === "Flexible", fields: [ { name: "budget_range", type: "radio", required: true, options: ["Under 5k / month", "5k-10k / month", "10k-20k / month", "20k+ / month", "Equity only / TBD"] } ] },
  { id: 10, label: "Contact", question: "Last step - how do we reach you?", subtitle: "We'll be in touch within 48 hours.", fields: [ { name: "contact_name", type: "text", placeholder: "Your name", required: true }, { name: "contact_role", type: "text", placeholder: "Your role (e.g. CEO, Co-founder)", required: false }, { name: "contact_email", type: "email", placeholder: "Your email address", required: true } ] },
];

const inputStyle = { width: "100%", padding: "13px 16px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "4px", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: NAVY, background: "white", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };

function ChipsField({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];
  const hasOther = selected.includes("Other");
  const otherValue = selected.find(s => s !== "Other" && !field.options.includes(s)) || "";
  const toggle = (opt) => { if (opt === "Other") { onChange(hasOther ? selected.filter(s => s !== "Other" && field.options.includes(s)) : [...selected.filter(s => field.options.includes(s)), "Other"]); return; } onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]); };
  const handleOtherText = (e) => { const text = e.target.value; const base = selected.filter(s => field.options.includes(s) || s === "Other"); if (text) { onChange([...base.filter(s => s !== "Other"), "Other", text]); } else { onChange([...base]); } };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        {field.options.map((opt) => { const active = opt === "Other" ? hasOther : selected.includes(opt); return ( <button key={opt} onClick={() => toggle(opt)} style={{ padding: "10px 20px", borderRadius: "3px", border: "1px solid " + (active ? GOLD : "rgba(201,168,76,0.3)"), background: active ? GOLD : "transparent", color: active ? "white" : NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em" }}>{opt}</button> ); })}
      </div>
      {hasOther && field.allowOther && ( <input type="text" placeholder="Please specify..." value={otherValue} onChange={handleOtherText} style={{ ...inputStyle, marginTop: "4px" }} autoFocus /> )}
    </div>
  );
}

function RadioField({ field, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {field.options.map((opt) => { const active = value === opt; return ( <button key={opt} onClick={() => onChange(opt)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 18px", borderRadius: "4px", border: "1px solid " + (active ? GOLD : "rgba(201,168,76,0.3)"), background: active ? "rgba(201,168,76,0.08)" : "white", color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: active ? "600" : "400", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}><span style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, border: "2px solid " + (active ? GOLD : "rgba(201,168,76,0.4)"), background: active ? GOLD : "transparent", transition: "all 0.2s" }} />{opt}</button> ); })}
    </div>
  );
}

export default function HumanArkIntake() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});
  const visibleSteps = steps.filter(s => !s.showIf || s.showIf(formData));
  const step = visibleSteps[current];
  const totalVisible = visibleSteps.length;
  const getValue = (name) => { const field = step.fields.find(f => f.name === name); return formData[name] ?? (field?.type === "chips" ? [] : ""); };
  const setValue = (name, val) => { setFormData(prev => ({ ...prev, [name]: val })); if (errors[name]) setErrors(prev => ({ ...prev, [name]: null })); };
  const validate = () => { const newErrors = {}; for (const field of step.fields) { if (field.required) { const val = formData[field.name]; if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && val.trim() === "")) newErrors[field.name] = "This field is required."; if (field.type === "email" && val && !/\S+@\S+\.\S+/.test(val)) newErrors[field.name] = "Please enter a valid email address."; } } setErrors(newErrors); return Object.keys(newErrors).length === 0; };
  const handleSubmit = async () => { if (!validate()) return; setSubmitting(true); setSubmitError(null); const payload = { "Company": formData.company || "", "Website": formData.website || "-", "What they do": formData.description || "", "Main challenge": Array.isArray(formData.challenge) ? formData.challenge.join(", ") : formData.challenge || "", "Desired outcome": formData.outcome || "", "Role type": Array.isArray(formData.role) ? formData.role.join(", ") : formData.role || "", "Company stage": formData.stage || "", "Timeline": formData.timeline || "", "Budget": formData.budget || "", "Budget range": formData.budget_range || "-", "Contact name": formData.contact_name || "", "Contact role": formData.contact_role || "-", "Contact email": formData.contact_email || "", "_replyto": formData.contact_email || "", "_subject": "New Venture Intake - " + (formData.company || "Unknown") }; try { const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) }); if (res.ok) { setSubmitted(true); } else { const data = await res.json(); setSubmitError(data?.errors?.[0]?.message || "Something went wrong."); } } catch (e) { setSubmitError("Network error. Please try again."); } finally { setSubmitting(false); } };
  const next = () => { if (!validate()) return; if (current < totalVisible - 1) { setCurrent(c => c + 1); } else { handleSubmit(); } };
  const back = () => { if (current > 0) setCurrent(c => c - 1); };
  const progress = ((current + 1) / totalVisible) * 100;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}><HumanArkLogo /></div>
          <div style={{ width: "1px", height: "40px", background: GOLD, margin: "0 auto 24px" }} />
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "16px" }}>Thank you</div>
          <h1 style={{ fontSize: "30px", fontWeight: "400", color: NAVY, margin: "0 0 16px", lineHeight: 1.3 }}>We've received your intake.</h1>
          <p style={{ fontSize: "16px", color: NAVY + "99", lineHeight: 1.8, margin: "0 0 32px" }}>A member of the Human Ark team will be in touch within 48 hours at <strong style={{ color: NAVY }}>{formData.contact_email}</strong>.</p>
          <div style={{ width: "40px", height: "1px", background: GOLD, margin: "0 auto 24px" }} />
          <a href="https://humanark.eu" style={{ display: "inline-block", padding: "12px 32px", border: "1px solid " + GOLD, borderRadius: "3px", color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>Back to humanark.eu</a>
          <div style={{ marginTop: "24px", fontSize: "11px", color: NAVY + "55", letterSpacing: "0.1em" }}>HUMANARK.EU · INFO@HUMANARK.EU</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column", fontFamily: "'Cormorant Garamond', serif" }}>
      <div style={{ background: CREAM, borderBottom: "1px solid rgba(201,168,76,0.2)", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <HumanArkLogo />
          <div>
            <div style={{ fontSize: "17px", fontWeight: "400", color: NAVY, letterSpacing: "0.18em", textTransform: "uppercase" }}>Human Ark</div>
            <div style={{ fontSize: "11px", color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase" }}>Venture Operator Network</div>
          </div>
        </div>
        <div style={{ fontSize: "12px", color: NAVY + "66", letterSpacing: "0.1em" }}>{current + 1} / {totalVisible}</div>
      </div>
      <div style={{ height: "2px", background: "rgba(201,168,76,0.15)" }}><div style={{ height: "100%", background: GOLD, width: progress + "%", transition: "width 0.4s ease" }} /></div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ maxWidth: "520px", width: "100%" }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "40px" }}>{visibleSteps.map((s, i) => ( <div key={s.id} style={{ height: "2px", flex: 1, borderRadius: "1px", background: i <= current ? GOLD : "rgba(201,168,76,0.2)", transition: "background 0.3s" }} /> ))}</div>
          <div style={{ width: "28px", height: "2px", background: GOLD, marginBottom: "20px" }} />
          <div style={{ fontSize: "11px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Question {current + 1}</div>
          <h2 style={{ fontSize: "28px", fontWeight: "400", color: NAVY, margin: "0 0 8px", lineHeight: 1.2, letterSpacing: "0.01em" }}>{step.question}</h2>
          {step.subtitle && <p style={{ fontSize: "15px", color: GOLD, margin: "0 0 28px", lineHeight: 1.6, fontStyle: "italic" }}>{step.subtitle}</p>}
          {!step.subtitle && <div style={{ marginBottom: "28px" }} />}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {step.fields.map((field) => (
              <div key={field.name}>
                {(field.type === "text" || field.type === "email") && ( <input type={field.type} placeholder={field.placeholder} value={getValue(field.name)} onChange={(e) => setValue(field.name, e.target.value)} style={{ ...inputStyle, borderColor: errors[field.name] ? "#C0392B" : "rgba(201,168,76,0.3)" }} onFocus={(e) => e.target.style.borderColor = GOLD} onBlur={(e) => e.target.style.borderColor = errors[field.name] ? "#C0392B" : "rgba(201,168,76,0.3)"} /> )}
                {field.type === "textarea" && ( <textarea placeholder={field.placeholder} value={getValue(field.name)} onChange={(e) => setValue(field.name, e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", minHeight: "100px", borderColor: errors[field.name] ? "#C0392B" : "rgba(201,168,76,0.3)" }} onFocus={(e) => e.target.style.borderColor = GOLD} onBlur={(e) => e.target.style.borderColor = errors[field.name] ? "#C0392B" : "rgba(201,168,76,0.3)"} /> )}
                {field.type === "chips" && <ChipsField field={field} value={getValue(field.name)} onChange={(val) => setValue(field.name, val)} />}
                {field.type === "radio" && <RadioField field={field} value={getValue(field.name)} onChange={(val) => setValue(field.name, val)} />}
                {errors[field.name] && <div style={{ fontSize: "13px", color: "#C0392B", marginTop: "6px" }}>{errors[field.name]}</div>}
              </div>
            ))}
          </div>
          {submitError && <div style={{ marginTop: "16px", padding: "12px 16px", background: "#FDF2F2", border: "1px solid #E8C0C0", borderRadius: "4px", fontSize: "14px", color: "#C0392B" }}>{submitError}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "44px" }}>
            <button onClick={back} disabled={current === 0} style={{ padding: "11px 24px", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "3px", background: "transparent", color: NAVY + "88", fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase", cursor: current === 0 ? "not-allowed" : "pointer", opacity: current === 0 ? 0.3 : 1 }}>Back</button>
            <button onClick={next} disabled={submitting} style={{ padding: "13px 36px", border: "1px solid " + GOLD, borderRadius: "3px", background: GOLD, color: "white", fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer" }} onMouseEnter={(e) => { if (!submitting) { e.target.style.background = "transparent"; e.target.style.color = GOLD; }}} onMouseLeave={(e) => { if (!submitting) { e.target.style.background = GOLD; e.target.style.color = "white"; }}}>{submitting ? "Sending..." : current === totalVisible - 1 ? "Submit" : "Continue"}</button>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px 32px", borderTop: "1px solid rgba(201,168,76,0.15)", display: "flex", justifyContent: "center", gap: "24px" }}>
        <span style={{ fontSize: "11px", color: NAVY + "55", letterSpacing: "0.1em" }}>HUMANARK.EU</span>
        <span style={{ fontSize: "11px", color: NAVY + "30" }}>·</span>
        <span style={{ fontSize: "11px", color: NAVY + "55", letterSpacing: "0.1em" }}>INFO@HUMANARK.EU</span>
      </div>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap'); * { box-sizing: border-box; } button { outline: none; }"}</style>
    </div>
  );
}
