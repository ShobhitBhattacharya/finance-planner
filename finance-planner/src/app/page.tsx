"use client";

import { useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const money = (value: number) => inr.format(Math.max(0, value));

export default function Home() {
  const [income, setIncome] = useState(100000);
  const [essentials, setEssentials] = useState(60000);
  const [savings, setSavings] = useState(200000);
  const [monthlyInvesting, setMonthlyInvesting] = useState(40000);
  const [stability, setStability] = useState("Private salaried");
  const [goalName, setGoalName] = useState("Marriage");
  const [goalAmount, setGoalAmount] = useState(1500000);
  const [goalYears, setGoalYears] = useState(3);
  const [applied, setApplied] = useState({ income: 100000, essentials: 60000, savings: 200000, monthlyInvesting: 40000, stability: "Private salaried", goalName: "Marriage", goalAmount: 1500000, goalYears: 3 });
  const [updated, setUpdated] = useState(false);

  const plan = useMemo(() => {
    const { income, essentials, savings, goalYears, goalAmount, monthlyInvesting, stability } = applied;
    const bufferMonths = essentials ? savings / essentials : 0;
    const monthlyNeeded = goalYears > 0 ? Math.max(0, (goalAmount - savings * 0.15) / (goalYears * 12)) : goalAmount;
    const ratio = goalYears <= 3 ? [80, 20] : goalYears <= 7 ? [50, 50] : [25, 75];
    const gap = monthlyNeeded - monthlyInvesting;
    const disruption = stability === "Business / freelance" ? 9 : stability === "Government / highly stable" ? 4 : 6;
    const savingsRate = income > 0 ? (monthlyInvesting / income) * 100 : 0;
    const healthScore = Math.min(100, Math.round(35 + Math.min(bufferMonths, 9) * 5 + Math.min(savingsRate, 35) * 0.8 + (gap <= 0 ? 10 : 0)));
    return { bufferMonths, monthlyNeeded, ratio, gap, disruption, savingsRate, healthScore };
  }, [applied]);

  return (
    <main>
      <nav className="nav"><span className="brand">Goalwise</span><span className="nav-note">Private financial planning</span><button className="ghost">Sign in</button></nav>
      <section className="hero">
        <p className="eyebrow">INDIA · GOAL-BASED PLANNING</p>
        <h1>Make the trade-offs<br /><em>before</em> life makes them for you.</h1>
        <p className="intro">A transparent financial-planning simulator for your goals, income uncertainty, and next best moves. Not investment advice.</p>
      </section>
      <section className="workspace">
        <div className="card form-card">
          <div className="section-heading"><p className="eyebrow">01 · YOUR SNAPSHOT</p><h2>Start with today</h2></div>
          <div className="grid two">
            <Field label="Monthly take-home income" value={income} onChange={setIncome} />
            <Field label="Essential monthly expenses" value={essentials} onChange={setEssentials} />
            <Field label="Liquid savings" value={savings} onChange={setSavings} />
            <Field label="Monthly goal contribution" value={monthlyInvesting} onChange={setMonthlyInvesting} />
          </div>
          <label className="field"><span>Income pattern</span><select value={stability} onChange={(e) => setStability(e.target.value)}><option>Private salaried</option><option>Government / highly stable</option><option>Business / freelance</option><option>Variable income</option></select></label>
          <div className="section-heading goal-heading"><p className="eyebrow">02 · A PRIORITY GOAL</p><h2>What are you planning for?</h2></div>
          <div className="grid two">
            <label className="field"><span>Goal</span><input value={goalName} onChange={(e) => setGoalName(e.target.value)} /></label>
            <Field label="Target amount" value={goalAmount} onChange={setGoalAmount} />
            <Field label="Years until needed" value={goalYears} onChange={setGoalYears} />
          </div>
          <div className="actions"><button className="primary" onClick={() => { setApplied({ income, essentials, savings, monthlyInvesting, stability, goalName, goalAmount, goalYears }); setUpdated(true); }}>Update my plan</button><span>Results update when you choose to apply your changes.</span></div>
          <p className="small">All values are editable assumptions. This demo keeps your information in this browser session only.</p>
        </div>
        <aside className="results">
          <div className="card result-card highlight"><p className="eyebrow">PLAN HEALTH</p><div className="score">{plan.healthScore}</div><p>Your monthly goal contribution is {plan.savingsRate.toFixed(0)}% of take-home income. Readiness is driven by emergency cash, realistic timelines, and consistency.</p></div>
          {updated && <div className="applied-message" role="status">✓ Plan updated — results now reflect your latest assumptions.</div>}
          <div className="card result-card"><p className="eyebrow">GOAL FEASIBILITY</p><h3>{applied.goalName} needs <strong>{money(plan.monthlyNeeded)}</strong><small> per month</small></h3><p>{plan.gap > 0 ? `You are short by ${money(plan.gap)} each month at the current timeline.` : "Your current monthly contribution can support this goal under these assumptions."}</p></div>
          <div className="card result-card"><p className="eyebrow">GOAL-WISE PRINCIPLE</p><h3><strong>{plan.ratio[0]}%</strong> stability · <strong>{plan.ratio[1]}%</strong> growth</h3><p>{applied.goalYears <= 3 ? "A fixed, near-term goal generally needs capital protection more than return chasing." : applied.goalYears <= 7 ? "This horizon can balance stability with growth, while keeping the deadline visible." : "A long horizon can tolerate more growth exposure, subject to your risk capacity."}</p></div>
          <div className="card result-card"><p className="eyebrow">NEXT BEST MOVE</p><h3>{plan.bufferMonths < plan.disruption ? "Strengthen your safety buffer" : plan.gap > 0 ? "Choose a trade-off" : "Stress-test this plan"}</h3><p>{plan.bufferMonths < plan.disruption ? `You currently have ${plan.bufferMonths.toFixed(1)} months of essentials saved. Your selected income pattern suggests testing a ${plan.disruption}-month interruption.` : plan.gap > 0 ? "Extend the deadline, lower the goal cost, or increase your monthly contribution—then compare the impact." : "Try higher inflation, lower returns, or a period without income before relying on this outcome."}</p></div>
        </aside>
      </section>
      <section className="trust"><div><p className="eyebrow">TRANSPARENT BY DESIGN</p><h2>Advice should never be a black box.</h2></div><p>Goalwise shows the assumptions behind every calculation. It provides educational planning guidance and does not recommend specific securities, funds, or guaranteed returns.</p></section>
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="field"><span>{label}</span><input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}
