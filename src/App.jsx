import { useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqpdbeq";

const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const CREAM = "#FAF7F2";

const steps = [
  { id: 1, label: "Company", question: "Let's start with the basics.", fields: [ { name: "company", type: "text", placeholder: "Company name", required: true }, { name: "website", type: "text", placeholder: "Website (e.g. yourcompany.com)", required: false } ] },
  { id: 2, label: "What you do", question: "What does your company do?", subtitle: "Keep it to 1–2 sentences.", fields: [ { name: "description", type: "textarea", placeholder: "We build / sell / enable…", required: true } ] },
  { id: 3, label: "Challenge", question: "What is the main challenge you're trying to solve right now?", fields: [ { name: "challenge", type: "chips", required: true, options: ["Scaling revenue", "Fixing operations", "Building GTM", "Product delays", "Restructuring", "Leadership gap", "Other"], allowOther: true } ] },
  { id: 4, label: "Outcome", question: "What outcome do you want this operator to deliver?", subtitle: '"In the next 12 months we want to achieve…"', fields: [ { name: "outcome", type: "textarea", placeholder: "Describe the result, not the tasks…", required: true } ] },
  { id: 5, label: "Role", question: "What type of role are you considering?", fields: [ { name: "role", type: "chips", required: true, options: ["COO", "CRO / VP Sales", "Head of Product", "Growth", "Interim operator", "Fractional leader", "Not sure yet"] } ] },
  { id: 6, label: "Stage", question: "What stage is the company at?", fields: [ { name: "stage", type: "radio", required: true, options: ["Pre-seed", "Seed", "Series A", "Series B+", "Scale-up"] } ] },
  { id: 7, label: "Timeline", question: "What timeline are you working with?", fields: [ { name: "timeline", type: "radio", required: true, options: ["Urgent — 0–2 months", "Soon — 3–6 months", "Exploratory"] } ] },
  { id: 8, label: "Budget", question: "Is there a budget already allocated for this role?", fields: [ { name: "budget", type: "radio", required: true, options: ["Yes", "Not yet", "Flexible"] } ] },
  { id: 9, label: "Contact", question: "Last step — how do we reach you?", subtitle: "We'll be in touch within 48 hours.", fields: [ { name: "contact_name", type: "text", placeholder: "Your name", required: true }, { name: "contact_role", type: "text", placeholder: "Your role (e.g. CEO, Co-founder)", required: false }, { name: "contact_email", type: "email", placeholder: "Your email address", required: true } ] },
];

const totalSteps = steps.length;
const inputStyle = { width: "100%", padding: "14px 16px", border: "1.5px solid rgba(11,31,58,0.2)", borderRadius: "8px", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", color: NAVY, background: "white", outline: "none", boxSizing: "border-box", transition: "border-color 0.18s" };

function ChipsField({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];
  const [otherText, setOtherText] = useState("");
  const toggle = (opt) => { if (opt === "Other") { onChange(selected.includes("Other") ? selected.filter(s => s !== "Other") : [...selected, "Other"]); return; } onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]); };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
        {field.options.map((opt) => { const active = selected.includes(opt); return ( <button key={opt} onClick={() => toggle(opt)} style={{ padding: "10px 18px", borderRadius: "6px", border: `1.5px solid ${active ? GOLD : "rgba(11,31,58,0.2)"}`, background: active ? NAVY : "white", color: active ? GOLD : NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontWeight: active ? "600" : "400", cursor: "pointer", transition: "all 0.18s ease" }}>{opt}</button> ); })}
      </div>
      {selected.includes("Other") && field.allowOther && ( <input type="text" placeholder="Please specify…" value={otherText} onChange={(e) => { setOtherText(e.target.value); onChange([...selected.filter(s => s !== "Other"), e.target.value || "Other"]); }} style={inputStyle} /> )}
    </div>
  );
}

function RadioField({ field, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {field.options.map((opt) => { const active = value === opt; return ( <button key={opt} onClick={() => onChange(opt)} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderRadius: "8px", border: `1.5px solid ${active ? GOLD : "rgba(11,31,58,0.15)"}`, background: active ? `${NAVY}08` : "white", color: NAVY, fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: active ? "600" : "400", cursor: "pointer", textAlign: "left" }}><span style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${active ? GOLD : "rgba(11,31,58,0.3)"}`, background: active ? GOLD : "transparent", flexShrink: 0 }} />{opt}</button> ); })}
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
  const step = steps[current];
  const getValue = (name) => { const field = step.fields.find(f => f.name === name); return formData[name] ?? (field?.type === "chips" ? [] : ""); };
  const setValue = (name, val) => { setFormData(prev => ({ ...prev, [name]: val })); if (errors[name]) setErrors(prev => ({ ...prev, [name]: null })); };
  const validate = () => { const newErrors = {}; for (const field of step.fields) { if (field.required) { const val = formData[field.name]; if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === "string" && val.trim() === "")) { newErrors[field.name] = "This field is required."; } if (field.type === "email" && val && !/\S+@\S+\.\S+/.test(val)) { newErrors[field.name] = "Please enter a valid email address."; } } } setErrors(newErrors); return Object.keys(newErrors).length === 0; };
  const handleSubmit = async () => { if (!validate()) return; setSubmitting(true); setSubmitError(null); const payload = { "Company": formData.company || "", "Website": formData.website || "—", "What they do": formData.description || "", "Main challenge": Array.isArray(formData.challenge) ? formData.challenge.join(", ") : formData.challenge || "", "Desired outcome": formData.outcome || "", "Role type": Array.isArray(formData.role) ? formData.role.join(", ") : formData.role || "", "Company stage": formData.stage || "", "Timeline": formData.timeline || "", "Budget": formData.budget || "", "Contact name": formData.contact_name || "", "Contact role": formData.contact_role || "—", "Contact email": formData.contact_email || "", "_replyto": formData.contact_email || "", "_subject": `New Venture Intake — ${formData.company || "Unknown"}` }; try { const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) }); if (res.ok) { setSubmitted(true); } else { const data = await res.json(); setSubmitError(data?.errors?.[0]?.message || "Something went wrong."); } } catch (e) { setSubmitError("Network error. Please try again."); } finally { setSubmitting(false); } };
  const next = () => { if (!validate()) return; if (current < totalSteps - 1) { setCurrent(c => c + 1); } else { handleSubmit(); } };
  const back = () => { if (current > 0) setCurrent(c => c - 1); };
  const progress = ((current + 1) / totalSteps) * 100;

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", padding: "40px 20px" }}>
        <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14L11.5 19.5L22 9" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div style={{ fontSize: "11px", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Thank you</div>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: NAVY, margin: "0 0 16px" }}>We've received your intake.</h1>
          <p style={{ fontSize: "17px", color: `${NAVY}99`, lineHeight: 1.7, margin: "0 0 32px" }}>A member of the Human Ark team will be in touch within 48 hours at <strong>{formData.contact_email}</strong>.</p>
          <div style={{ fontSize: "13px", color: `${NAVY}66` }}>humanark.eu · info@humanark.eu</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: CREAM, display: "flex", flexDirection: "column", fontFamily: "'Cormorant Garamond', serif" }}>
      <div style={{ background: NAVY, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div style={{ fontSize: "10px", letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "2px" }}>Human Ark</div><div style={{ fontSize: "13px", color: `${CREAM}99` }}>Venture Intake</div></div>
        <div style={{ fontSize: "12px", color: `${CREAM}66` }}>{current + 1} / {totalSteps}</div>
      </div>
      <div style={{ height: "3px", background: `${NAVY}18` }}><div style={{ height: "100%", background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, width: `${progress}%`, transition: "width 0.4s ease" }} /></div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ maxWidth: "540px", width: "100%" }}>
          <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>{steps.map((s, i) => (<div key={s.id} style={{ height: "3px", flex: 1, borderRadius: "2px", background: i <= current ? GOLD : `${NAVY}20`, transition: "background 0.3s ease" }} />))}</div>
          <div style={{ fontSize: "11px", letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>Question {step.id}</div>
          <h2 style={{ fontSize: "26px", fontWeight: "600", color: NAVY, margin: "0 0 8px", lineHeight: 1.25 }}>{step.question}</h2>
          {step.subtitle && <p style={{ fontSize: "15px", color: `${NAVY}77`, margin: "0 0 28px", lineHeight: 1.5, fontStyle: "italic" }}>{step.subtitle}</p>}
          {!step.subtitle && <div style={{ marginBottom: "28px" }} />}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {step.fields.map((field) => (
              <div key={field.name}>
                {(field.type === "text" || field.type === "email") && (<input type={field.type} placeholder={field.placeholder} value={getValue(field.name)} onChange={(e) => setValue(field.name, e.target.value)} style={{ ...inputStyle, borderColor: errors[field.name] ? "#C0392B" : "rgba(11,31,58,0.2)" }} onFocus={(e) => e.target.style.borderColor = GOLD} onBlur={(e) => e.target.style.borderColor = errors[field.name] ? "#C0392B" : "rgba(11,31,58,0.2)"} />)}
                {field.type === "textarea" && (<textarea placeholder={field.placeholder} value={getValue(field.name)} onChange={(e) => setValue(field.name, e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical", minHeight: "100px", borderColor: errors[field.name] ? "#C0392B" : "rgba(11,31,58,0.2)" }} onFocus={(e) => e.target.style.borderColor = GOLD} onBlur={(e) => e.target.style.borderColor = errors[field.name] ? "#C0392B" : "rgba(11,31,58,0.2)"} />)}
                {field.type === "chips" && (<ChipsField field={field} value={getValue(field.name)} onChange={(val) => setValue(field.name, val)} />)}
                {field.type === "radio" && (<RadioField field={field} value={getValue(field.name)} onChange={(val) => setValue(field.name, val)} />)}
                {errors[field.name] && (<div style={{ fontSize: "13px", color: "#C0392B", marginTop: "6px" }}>{errors[field.name]}</div>)}
              </div>
            ))}
          </div>
          {submitError && (<div style={{ marginTop: "16px", padding: "12px 16px", background: "#FDF2F2", border: "1px solid #E8C0C0", borderRadius: "6px", fontSize: "14px", color: "#C0392B" }}>{submitError}</div>)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
            <button onClick={back} disabled={current === 0} style={{ padding: "12px 22px", border: "1.5px solid rgba(11,31,58,0.2)", borderRadius: "6px", background: "transparent", color: `${NAVY}88`, fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", cursor: current === 0 ? "not-allowed" : "pointer", opacity: current === 0 ? 0.3 : 1 }}>← Back</button>
            <button onClick={next} disabled={submitting} style={{ padding: "14px 32px", border: "none", borderRadius: "6px", background: submitting ? `${NAVY}80` : NAVY, color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", cursor: submitting ? "not-allowed" : "pointer", boxShadow: `0 4px 20px ${NAVY}30` }} onMouseEnter={(e) => { if (!submitting) { e.target.style.background = GOLD; e.target.style.color = NAVY; }}} onMouseLeave={(e) => { if (!submitting) { e.target.style.background = NAVY; e.target.style.color = GOLD; }}}>{submitting ? "Sending…" : current === totalSteps - 1 ? "Submit →" : "Continue →"}</button>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 32px", borderTop: "1px solid rgba(11,31,58,0.08)", display: "flex", justifyContent: "center", gap: "24px" }}>
        <span style={{ fontSize: "12px", color: `${NAVY}55` }}>humanark.eu</span>
        <span style={{ fontSize: "12px", color: `${NAVY}30` }}>·</span>
        <span style={{ fontSize: "12px", color: `${NAVY}55` }}>info@humanark.eu</span>
      </div>
    </div>
  );
}
